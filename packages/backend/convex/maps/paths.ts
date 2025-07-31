import { zid } from "convex-helpers/server/zod";
import { pathsSchema, pathsEditSchema } from "../../zod-schemas";
import { authedMutation, authedQuery } from "../helpers";

export const getPathsForMap = authedQuery({
  args: {
    mapId: zid("maps"),
  },
  returns: pathsSchema.array().nullable(),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("paths")
      .withIndex("byMapId", (q) => q.eq("mapId", args.mapId))
      .collect();
  },
});

export const createPath = authedMutation({
  args: pathsEditSchema.omit({
    createdBy: true,
  }),
  handler: async (ctx, args) => {
        return await ctx.db.insert("paths", {
      ...args,
      createdBy: ctx.user._id,
    });
  }
})

export const editPath = authedMutation({
    args: {
    pathId: zid("paths"),
    path: pathsEditSchema.omit({ _id: true, _creationTime: true }),
  },
    handler: async (ctx, args) => {
    await ctx.db.patch(args.pathId, {
      ...args.path,
      updatedAt: new Date().toISOString(),
    });

    return args.pathId;
  }
})

export const deletePath = authedMutation({
  args: {
    pathId: zid("paths")
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.pathId);
    return args.pathId;
  }
})
