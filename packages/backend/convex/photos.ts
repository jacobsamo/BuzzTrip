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
    });

    return photoId;
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
 * Get all photos for a specific marker
 */
export const getMarkerPhotos = authedQuery({
  args: {
    marker_id: zid("markers"),
  },
  returns: markerPhotoEditSchema.array(),
  handler: async (ctx, args) => {
    const photos = await ctx.db
      .query("marker_photos")
      .withIndex("by_marker_id", (q) => q.eq("marker_id", args.marker_id))
      .collect();

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
 * Delete a marker photo
 * Only the user who uploaded it can delete it
 */
export const deleteMarkerPhoto = authedMutation({
  args: {
    photo_id: zid("marker_photos"),
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
