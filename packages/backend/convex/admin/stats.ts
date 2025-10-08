import { query } from "../_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "../../helpers/admin-helpers";

/**
 * Get overview statistics for dashboard
 * READ-ONLY
 */
export const getOverviewStats = query({
  args: {},
  returns: v.object({
    totalUsers: v.number(),
    totalMaps: v.number(),
    totalMarkers: v.number(),
    totalPlaces: v.number(),
  }),
  handler: async (ctx) => {
    await requireAdmin(ctx);

    const [users, maps, markers, places] = await Promise.all([
      ctx.db.query("users").collect(),
      ctx.db.query("maps").collect(),
      ctx.db.query("markers").collect(),
      ctx.db.query("places").collect(),
    ]);

    return {
      totalUsers: users.length,
      totalMaps: maps.length,
      totalMarkers: markers.length,
      totalPlaces: places.length,
    };
  },
});

/**
 * Get growth metrics for specified period
 * READ-ONLY
 */
export const getGrowthMetrics = query({
  args: { days: v.number() },
  returns: v.object({
    usersGrowth: v.number(),
    mapsGrowth: v.number(),
    markersGrowth: v.number(),
    placesGrowth: v.number(),
  }),
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const now = Date.now();
    const periodMs = args.days * 24 * 60 * 60 * 1000;
    const currentPeriodStart = now - periodMs;
    const previousPeriodStart = now - (periodMs * 2);

    // Get counts for current period
    const currentUsers = (await ctx.db
      .query("users")
      .filter(q => q.gte(q.field("_creationTime"), currentPeriodStart))
      .collect()).length;

    const currentMaps = (await ctx.db
      .query("maps")
      .filter(q => q.gte(q.field("_creationTime"), currentPeriodStart))
      .collect()).length;

    const currentMarkers = (await ctx.db
      .query("markers")
      .filter(q => q.gte(q.field("_creationTime"), currentPeriodStart))
      .collect()).length;

    const currentPlaces = (await ctx.db
      .query("places")
      .filter(q => q.gte(q.field("_creationTime"), currentPeriodStart))
      .collect()).length;

    // Get counts for previous period
    const previousUsers = (await ctx.db
      .query("users")
      .filter(q =>
        q.and(
          q.gte(q.field("_creationTime"), previousPeriodStart),
          q.lt(q.field("_creationTime"), currentPeriodStart)
        )
      )
      .collect()).length;

    const previousMaps = (await ctx.db
      .query("maps")
      .filter(q =>
        q.and(
          q.gte(q.field("_creationTime"), previousPeriodStart),
          q.lt(q.field("_creationTime"), currentPeriodStart)
        )
      )
      .collect()).length;

    const previousMarkers = (await ctx.db
      .query("markers")
      .filter(q =>
        q.and(
          q.gte(q.field("_creationTime"), previousPeriodStart),
          q.lt(q.field("_creationTime"), currentPeriodStart)
        )
      )
      .collect()).length;

    const previousPlaces = (await ctx.db
      .query("places")
      .filter(q =>
        q.and(
          q.gte(q.field("_creationTime"), previousPeriodStart),
          q.lt(q.field("_creationTime"), currentPeriodStart)
        )
      )
      .collect()).length;

    // Calculate growth percentages
    const calculateGrowth = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    return {
      usersGrowth: calculateGrowth(currentUsers, previousUsers),
      mapsGrowth: calculateGrowth(currentMaps, previousMaps),
      markersGrowth: calculateGrowth(currentMarkers, previousMarkers),
      placesGrowth: calculateGrowth(currentPlaces, previousPlaces),
    };
  },
});
