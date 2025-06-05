import { getManyFrom } from "convex-helpers/server/relationships";
import { zid } from "convex-helpers/server/zod";
import { mapUserSchema, shareMapUserSchema } from "../../zod-schemas";
import { Id } from "../_generated/dataModel";
import { MutationCtx } from "../_generated/server";
import { authedMutation, authedQuery } from "../helpers";

export const getMapUsers = authedQuery({
  args: {
    mapId: zid("maps"),
  },
  returns: mapUserSchema.array(),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("map_users")
      .withIndex("by_map_id", (q) => q.eq("map_id", args.mapId))
      .collect();
  },
});

// Mutations

export async function createMapUser(
  ctx: MutationCtx,
  user: {
    user_id: Id<"users">;
    permission: "owner" | "editor" | "viewer" | "commenter";
    map_id: Id<"maps">;
  }
) {
  await ctx.db.insert("map_users", user);
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
      const existingUsers = await getManyFrom(
        ctx.db,
        "map_users",
        "by_map_id",
        args.mapId
      );

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
  args: mapUserSchema,
  handler: async (ctx, args) => {
    await ctx.db.patch(args._id as Id<"map_users">, {
      permission: args.permission,
    });
  },
});

export const deleteMapUser = authedMutation({
  args: {
    mapId: zid("maps"),
    mapUserId: zid("map_users"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.mapUserId);
  },
});
