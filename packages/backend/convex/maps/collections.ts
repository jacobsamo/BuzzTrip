import { zid } from "convex-helpers/server/zod";
import { IconType } from "../../types";
import {
  collection_linksSchema,
  collectionsEditSchema,
  collectionsSchema,
} from "../../zod-schemas";
import { authedMutation, authedQuery } from "../helpers";

export const getCollectionsForMap = authedQuery({
  args: {
    mapId: zid("maps"),
  },
  returns: collectionsSchema.array().nullable(),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("collections")
      .withIndex("by_map_id", (q) => q.eq("map_id", args.mapId))
      .collect();
  },
});

export const getCollectionLinksForMap = authedQuery({
  args: {
    mapId: zid("maps"),
  },
  returns: collection_linksSchema.array().nullable(),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("collection_links")
      .withIndex("by_map_id", (q) => q.eq("map_id", args.mapId))
      .collect();
  },
});

// Mutations for collections
export const createCollection = authedMutation({
  args: collectionsEditSchema,
  handler: async (ctx, args) => {
    return await ctx.db.insert("collections", {
      ...args,
      ...(args.icon ? { icon: args.icon as IconType } : {}),  
      created_by: ctx.user._id,
    });
  },
});

export const editCollection = authedMutation({
  args: {
    collectionId: zid("collections"),
    collection: collectionsEditSchema.omit({ _id: true, _creationTime: true }),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.collectionId, {
      ...args.collection,
      ...(args.collection.icon ? { icon: args.collection.icon as IconType } : {}),  
      updatedAt: new Date().toISOString(),
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
