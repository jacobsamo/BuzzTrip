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

export const deleteMap = authedMutation({
  args: {
    mapId: zid("maps"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.mapId as Id<"maps">);
  },
});

/**
 * Duplicates a map and all its related data (markers, collections, paths, labels, routes)
 * @param {MutationCtx} ctx - the convex mutation context
 * @param {Id<"maps">} mapId - the id of the map to duplicate
 * @returns {Promise<Id<"maps">>} - the id of the newly created map
 */
export const duplicateMap = authedMutation({
  args: {
    mapId: zid("maps"),
  },
  handler: async (ctx, args) => {
    // Get the original map
    const originalMap = await ctx.db.get(args.mapId);
    if (!originalMap) {
      throw new Error("Map not found");
    }

    // Create the new map with "Copy of" prefix
    const newMapId = await ctx.db.insert("maps", {
      ...originalMap,
      title: `Copy of ${originalMap.title}`,
      owner_id: ctx.user._id,
      updatedAt: new Date().toISOString(),
    });

    // Create map user for the new owner
    await createMapUser(ctx, {
      user_id: ctx.user._id,
      permission: "owner",
      map_id: newMapId,
    });

    // Duplicate collections and track ID mapping
    const collections = await ctx.db
      .query("collections")
      .withIndex("by_map_id", (q) => q.eq("map_id", args.mapId))
      .collect();

    const collectionIdMap = new Map<Id<"collections">, Id<"collections">>();
    for (const collection of collections) {
      const newCollectionId = await ctx.db.insert("collections", {
        map_id: newMapId,
        title: collection.title,
        description: collection.description,
        created_by: ctx.user._id,
        icon: collection.icon,
        color: collection.color,
        updatedAt: new Date().toISOString(),
      });
      collectionIdMap.set(collection._id, newCollectionId);
    }

    // Duplicate markers and track ID mapping
    const markers = await ctx.db
      .query("markers")
      .withIndex("by_map_id", (q) => q.eq("map_id", args.mapId))
      .collect();

    const markerIdMap = new Map<Id<"markers">, Id<"markers">>();
    for (const marker of markers) {
      const newMarkerId = await ctx.db.insert("markers", {
        title: marker.title,
        note: marker.note,
        lat: marker.lat,
        lng: marker.lng,
        created_by: ctx.user._id,
        icon: marker.icon,
        color: marker.color,
        place_id: marker.place_id,
        map_id: newMapId,
        updatedAt: new Date().toISOString(),
      });
      markerIdMap.set(marker._id, newMarkerId);
    }

    // Duplicate collection links using the new IDs
    const collectionLinks = await ctx.db
      .query("collection_links")
      .withIndex("by_map_id", (q) => q.eq("map_id", args.mapId))
      .collect();

    for (const link of collectionLinks) {
      const newCollectionId = collectionIdMap.get(link.collection_id);
      const newMarkerId = markerIdMap.get(link.marker_id);
      if (newCollectionId && newMarkerId) {
        await ctx.db.insert("collection_links", {
          collection_id: newCollectionId,
          marker_id: newMarkerId,
          map_id: newMapId,
          user_id: ctx.user._id,
        });
      }
    }

    // Duplicate paths
    const paths = await ctx.db
      .query("paths")
      .withIndex("byMapId", (q) => q.eq("mapId", args.mapId))
      .collect();

    for (const path of paths) {
      await ctx.db.insert("paths", {
        mapId: newMapId,
        pathType: path.pathType,
        title: path.title,
        note: path.note,
        points: path.points,
        measurements: path.measurements,
        styles: path.styles,
        createdBy: ctx.user._id,
        updatedAt: new Date().toISOString(),
      });
    }

    // Duplicate labels
    const labels = await ctx.db
      .query("labels")
      .withIndex("by_map_id", (q) => q.eq("map_id", args.mapId))
      .collect();

    for (const label of labels) {
      await ctx.db.insert("labels", {
        map_id: newMapId,
        title: label.title,
        description: label.description,
        icon: label.icon,
        color: label.color,
        created_by: ctx.user._id,
        updatedAt: new Date().toISOString(),
      });
    }

    // Duplicate routes and track ID mapping
    const routes = await ctx.db
      .query("routes")
      .withIndex("by_map_id", (q) => q.eq("map_id", args.mapId))
      .collect();

    const routeIdMap = new Map<Id<"routes">, Id<"routes">>();
    for (const route of routes) {
      const newRouteId = await ctx.db.insert("routes", {
        map_id: newMapId,
        name: route.name,
        description: route.description,
        travel_type: route.travel_type,
        user_id: ctx.user._id,
        updatedAt: new Date().toISOString(),
      });
      routeIdMap.set(route._id, newRouteId);
    }

    // Duplicate route stops using the new IDs
    const routeStops = await ctx.db
      .query("route_stops")
      .withIndex("by_map_id", (q) => q.eq("map_id", args.mapId))
      .collect();

    for (const stop of routeStops) {
      const newRouteId = routeIdMap.get(stop.route_id);
      const newMarkerId = markerIdMap.get(stop.marker_id);
      if (newRouteId && newMarkerId) {
        await ctx.db.insert("route_stops", {
          map_id: newMapId,
          route_id: newRouteId,
          marker_id: newMarkerId,
          user_id: ctx.user._id,
          lat: stop.lat,
          lng: stop.lng,
          stop_order: stop.stop_order,
          updatedAt: new Date().toISOString(),
        });
      }
    }

    return newMapId;
  },
});
