import { zid } from "convex-helpers/server/zod";
import { z } from "zod";
import { refinedUserSchema, userSchema } from "../zod-schemas";
import { authedMutation, authedQuery } from "./helpers";

export const searchUsers = authedQuery({
  args: {
    query: z.string().min(1),
  },
  returns: refinedUserSchema.array().nullable(),
  handler: async (ctx, args) => {
    const searchUsers = await ctx.db
      .query("user")
      .withSearchIndex("search_user", (q) => q.search("name", args.query))
      .collect();

    return searchUsers.map((user) => ({
      ...user,
    }));
  },
});

export const updateUser = authedMutation({
  args: {
    userId: zid("user"),
    updateData: userSchema.partial(),
  },
  handler: async (ctx, args) => {
    if (ctx.user._id !== args.userId) {
      throw Error("You can only update your own user data.");
    }

    await ctx.db.patch(args.userId, {
      ...args.updateData,
      _id: args.userId,
      updatedAt: new Date().toISOString(),
    });
  },
});
