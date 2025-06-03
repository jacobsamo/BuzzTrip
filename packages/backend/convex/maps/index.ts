import { v } from "convex/values";
import type { CombinedMarker, IconType } from "../../../db/src/types";
import { Id } from "../_generated/dataModel";
import { mutation, MutationCtx, query } from "../_generated/server";
import { mapSchema, permissionEnum } from "../schemas/maps";

// Get methods

export const getMarkersView = query({
  args: {
    map_id: v.id("maps"),
    markerId: v.optional(v.id("markers")),
  },
  handler: async (ctx, { map_id, markerId }) => {
    // Build the initial query on the markers table
    let markersQuery = ctx.db
      .query("markers")
      .withIndex("by_map_id", (q) => q.eq("map_id", map_id));

    // If markerId is provided, add an additional filter
    if (markerId) {
      markersQuery = markersQuery.filter((q) => q.eq(q.field("_id"), markerId));
    }

    // Execute the query to get the markers
    const markers = await markersQuery.collect();

    // For each marker, fetch the associated place and combine the data
    const combinedMarkers = await Promise.all(
      markers.map(async (marker) => {
        const place = await ctx.db.get(marker.place_id);

        const newMarker: CombinedMarker = {
          ...marker,
          lat: place?.lat ?? marker.lat,
          lng: place?.lng ?? marker.lng,
          place_id: place?._id ?? marker.place_id,
          bounds: place?.bounds ?? null,
          icon: marker.icon as IconType,
        };
        return newMarker;
      })
    );

    return combinedMarkers;
  },
});

export const getMapUsers = query({
  args: {
    mapId: v.id("maps"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("map_users")
      .withIndex("by_map_id", (q) => q.eq("map_id", args.mapId));
  },
});

export const getMap = query({
  args: {
    mapId: v.id("maps"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.mapId);
  },
});

// we don't need this any more really
export const getAllMapData = null;

// get all the maps for a user
export const getUserMaps = query({
  args: {
    userId: v.id("users"),
  },
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
          map_id: mapUser.map_id,
        };
      })
    );

    console.log("getUserMaps", {
      userId: args.userId,
      mapUsers: mapUsers.length,
      combinedMaps: combinedMaps.length,
    });
    return combinedMaps;
  },
});

export const searchUsers = query({
  args: {},
  handler: async (ctx, args) => {},
});

// Mutations
export const createMap = mutation({
  args: {
    users: v.optional(
      v.array(
        v.object({
          userId: v.id("users"),
          permission: permissionEnum,
        })
      )
    ),
    map: v.object(mapSchema),
  },
  handler: async (ctx, args) => {
    const { users, map } = args;

    const mapId = await ctx.db.insert("maps", map);
    const newMap = await ctx.db.get(mapId);

        await createMapUser(ctx, {
          user_id: map.owner_id,
          permission: "owner",
          map_id: mapId,
        })

    if (users) {
      await Promise.all([
    
        users.map((user) =>
          createMapUser(ctx, {
            user_id: user.userId,
            permission: user.permission,
            map_id: mapId,
          })
        ),
      ]);
    }
  },
});

async function createMapUser(
  ctx: MutationCtx,
  user: {
    user_id: Id<"users">;
    permission: "owner" | "editor" | "viewer" | "commenter";
    map_id: Id<"maps">;
  }
) {
  await ctx.db.insert("map_users", user);
}
