import { query } from "../_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "../../helpers/admin-helpers";

/**
 * Get maps created by month for charts
 * READ-ONLY
 */
export const getMapsCreatedByMonth = query({
  args: { months: v.number() },
  returns: v.array(v.object({
    month: v.string(),
    count: v.number(),
  })),
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const maps = await ctx.db.query("maps").collect();

    // Group by month
    const monthCounts: Record<string, number> = {};
    const now = new Date();

    // Initialize last N months
    for (let i = args.months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      monthCounts[key] = 0;
    }

    // Count maps per month
    maps.forEach(map => {
      const date = new Date(map._creationTime);
      const key = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      if (key in monthCounts) {
        monthCounts[key]++;
      }
    });

    return Object.entries(monthCounts).map(([month, count]) => ({
      month,
      count,
    }));
  },
});

/**
 * Get markers created by month for charts
 * READ-ONLY
 */
export const getMarkersCreatedByMonth = query({
  args: { months: v.number() },
  returns: v.array(v.object({
    month: v.string(),
    count: v.number(),
  })),
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const markers = await ctx.db.query("markers").collect();

    // Same grouping logic as maps
    const monthCounts: Record<string, number> = {};
    const now = new Date();

    for (let i = args.months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      monthCounts[key] = 0;
    }

    markers.forEach(marker => {
      const date = new Date(marker._creationTime);
      const key = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      if (key in monthCounts) {
        monthCounts[key]++;
      }
    });

    return Object.entries(monthCounts).map(([month, count]) => ({
      month,
      count,
    }));
  },
});
