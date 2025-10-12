import { zid } from "convex-helpers/server/zod";
import * as z from "zod";
import { zodQuery } from "../../convex/helpers";
import { requireAdmin } from "../../helpers/admin-helpers";
import { userSchema } from "../../zod-schemas";
import { userById } from "../users";

/**
 * Get all users with aggregated statistics
 * READ-ONLY
 */
export const getAllUsersWithStats = zodQuery({
  args: {},
  returns: z.array(
    userSchema
      .pick({
        _id: true,
        _creationTime: true,
        name: true,
        email: true,
        image: true,
        username: true,
      })
      .extend({
        mapsCount: z.number(),
        markersCount: z.number(),
      })
  ),
  handler: async (ctx) => {
    await requireAdmin(ctx);

    const users = await ctx.db.query("users").collect();

    return await Promise.all(
      users.map(async (user) => {
        const [ownedMaps, createdMarkers] = await Promise.all([
          ctx.db
            .query("map_users")
            .withIndex("by_user_id", (q) => q.eq("user_id", user._id))
            .filter((q) => q.eq(q.field("permission"), "owner"))
            .collect(),
          ctx.db
            .query("markers")
            .filter((q) => q.eq(q.field("created_by"), user._id))
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
      })
    );
  },
});

/**
 * Get user by ID (admin only)
 * READ-ONLY
 */
export const getUserById = zodQuery({
  args: { userId: zid("users") },
  returns: userSchema.nullable(),
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const user = await userById(ctx, args.userId);
    return user ?? null;
  },
});

/**
 * Get detailed statistics for a specific user
 * READ-ONLY
 */
export const getUserDetailStats = zodQuery({
  args: { userId: zid("users") },
  returns: z.object({
    totalMaps: z.number(),
    totalMarkers: z.number(),
    totalCollections: z.number(),
    collaborations: z.number(),
    totalPaths: z.number(),
    totalRoutes: z.number(),
    totalLabels: z.number(),
    totalReviews: z.number(),
    totalMapViews: z.number(),
  }),
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const [
      ownedMaps,
      allMapUsers,
      markers,
      collections,
      paths,
      routes,
      labels,
      reviews,
      mapViews,
    ] = await Promise.all([
      ctx.db
        .query("map_users")
        .withIndex("by_user_id", (q) => q.eq("user_id", args.userId))
        .filter((q) => q.eq(q.field("permission"), "owner"))
        .collect(),
      ctx.db
        .query("map_users")
        .withIndex("by_user_id", (q) => q.eq("user_id", args.userId))
        .collect(),
      ctx.db
        .query("markers")
        .filter((q) => q.eq(q.field("created_by"), args.userId))
        .collect(),
      ctx.db
        .query("collections")
        .filter((q) => q.eq(q.field("created_by"), args.userId))
        .collect(),
      ctx.db
        .query("paths")
        .filter((q) => q.eq(q.field("createdBy"), args.userId))
        .collect(),
      ctx.db
        .query("routes")
        .filter((q) => q.eq(q.field("user_id"), args.userId))
        .collect(),
      ctx.db
        .query("labels")
        .filter((q) => q.eq(q.field("created_by"), args.userId))
        .collect(),
      ctx.db
        .query("places_reviews")
        .filter((q) => q.eq(q.field("user_id"), args.userId))
        .collect(),
      ctx.db
        .query("mapViews")
        .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
        .collect(),
    ]);

    return {
      totalMaps: ownedMaps.length,
      totalMarkers: markers.length,
      totalCollections: collections.length,
      collaborations: allMapUsers.length - ownedMaps.length,
      totalPaths: paths.length,
      totalRoutes: routes.length,
      totalLabels: labels.length,
      totalReviews: reviews.length,
      totalMapViews: mapViews.length,
    };
  },
});
