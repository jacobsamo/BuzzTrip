import { getManyFrom } from "convex-helpers/server/relationships";
import { zid } from "convex-helpers/server/zod4";
import type { RefinedUser } from "../../types";
import {
  combinedMapUser,
  mapUserEditSchema,
  mapUserSchema,
  shareMapUserSchema,
} from "../../zod-schemas";
import { Id } from "../_generated/dataModel";
import { MutationCtx } from "../_generated/server";
import { authedMutation, authedQuery, logMapEvent } from "../helpers";

export const getMapUsers = authedQuery({
  args: {
    mapId: zid("maps"),
  },
  returns: mapUserSchema.array(),
  handler: async (ctx, args) => {
    const mapUsers = await ctx.db
      .query("map_users")
      .withIndex("by_map_id", (q) => q.eq("map_id", args.mapId))
      .collect();
    return mapUsers.filter((mu) => !mu.isArchived);
  },
});

/**
 * Combine a refined user with the map user
 */
export const getCombinedMapUsers = authedQuery({
  args: {
    mapId: zid("maps"),
  },
  returns: combinedMapUser.array(),
  handler: async (ctx, args) => {
    const mapUsers = await ctx.db
      .query("map_users")
      .withIndex("by_map_id", (q) => q.eq("map_id", args.mapId))
      .collect();

    const combinedUsers = await Promise.all(
      mapUsers
        .filter((mu) => !mu.isArchived)
        .map(async (mapUser) => {
          const user = await ctx.db.get(mapUser.user_id);
          if (!user || user.isArchived) return null;

          return {
            ...mapUser,
            user,
          };
        })
    );

    // Properly filter out nulls and type narrow
    return combinedUsers.filter(
      (m): m is typeof m & { user: RefinedUser } => m !== null
    );
  },
});

// Mutations

export async function createMapUser(
  ctx: MutationCtx,
  user: {
    user_id: Id<"users">;
    permission: "owner" | "editor" | "viewer" | "commenter";
    map_id: Id<"maps">;
  },
  skipLogging = false
) {
  const mapUserId = await ctx.db.insert("map_users", {
    ...user,
    isArchived: false,
  });

  if (!skipLogging) {
    await logMapEvent(
      ctx,
      user.map_id,
      "map_user.create",
      {
        mapUserId,
        userId: user.user_id,
        permission: user.permission,
      },
      user.user_id
    );
  }

  return mapUserId;
}

export const shareMap = authedMutation({
  args: {
    mapId: zid("maps"),
    users: shareMapUserSchema
      .pick({
        user_id: true,
        permission: true,
      })
      .array()
      .optional(),
  },
  handler: async (ctx, args) => {
    if (args.users) {
      const existingUsersAll = await getManyFrom(
        ctx.db,
        "map_users",
        "by_map_id",
        args.mapId
      );

      const existingUsers = existingUsersAll.filter((u) => !u.isArchived);

      const newUsers = args.users.filter((user) => {
        return !existingUsers.some(
          (existingUser) => existingUser.user_id === user.user_id
        );
      });

      await Promise.all([
        newUsers.map((user) =>
          createMapUser(ctx, {
            user_id: user.user_id,
            permission: user.permission,
            map_id: args.mapId,
          })
        ),
      ]);
    }
  },
});

export const editMapUser = authedMutation({
  args: mapUserEditSchema,
  handler: async (ctx, args) => {
    const existingMapUser = await ctx.db.get(args._id as Id<"map_users">);
    if (!existingMapUser) throw new Error("Map user not found");

    await ctx.db.patch(args._id as Id<"map_users">, {
      permission: args.permission,
    });

    await logMapEvent(
      ctx,
      existingMapUser.map_id,
      "map_user.update",
      {
        mapUserId: args._id,
        userId: existingMapUser.user_id,
        newPermission: args.permission,
        oldPermission: existingMapUser.permission,
      },
      ctx.user._id
    );
  },
});

export const deleteMapUser = authedMutation({
  args: {
    mapId: zid("maps"),
    mapUserId: zid("map_users"),
  },
  handler: async (ctx, args) => {
    const mapUser = await ctx.db.get(args.mapUserId);
    if (!mapUser) throw new Error("Map user not found");

    await ctx.db.patch(args.mapUserId, {
      isArchived: true,
    });

    await logMapEvent(
      ctx,
      args.mapId,
      "map_user.delete",
      {
        mapUserId: args.mapUserId,
        userId: mapUser.user_id,
        permission: mapUser.permission,
      },
      ctx.user._id
    );
  },
});
