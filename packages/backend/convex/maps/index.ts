import { zid } from "convex-helpers/server/zod4";
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
import {
  authedMutation,
  authedQuery,
  logMapEvent,
  zodMutation,
} from "../helpers";
import { createCollectionFunction } from "./collections";
import { createMapUser } from "./mapUsers";
// Get methods

export const getMapUsers = authedQuery({
  args: {
    mapId: zid("maps"),
  },
  handler: async (ctx, args) => {
    const mapUsers = await ctx.db
      .query("map_users")
      .withIndex("by_map_id", (q) => q.eq("mapId", args.mapId))
      .collect();
    return mapUsers.filter((mu) => !mu.isArchived);
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
    await ctx.db.insert("mapViews", {
      ...args,
      isArchived: false,
    });
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
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .collect();

    const combinedMaps = await Promise.all(
      mapUsers
        .filter((mu) => !mu.isArchived)
        .map(async (mapUser) => {
          const map = await ctx.db.get(mapUser.mapId);
          if (map?.isArchived) return null;
          return {
            ...map,
            ...mapUser,
            _id: mapUser._id,
            mapId: mapUser.mapId,
          } as UserMap;
        })
    );
    return combinedMaps.filter((m): m is UserMap => m !== null);
  },
});

const createMapSchema = z.object({
  userId: zid("users"),
  users: mapUserSchema
    .pick({
      userId: true,
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
      ownerId: args.userId,
      mapTypeId: map.mapTypeId ?? "hybrid",
      isArchived: false,
    });

    const userPromise =
      users?.map((user) =>
        createMapUser(ctx, {
          userId: user.userId,
          permission: user.permission,
          mapId: mapId,
        })
      ) ?? [];

    await Promise.all([
      ...userPromise,
      // we always want to create the owner
      createMapUser(ctx, {
        userId: args.userId,
        permission: "owner",
        mapId: mapId,
      }),
      // create a default collection for the map (skip logging for default collection)
      createCollectionFunction(
        ctx,
        {
          collection: {
            mapId: mapId,
            title: "Default Collection",
            icon: "Folder",
          },
          userId: args.userId,
        },
        true
      ),
    ]);

    await logMapEvent(
      ctx,
      mapId,
      "map.create",
      {
        mapId,
        title: map.title,
        visibility: map.visibility,
      },
      args.userId
    );

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

    await logMapEvent(
      ctx,
      args.mapId,
      "map.update",
      {
        mapId: args.mapId,
        updatedFields: Object.keys(args.map),
      },
      ctx.user._id
    );
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
    const map = await ctx.db.get(args.mapId as Id<"maps">);
    if (!map) throw new Error("Map not found");

    await ctx.db.patch(args.mapId as Id<"maps">, {
      isArchived: true,
      updatedAt: new Date().toISOString(),
    });

    await logMapEvent(
      ctx,
      args.mapId,
      "map.delete",
      {
        mapId: args.mapId,
        title: map.title,
      },
      ctx.user._id
    );
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
  returns: zid("maps"),
  handler: async (ctx, args) => {
    // Get the original map
    const originalMap = await ctx.db.get(args.mapId);
    if (!originalMap) {
      throw new Error("Map not found");
    }

    // Check if user has permission to duplicate this map
    const mapUser = await ctx.db
      .query("map_users")
      .withIndex("by_map_id", (q) => q.eq("mapId", args.mapId))
      .filter((q) => q.eq(q.field("userId"), ctx.user._id))
      .first();

    // Allow duplication if:
    // 1. User is the owner
    // 2. User has access to the map (owner/editor/viewer)
    // 3. Map is public (anyone can duplicate public maps)
    if (
      !mapUser &&
      originalMap.ownerId !== ctx.user._id &&
      originalMap.visibility !== "public"
    ) {
      throw new Error("You don't have permission to duplicate this map");
    }

    // Strip system fields before inserting
    const {
      _id: _originalMapId,
      _creationTime: _originalCreationTime,
      ...mapFields
    } = originalMap;

    // Create the new map with "Copy of" prefix
    const newMapId = await ctx.db.insert("maps", {
      ...mapFields,
      title: `Copy of ${originalMap.title}`,
      ownerId: ctx.user._id,
      updatedAt: new Date().toISOString(),
      isArchived: false,
    });

    try {
      // Create map user for the new owner
      await createMapUser(ctx, {
        userId: ctx.user._id,
        permission: "owner",
        mapId: newMapId,
      });

      // Fetch all related data in parallel
      const [
        collectionsAll,
        markersAll,
        collectionLinksAll,
        pathsAll,
        labelsAll,
        routesAll,
        routeStopsAll,
      ] = await Promise.all([
        ctx.db
          .query("collections")
          .withIndex("by_map_id", (q) => q.eq("mapId", args.mapId))
          .collect(),
        ctx.db
          .query("markers")
          .withIndex("by_map_id", (q) => q.eq("mapId", args.mapId))
          .collect(),
        ctx.db
          .query("collection_links")
          .withIndex("by_map_id", (q) => q.eq("mapId", args.mapId))
          .collect(),
        ctx.db
          .query("paths")
          .withIndex("byMapId", (q) => q.eq("mapId", args.mapId))
          .collect(),
        ctx.db
          .query("labels")
          .withIndex("by_map_id", (q) => q.eq("mapId", args.mapId))
          .collect(),
        ctx.db
          .query("routes")
          .withIndex("by_map_id", (q) => q.eq("mapId", args.mapId))
          .collect(),
        ctx.db
          .query("route_stops")
          .withIndex("by_map_id", (q) => q.eq("mapId", args.mapId))
          .collect(),
      ]);

      // Filter out archived items
      const collections = collectionsAll.filter((c) => !c.isArchived);
      const markers = markersAll.filter((m) => !m.isArchived);
      const collectionLinks = collectionLinksAll.filter((cl) => !cl.isArchived);
      const paths = pathsAll.filter((p) => !p.isArchived);
      const labels = labelsAll.filter((l) => !l.isArchived);
      const routes = routesAll.filter((r) => !r.isArchived);
      const routeStops = routeStopsAll.filter((rs) => !rs.isArchived);

      // Duplicate collections in parallel and track ID mapping
      const collectionIdMap = new Map<Id<"collections">, Id<"collections">>();
      const newCollectionIds = await Promise.all(
        collections.map((collection) =>
          ctx.db.insert("collections", {
            mapId: newMapId,
            title: collection.title,
            description: collection.description,
            createdBy: ctx.user._id,
            icon: collection.icon,
            color: collection.color,
            updatedAt: new Date().toISOString(),
            isArchived: false,
          })
        )
      );
      collections.forEach((collection, index) => {
        collectionIdMap.set(collection._id, newCollectionIds[index]!);
      });

      // Duplicate markers in parallel and track ID mapping
      const markerIdMap = new Map<Id<"markers">, Id<"markers">>();
      const newMarkerIds = await Promise.all(
        markers.map((marker) =>
          ctx.db.insert("markers", {
            title: marker.title,
            note: marker.note,
            lat: marker.lat,
            lng: marker.lng,
            createdBy: ctx.user._id,
            icon: marker.icon,
            color: marker.color,
            placeId: marker.placeId,
            mapId: newMapId,
            updatedAt: new Date().toISOString(),
            isArchived: false,
          })
        )
      );
      markers.forEach((marker, index) => {
        markerIdMap.set(marker._id, newMarkerIds[index]!);
      });

      // Duplicate routes in parallel and track ID mapping
      const routeIdMap = new Map<Id<"routes">, Id<"routes">>();
      const newRouteIds = await Promise.all(
        routes.map((route) =>
          ctx.db.insert("routes", {
            mapId: newMapId,
            name: route.name,
            description: route.description,
            travelType: route.travelType,
            userId: ctx.user._id,
            updatedAt: new Date().toISOString(),
            isArchived: false,
          })
        )
      );
      routes.forEach((route, index) => {
        routeIdMap.set(route._id, newRouteIds[index]!);
      });

      // Duplicate paths and labels in parallel (they don't need ID mapping)
      await Promise.all([
        ...paths.map((path) =>
          ctx.db.insert("paths", {
            mapId: newMapId,
            pathType: path.pathType,
            title: path.title,
            note: path.note,
            points: path.points,
            measurements: path.measurements,
            styles: path.styles,
            createdBy: ctx.user._id,
            updatedAt: new Date().toISOString(),
            isArchived: false,
          })
        ),
        ...labels.map((label) =>
          ctx.db.insert("labels", {
            mapId: newMapId,
            title: label.title,
            description: label.description,
            icon: label.icon,
            color: label.color,
            createdBy: ctx.user._id,
            updatedAt: new Date().toISOString(),
            isArchived: false,
          })
        ),
      ]);

      // Duplicate collection links and route stops in parallel using the new IDs
      await Promise.all([
        ...collectionLinks
          .map((link) => {
            const newCollectionId = collectionIdMap.get(link.collectionId);
            const newMarkerId = markerIdMap.get(link.markerId);
            if (newCollectionId && newMarkerId) {
              return ctx.db.insert("collection_links", {
                collectionId: newCollectionId,
                markerId: newMarkerId,
                mapId: newMapId,
                userId: ctx.user._id,
                isArchived: false,
              });
            }
            return null;
          })
          .filter((p): p is NonNullable<typeof p> => p !== null),
        ...routeStops
          .map((stop) => {
            const newRouteId = routeIdMap.get(stop.routeId);
            const newMarkerId = markerIdMap.get(stop.markerId);
            if (newRouteId && newMarkerId) {
              return ctx.db.insert("route_stops", {
                mapId: newMapId,
                routeId: newRouteId,
                markerId: newMarkerId,
                userId: ctx.user._id,
                lat: stop.lat,
                lng: stop.lng,
                stopOrder: stop.stopOrder,
                updatedAt: new Date().toISOString(),
                isArchived: false,
              });
            }
            return null;
          })
          .filter((p): p is NonNullable<typeof p> => p !== null),
      ]);

      return newMapId;
    } catch (error) {
      // Clean up the created map on failure to prevent orphaned maps
      await ctx.db.delete(newMapId);
      throw error;
    }
  },
});
