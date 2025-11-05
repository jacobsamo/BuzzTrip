import { zid } from "convex-helpers/server/zod";
import { z } from "zod";
import { uppercaseFirstLetter } from "../../helpers";
import type { UserMap } from "../../types";
import {
  mapsEditSchema,
  mapUserSchema,
  mapViewEditSchema,
  userMapsSchema,
} from "../../zod-schemas";
import { Id } from "../_generated/dataModel";
import { MutationCtx } from "../_generated/server";
import { authedMutation, authedQuery, zodMutation } from "../helpers";
import { createCollectionFunction } from "./collections";
import { createMapUser } from "./mapUsers";
// Get methods

export const getMapUsers = authedQuery({
  args: {
    mapId: zid("maps"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("map_users")
      .withIndex("by_map_id", (q) => q.eq("map_id", args.mapId));
  },
});

export const getMap = authedQuery({
  args: {
    mapId: zid("maps"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.mapId);
  },
});

export const trackMapView = zodMutation({
  args: mapViewEditSchema,
  handler: async (ctx, args) => {
    await ctx.db.insert("mapViews", args);
  },
});

export const getMapViews = authedQuery({
  args: {
    mapId: zid("maps"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("mapViews")
      .withIndex("by_map_id", (q) => q.eq("mapId", args.mapId));
  },
});

// get all the maps for a user
export const getUserMaps = authedQuery({
  args: {
    userId: zid("users"),
  },
  returns: userMapsSchema.array(),
  handler: async (ctx, args) => {
    // we want all the links that a user could be added too
    const mapUsers = await ctx.db
      .query("map_users")
      .withIndex("by_user_id", (q) => q.eq("user_id", args.userId))
      .collect();

    const combinedMaps = await Promise.all(
      mapUsers.map(async (mapUser) => {
        const map = await ctx.db.get(mapUser.map_id);
        return {
          ...map,
          ...mapUser,
          _id: mapUser._id,
          map_id: mapUser.map_id,
        } as UserMap;
      })
    );
    return combinedMaps;
  },
});

const createMapSchema = z.object({
  userId: zid("users"),
  users: mapUserSchema
    .pick({
      user_id: true,
      permission: true,
    })
    .array()
    .optional(),
  map: mapsEditSchema,
});

/**
 * This function creates a map and all the associated data needed
 * @param {MutationCtx} ctx - the convex mutation context
 * @param {z.infer<typeof createMapSchema>} args - the args for the mutation
 * @returns {Promise<Id<"maps">>} - the id of the created map
 */
export const createMapFunction = async (
  ctx: MutationCtx,
  args: z.infer<typeof createMapSchema>
) => {
  try {
    const { users, map } = args;

    const mapId = await ctx.db.insert("maps", {
      ...map,
      title: uppercaseFirstLetter(map.title),
      owner_id: args.userId,
      mapTypeId: map.mapTypeId ?? "hybrid",
    });

    const userPromise =
      users?.map((user) =>
        createMapUser(ctx, {
          user_id: user.user_id,
          permission: user.permission,
          map_id: mapId,
        })
      ) ?? [];

    await Promise.all([
      ...userPromise,
      // we always want to create the owner
      createMapUser(ctx, {
        user_id: args.userId,
        permission: "owner",
        map_id: mapId,
      }),
      // create a default collection for the map
      createCollectionFunction(ctx, {
        collection: {
          map_id: mapId,
          title: "Default Collection",
          icon: "Folder",
        },
        userId: args.userId,
      }),
    ]);

    return mapId;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// // Mutations
export const createMap = authedMutation({
  args: createMapSchema.omit({ userId: true }),
  handler: async (ctx, args) =>
    await createMapFunction(ctx, { ...args, userId: ctx.user._id }),
});

export const updateMap = authedMutation({
  args: {
    mapId: zid("maps"),
    map: mapsEditSchema.omit({ _id: true, _creationTime: true }).partial(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.mapId, {
      ...args.map,
      ...(args.map.title
        ? { title: uppercaseFirstLetter(args.map.title) }
        : {}),
      updatedAt: new Date().toISOString(),
    });
  },
});

export const partialMapUpdate = authedMutation({
  args: {
    mapId: zid("maps"),
    map: mapsEditSchema.omit({ _id: true, _creationTime: true }).partial(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.mapId, {
      ...args.map,
      updatedAt: new Date().toISOString(),
    });
  },
});

export const updateMapThumbnail = authedMutation({
  args: {
    mapId: zid("maps"),
    thumbnailUrl: z.string(),
  },
  handler: async (ctx, args) => {
    // Authorization: Check if user has permission to edit this map
    const map = await ctx.db.get(args.mapId);
    if (!map) {
      throw new Error("Map not found");
    }

    // Check if user is the owner or has editor permission
    const mapUser = await ctx.db
      .query("map_users")
      .withIndex("by_map_id", (q) => q.eq("map_id", args.mapId))
      .filter((q) => q.eq(q.field("user_id"), ctx.user._id))
      .first();

    const isOwner = map.owner_id === ctx.user._id;
    const isEditor = mapUser?.permission === "editor" || mapUser?.permission === "owner";

    if (!isOwner && !isEditor) {
      throw new Error("Unauthorized: You don't have permission to update this map's thumbnail");
    }

    // Input validation: Check thumbnail size (max 5MB for base64)
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB in bytes
    if (args.thumbnailUrl.length > MAX_SIZE) {
      throw new Error("Thumbnail size exceeds maximum allowed size of 5MB");
    }

    // Validate base64 format if it's a data URL
    if (args.thumbnailUrl.startsWith("data:")) {
      const base64Pattern = /^data:image\/(jpeg|jpg|png|webp);base64,/;
      if (!base64Pattern.test(args.thumbnailUrl)) {
        throw new Error("Invalid thumbnail format. Must be a valid base64 image (JPEG, PNG, or WebP)");
      }
    }

    await ctx.db.patch(args.mapId, {
      thumbnailUrl: args.thumbnailUrl,
      updatedAt: new Date().toISOString(),
    });
  },
});

export const updateMapBounds = authedMutation({
  args: {
    mapId: zid("maps"),
    lat: z.number(),
    lng: z.number(),
    bounds: z.object({
      north: z.number(),
      south: z.number(),
      east: z.number(),
      west: z.number(),
    }),
    location_name: z.string().optional(),
  },
  handler: async (ctx, args) => {
    // Authorization: Check if user has permission to edit this map
    const map = await ctx.db.get(args.mapId);
    if (!map) {
      throw new Error("Map not found");
    }

    // Check if user is the owner or has editor permission
    const mapUser = await ctx.db
      .query("map_users")
      .withIndex("by_map_id", (q) => q.eq("map_id", args.mapId))
      .filter((q) => q.eq(q.field("user_id"), ctx.user._id))
      .first();

    const isOwner = map.owner_id === ctx.user._id;
    const isEditor = mapUser?.permission === "editor" || mapUser?.permission === "owner";

    if (!isOwner && !isEditor) {
      throw new Error("Unauthorized: You don't have permission to update this map's bounds");
    }

    await ctx.db.patch(args.mapId, {
      lat: args.lat,
      lng: args.lng,
      bounds: args.bounds,
      location_name: args.location_name,
      updatedAt: new Date().toISOString(),
    });
  },
});

export const deleteMap = authedMutation({
  args: {
    mapId: zid("maps"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.mapId as Id<"maps">);
  },
});
