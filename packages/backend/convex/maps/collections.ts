import { v } from "convex/values";
import { mutation, query } from "../_generated/server";

export const getCollectionsForMap = query({
  args: {
    mapId: v.id("maps"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("collections")
      .withIndex("by_map_id", (q) => q.eq("map_id", args.mapId));
  },
});

export const getCollectionLinksForMap = query({
  args: {
    mapId: v.id("maps"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("collection_links")
      .withIndex("by_map_id", (q) => q.eq("map_id", args.mapId));
  },
});

// Mutations for collections
export const createCollection = mutation({
  args: {
    mapId: v.id("maps"),
    userId: v.id("users"),
    title: v.string(),
    description: v.string(),
    icon: v.string(),
    color: v.string(),
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
