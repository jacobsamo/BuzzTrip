import { zid } from "convex-helpers/server/zod4";
import { z } from "zod";
import { IconType } from "../../types";
import {
  collectionLinksSchema,
  collectionsEditSchema,
  collectionsSchema,
} from "../../zod-schemas";
import { MutationCtx } from "../_generated/server";
import { authedMutation, authedQuery, logMapEvent } from "../helpers";

export const getCollectionsForMap = authedQuery({
  args: {
    mapId: zid("maps"),
  },
  returns: collectionsSchema.array().nullable(),
  handler: async (ctx, args) => {
    const collections = await ctx.db
      .query("collections")
      .withIndex("by_map_id", (q) => q.eq("mapId", args.mapId))
      .collect();
    return collections.filter((c) => !c.isArchived);
  },
});

export const getCollectionLinksForMap = authedQuery({
  args: {
    mapId: zid("maps"),
  },
  returns: collectionLinksSchema.array().nullable(),
  handler: async (ctx, args) => {
    const links = await ctx.db
      .query("collection_links")
      .withIndex("by_map_id", (q) => q.eq("mapId", args.mapId))
      .collect();
    return links.filter((l) => !l.isArchived);
  },
});

const createCollectionPropsSchema = z.object({
  userId: zid("users"),
  collection: collectionsEditSchema,
});

export const createCollectionFunction = async (
  ctx: MutationCtx,
  args: z.infer<typeof createCollectionPropsSchema>,
  skipLogging = false
) => {
  const collectionId = await ctx.db.insert("collections", {
    ...args.collection,
    ...(args.collection.icon ? { icon: args.collection.icon as IconType } : {}),
    createdBy: args.userId,
    isArchived: false,
  });

  if (!skipLogging) {
    await logMapEvent(
      ctx,
      args.collection.mapId,
      "collection.create",
      {
        collectionId,
        title: args.collection.title,
      },
      args.userId
    );
  }

  return collectionId;
};

// Mutations for collections
export const createCollection = authedMutation({
  args: collectionsEditSchema,
  handler: async (ctx, args) =>
    await createCollectionFunction(ctx, {
      collection: args,
      userId: ctx.user._id,
    }),
});

export const editCollection = authedMutation({
  args: {
    collectionId: zid("collections"),
    collection: collectionsEditSchema.omit({ _id: true, _creationTime: true }),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.collectionId, {
      ...args.collection,
      ...(args.collection.icon
        ? { icon: args.collection.icon as IconType }
        : {}),
      updatedAt: new Date().toISOString(),
    });

    await logMapEvent(
      ctx,
      args.collection.mapId,
      "collection.update",
      {
        collectionId: args.collectionId,
        updatedFields: Object.keys(args.collection),
      },
      ctx.user._id
    );

    return args.collectionId;
  },
});

export const deleteCollection = authedMutation({
  args: {
    collectionId: zid("collections"),
  },
  handler: async (ctx, args) => {
    const collection = await ctx.db.get(args.collectionId);
    if (!collection) throw new Error("Collection not found");

    await ctx.db.patch(args.collectionId, {
      isArchived: true,
      updatedAt: new Date().toISOString(),
    });

    await logMapEvent(
      ctx,
      collection.mapId,
      "collection.delete",
      {
        collectionId: args.collectionId,
        title: collection.title,
      },
      ctx.user._id
    );

    return args.collectionId;
  },
});
