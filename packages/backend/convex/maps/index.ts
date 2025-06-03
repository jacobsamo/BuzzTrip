import { getManyFrom } from "convex-helpers/server/relationships";
import { zid } from "convex-helpers/server/zod";
import { z } from "zod";
import type { UserMap } from "../../types";
import {
  mapsEditSchema,
  mapUserSchema,
  refinedUserSchema,
  userMapsSchema,
} from "../../zod-schemas";
import { Id } from "../_generated/dataModel";
import { MutationCtx } from "../_generated/server";
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

// we don't need this any more really
export const getAllMapData = null;

// get all the maps for a user
export const getUserMaps = authedQuery({
  args: {
    userId: zid("user"),
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
    });

    await createMapUser(ctx, {
      user_id: map.owner_id,
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
    map: mapsEditSchema,
  },
  handler: async (ctx, args) => {
    await ctx.db.replace(args.map._id! as Id<"maps">, {
      ...args.map,
      _id: args.map._id as Id<"maps">,
      owner_id: args.map.owner_id as Id<"user">,
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
