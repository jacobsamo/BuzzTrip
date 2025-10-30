import { zid } from "convex-helpers/server/zod";
import { z } from "zod";
import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { authedMutation, authedQuery } from "./helpers";
import { markerPhotoEditSchema, placePhotoEditSchema } from "../zod-schemas";

/**
 * Generate an upload URL for photo uploads
 * This URL can be used to upload files directly to Convex storage
 */
export const generateUploadUrl = authedMutation({
  args: {},
  returns: v.string(),
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

/**
 * Save a place photo after it has been uploaded to storage
 */
export const savePlacePhoto = authedMutation({
  args: {
    place_id: zid("places"),
    storage_id: z.string(),
    width: z.number(),
    height: z.number(),
    caption: z.string().optional(),
  },
  returns: zid("place_photos"),
  handler: async (ctx, args) => {
    // Get the storage URL for the uploaded file
    const photoUrl = await ctx.storage.getUrl(args.storage_id);

    if (!photoUrl) {
      throw new Error("Failed to get photo URL from storage");
    }

    // Save the photo metadata
    const photoId = await ctx.db.insert("place_photos", {
      place_id: args.place_id,
      user_id: ctx.user._id,
      photo_url: photoUrl,
      storage_id: args.storage_id,
      width: args.width,
      height: args.height,
      caption: args.caption ?? "",
    });

    return photoId;
  },
});

/**
 * Save a marker photo after it has been uploaded to storage
 */
export const saveMarkerPhoto = authedMutation({
  args: {
    marker_id: zid("markers"),
    storage_id: z.string(),
    width: z.number(),
    height: z.number(),
    caption: z.string().optional(),
  },
  returns: zid("marker_photos"),
  handler: async (ctx, args) => {
    // Get the storage URL for the uploaded file
    const photoUrl = await ctx.storage.getUrl(args.storage_id);

    if (!photoUrl) {
      throw new Error("Failed to get photo URL from storage");
    }

    // Save the photo metadata
    const photoId = await ctx.db.insert("marker_photos", {
      marker_id: args.marker_id,
      user_id: ctx.user._id,
      photo_url: photoUrl,
      storage_id: args.storage_id,
      width: args.width,
      height: args.height,
      caption: args.caption ?? "",
      archived: false,
    });

    return photoId;
  },
});

/**
 * Batch save marker photos - useful for saving multiple photos at once
 * when a marker is created or edited
 */
export const saveMarkerPhotos = authedMutation({
  args: {
    marker_id: zid("markers"),
    photos: z.array(
      z.object({
        storage_id: z.string(),
        width: z.number(),
        height: z.number(),
        caption: z.string().optional(),
      })
    ),
  },
  returns: v.array(zid("marker_photos")),
  handler: async (ctx, args) => {
    const photoIds = [];

    for (const photo of args.photos) {
      // Get the storage URL for the uploaded file
      const photoUrl = await ctx.storage.getUrl(photo.storage_id);

      if (!photoUrl) {
        throw new Error(`Failed to get photo URL from storage for ${photo.storage_id}`);
      }

      // Save the photo metadata
      const photoId = await ctx.db.insert("marker_photos", {
        marker_id: args.marker_id,
        user_id: ctx.user._id,
        photo_url: photoUrl,
        storage_id: photo.storage_id,
        width: photo.width,
        height: photo.height,
        caption: photo.caption ?? "",
        archived: false,
      });

      photoIds.push(photoId);
    }

    return photoIds;
  },
});

/**
 * Get all photos for a specific place
 * Photos are public so anyone can view them
 */
export const getPlacePhotos = authedQuery({
  args: {
    place_id: zid("places"),
  },
  returns: placePhotoEditSchema.array(),
  handler: async (ctx, args) => {
    const photos = await ctx.db
      .query("place_photos")
      .withIndex("by_place_id", (q) => q.eq("place_id", args.place_id))
      .collect();

    return photos;
  },
});

/**
 * Get all non-archived photos for a specific marker
 */
export const getMarkerPhotos = authedQuery({
  args: {
    marker_id: zid("markers"),
    include_archived: z.boolean().optional(),
  },
  returns: markerPhotoEditSchema.array(),
  handler: async (ctx, args) => {
    const photos = await ctx.db
      .query("marker_photos")
      .withIndex("by_marker_archived", (q) =>
        q.eq("marker_id", args.marker_id).eq("archived", args.include_archived ? undefined : false)
      )
      .collect();

    // If include_archived is true but we used undefined above, filter manually
    if (args.include_archived) {
      return await ctx.db
        .query("marker_photos")
        .withIndex("by_marker_id", (q) => q.eq("marker_id", args.marker_id))
        .collect();
    }

    return photos;
  },
});

/**
 * Delete a place photo
 * Only the user who uploaded it can delete it
 */
export const deletePlacePhoto = authedMutation({
  args: {
    photo_id: zid("place_photos"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const photo = await ctx.db.get(args.photo_id);

    if (!photo) {
      throw new Error("Photo not found");
    }

    // Only allow deletion by the user who uploaded it
    if (photo.user_id !== ctx.user._id) {
      throw new Error("You can only delete your own photos");
    }

    // Delete from storage if storage_id exists
    if (photo.storage_id) {
      await ctx.storage.delete(photo.storage_id);
    }

    // Delete the photo metadata
    await ctx.db.delete(args.photo_id);

    return null;
  },
});

/**
 * Archive a marker photo (soft delete)
 * Anyone can archive marker photos, but they're not permanently deleted
 * This allows for future restoration features
 */
export const archiveMarkerPhoto = authedMutation({
  args: {
    photo_id: zid("marker_photos"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const photo = await ctx.db.get(args.photo_id);

    if (!photo) {
      throw new Error("Photo not found");
    }

    // Archive the photo (soft delete)
    await ctx.db.patch(args.photo_id, {
      archived: true,
      archived_at: new Date().toISOString(),
    });

    return null;
  },
});

/**
 * Unarchive a marker photo
 * Restores an archived photo
 */
export const unarchiveMarkerPhoto = authedMutation({
  args: {
    photo_id: zid("marker_photos"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const photo = await ctx.db.get(args.photo_id);

    if (!photo) {
      throw new Error("Photo not found");
    }

    // Unarchive the photo
    await ctx.db.patch(args.photo_id, {
      archived: false,
      archived_at: undefined,
    });

    return null;
  },
});

/**
 * Get photos uploaded by a specific user for places
 */
export const getUserPlacePhotos = authedQuery({
  args: {
    user_id: zid("users").optional(),
  },
  returns: placePhotoEditSchema.array(),
  handler: async (ctx, args) => {
    const userId = args.user_id ?? ctx.user._id;

    const photos = await ctx.db
      .query("place_photos")
      .withIndex("by_user_id", (q) => q.eq("user_id", userId))
      .collect();

    return photos;
  },
});

/**
 * Get photos uploaded by a specific user for markers
 */
export const getUserMarkerPhotos = authedQuery({
  args: {
    user_id: zid("users").optional(),
  },
  returns: markerPhotoEditSchema.array(),
  handler: async (ctx, args) => {
    const userId = args.user_id ?? ctx.user._id;

    const photos = await ctx.db
      .query("marker_photos")
      .withIndex("by_user_id", (q) => q.eq("user_id", userId))
      .collect();

    return photos;
  },
});
