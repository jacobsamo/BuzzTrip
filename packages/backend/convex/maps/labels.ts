import { zid } from "convex-helpers/server/zod";
import { labelsEditSchema, labelsSchema } from "../../zod-schemas";
import { authedMutation, authedQuery } from "../helpers";

export const getMapLabels = authedQuery({
  args: {
    mapId: zid("maps"),
  },
  returns: labelsSchema.array().nullable(),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("labels")
      .withIndex("by_map_id", (q) => q.eq("map_id", args.mapId))
      .collect();
  },
});

// mutations

export const createLabel = authedMutation({
  args: {
    mapId: zid("maps"),
    label: labelsEditSchema,
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("labels", {
      ...args.label,
      map_id: args.mapId,
      created_by: ctx.user._id,
    });
  },
});

export const editLabel = authedMutation({
  args: {
    labelId: zid("labels"),
    label: labelsEditSchema,
  },
  handler: async (ctx, args) => {
    await ctx.db.replace(args.labelId, {
      ...args.label,
      _id: args.labelId,
      map_id: args.label.map_id,
      created_by: ctx.user._id,
      updatedAt: new Date().toISOString(),
    });
  },
});

export const deleteLabel = authedMutation({
  args: {
    labelId: zid("labels"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.labelId);
  },
});
