import { query } from "../_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "../../helpers/admin-helpers";

/**
 * Get all users with aggregated statistics
 * READ-ONLY
 */
export const getAllUsersWithStats = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id("users"),
    _creationTime: v.number(),
    name: v.string(),
    email: v.string(),
    image: v.string(),
    username: v.optional(v.string()),
    mapsCount: v.number(),
    markersCount: v.number(),
  })),
  handler: async (ctx) => {
    await requireAdmin(ctx);

    const users = await ctx.db.query("users").collect();

    return await Promise.all(users.map(async (user) => {
      const [ownedMaps, createdMarkers] = await Promise.all([
        ctx.db
          .query("map_users")
          .withIndex("by_user_id", q => q.eq("user_id", user._id))
          .filter(q => q.eq(q.field("permission"), "owner"))
          .collect(),
        ctx.db
          .query("markers")
          .filter(q => q.eq(q.field("created_by"), user._id))
          .collect(),
      ]);

      return {
        _id: user._id,
        _creationTime: user._creationTime,
        name: user.name,
        email: user.email,
        image: user.image,
        username: user.username,
        mapsCount: ownedMaps.length,
        markersCount: createdMarkers.length,
      };
    }));
  },
});

/**
 * Get detailed statistics for a specific user
 * READ-ONLY
 */
export const getUserDetailStats = query({
  args: { userId: v.id("users") },
  returns: v.object({
    totalMaps: v.number(),
    totalMarkers: v.number(),
    totalCollections: v.number(),
    collaborations: v.number(),
  }),
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const [ownedMaps, allMapUsers, markers, collections] = await Promise.all([
      ctx.db
        .query("map_users")
        .withIndex("by_user_id", q => q.eq("user_id", args.userId))
        .filter(q => q.eq(q.field("permission"), "owner"))
        .collect(),
      ctx.db
        .query("map_users")
        .withIndex("by_user_id", q => q.eq("user_id", args.userId))
        .collect(),
      ctx.db
        .query("markers")
        .filter(q => q.eq(q.field("created_by"), args.userId))
        .collect(),
      ctx.db
        .query("collections")
        .filter(q => q.eq(q.field("created_by"), args.userId))
        .collect(),
    ]);

    return {
      totalMaps: ownedMaps.length,
      totalMarkers: markers.length,
      totalCollections: collections.length,
      collaborations: allMapUsers.length - ownedMaps.length,
    };
  },
});
