import { zid } from "convex-helpers/server/zod4";
import { pathsEditSchema, pathsSchema } from "../../zod-schemas";
import { authedMutation, authedQuery, logMapEvent } from "../helpers";

export const getPathsForMap = authedQuery({
  args: {
    mapId: zid("maps"),
  },
  returns: pathsSchema.array().nullable(),
  handler: async (ctx, args) => {
    return pathsSchema.array().parse(
      await ctx.db
        .query("paths")
        .withIndex("byMapId", (q) => q.eq("mapId", args.mapId))
        .collect()
    );
  },
});

export const createPath = authedMutation({
  args: pathsEditSchema.omit({
    createdBy: true,
  }),
  handler: async (ctx, args) => {
    const pathId = await ctx.db.insert("paths", {
      ...args,
      createdBy: ctx.user._id,
    });

    await logMapEvent(
      ctx,
      args.mapId,
      "path.create",
      {
        pathId,
        title: args.title,
        pathType: args.pathType,
      },
      ctx.user._id
    );

    return pathId;
  },
});

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

    await logMapEvent(
      ctx,
      args.path.mapId,
      "path.update",
      {
        pathId: args.pathId,
        updatedFields: Object.keys(args.path),
      },
      ctx.user._id
    );

    return args.pathId;
  },
});

export const deletePath = authedMutation({
  args: {
    pathId: zid("paths"),
  },
  handler: async (ctx, args) => {
    const path = await ctx.db.get(args.pathId);
    if (!path) throw new Error("Path not found");

    await ctx.db.delete(args.pathId);

    await logMapEvent(
      ctx,
      path.mapId,
      "path.delete",
      {
        pathId: args.pathId,
        title: path.title,
      },
      ctx.user._id
    );

    return args.pathId;
  },
});
