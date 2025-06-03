import { z } from "zod";
import {  zid } from "convex-helpers/server/zod";
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
  args: {
    mapId: zid("maps"),
    userId: zid("user"),
    title: z.string(),
    description: z.string(),
    icon: z.string(),
    color: z.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("collections", {
      map_id: args.mapId,
      created_by: args.userId,
      title: args.title,
      description: args.description,
      icon: args.icon,
      color: args.color,
    });
  },
});
