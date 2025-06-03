import { zid } from "convex-helpers/server/zod";
import { IconType } from "../../types";
import { collectionsEditSchema } from "../../zod-schemas";
import { authedMutation, authedQuery } from "../helpers";

export const getCollectionsForMap = authedQuery({
  args: {
    mapId: zid("maps"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("collections")
      .withIndex("by_map_id", (q) => q.eq("map_id", args.mapId));
  },
});

export const getCollectionLinksForMap = authedQuery({
  args: {
    mapId: zid("maps"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("collection_links")
      .withIndex("by_map_id", (q) => q.eq("map_id", args.mapId));
  },
});

// Mutations for collections
export const createCollection = authedMutation({
  args: collectionsEditSchema,
  handler: async (ctx, args) => {
    return await ctx.db.insert("collections", {
      ...args,
      icon: args.icon as IconType,
      created_by: ctx.user._id,
    });
  },
});

export const editCollection = authedMutation({
  args: {
    collectionId: zid("collections"),
    collection: collectionsEditSchema,
  },
  handler: async (ctx, args) => {
    await ctx.db.replace(args.collectionId, {
      ...args.collection,
      _id: args.collectionId,
      created_by: ctx.user._id,
    });

    return args.collectionId;
  },
});

export const deleteCollection = authedMutation({
  args: {
    collectionId: zid("collections"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.collectionId);
    return args.collectionId;
  },
});
