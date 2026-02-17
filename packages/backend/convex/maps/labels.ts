import { zid } from "convex-helpers/server/zod4";
import { IconType } from "../../types";
import { labelsEditSchema, labelsSchema } from "../../zod-schemas";
import { authedMutation, authedQuery, logMapEvent } from "../helpers";

export const getMapLabels = authedQuery({
  args: {
    mapId: zid("maps"),
  },
  returns: labelsSchema.array().nullable(),
  handler: async (ctx, args) => {
    const labels = await ctx.db
      .query("labels")
      .withIndex("by_map_id", (q) => q.eq("mapId", args.mapId))
      .collect();
    return labels.filter((l) => !l.isArchived);
  },
});

// mutations

export const createLabel = authedMutation({
  args: {
    mapId: zid("maps"),
    label: labelsEditSchema,
  },
  handler: async (ctx, args) => {
    const labelId = await ctx.db.insert("labels", {
      ...args.label,
      mapId: args.mapId,
      createdBy: ctx.user._id,
      isArchived: false,
    });

    await logMapEvent(
      ctx,
      args.mapId,
      "label.create",
      {
        labelId,
        title: args.label.title,
      },
      ctx.user._id
    );

    return labelId;
  },
});

export const editLabel = authedMutation({
  args: {
    labelId: zid("labels"),
    label: labelsEditSchema,
  },
  handler: async (ctx, args) => {
    const existingLabel = await ctx.db.get(args.labelId);
    if (!existingLabel) throw new Error("Label not found");

    await ctx.db.patch(args.labelId, {
      title: args.label.title,
      description: args.label.description,
      icon: args.label.icon as IconType,
      color: args.label.color,
      updatedAt: new Date().toISOString(),
    });

    await logMapEvent(
      ctx,
      existingLabel.mapId,
      "label.update",
      {
        labelId: args.labelId,
        updatedFields: Object.keys(args.label),
      },
      ctx.user._id
    );
  },
});

export const deleteLabel = authedMutation({
  args: {
    labelId: zid("labels"),
  },
  handler: async (ctx, args) => {
    const label = await ctx.db.get(args.labelId);
    if (!label) throw new Error("Label not found");

    await ctx.db.patch(args.labelId, {
      isArchived: true,
      updatedAt: new Date().toISOString(),
    });

    await logMapEvent(
      ctx,
      label.mapId,
      "label.delete",
      {
        labelId: args.labelId,
        title: label.title,
      },
      ctx.user._id
    );
  },
});
