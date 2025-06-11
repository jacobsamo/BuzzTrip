import { zid } from "convex-helpers/server/zod";
import type { UserMap } from "../../types";
import {
  mapsEditSchema,
  mapUserSchema,
  userMapsSchema,
} from "../../zod-schemas";
import { Id } from "../_generated/dataModel";
import { authedMutation, authedQuery } from "../helpers";
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

/**
 * We only want to fetch this as a preload before than using all the other queries
 */
// export const getAllMapData = authedQuery({
//   args: {
//     mapId: zid("maps"),
//   },
//   handler: async (ctx, args) => {
//     const markersPromise = ctx.runQuery(api.maps.markers.getMarkersView, {
//       map_id: args.mapId,
//     });
//     const collectionsPromise = ctx.runQuery(
//       api.maps.collections.getCollectionsForMap,
//       {
//         mapId: args.mapId,
//       }
//     );
//     const collectionLinksPromise = ctx.runQuery(
//       api.maps.collections.getCollectionLinksForMap,
//       {
//         mapId: args.mapId,
//       }
//     );
//     const labelsPromise = ctx.runQuery(api.maps.labels.getMapLabels, {
//       mapId: args.mapId,
//     });
//     const mapUsersPromise = ctx.runQuery(api.maps.mapUsers.getMapUsers, {
//       mapId: args.mapId,
//     });

//   },
// });

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

    console.log("getUserMaps", {
      userId: args.userId,
      mapUsers: mapUsers.length,
      combinedMaps: combinedMaps.length,
    });
    return combinedMaps;
  },
});

// // Mutations
export const createMap = authedMutation({
  args: {
    users: mapUserSchema
      .pick({
        user_id: true,
        permission: true,
      })
      .array()
      .optional(),
    map: mapsEditSchema,
  },
  handler: async (ctx, args) => {
    const { users, map } = args;

    const mapId = await ctx.db.insert("maps", {
      ...map,
      owner_id: ctx.user._id,
      mapTypeId: map.mapTypeId ?? "hybrid",
    });

    await createMapUser(ctx, {
      user_id: ctx.user._id,
      permission: "owner",
      map_id: mapId,
    });

    if (users) {
      await Promise.all([
        users.map((user) =>
          createMapUser(ctx, {
            user_id: user.user_id,
            permission: user.permission,
            map_id: mapId,
          })
        ),
      ]);
    }
  },
});

export const updateMap = authedMutation({
  args: {
    mapId: zid("maps"),
    map: mapsEditSchema.omit({ _id: true, _creationTime: true }),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.mapId, {
      ...args.map,
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
