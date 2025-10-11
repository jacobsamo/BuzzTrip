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

    if (maps.length === 0) {
      // Return empty data if no maps exist
      return [];
    }

    // Find the earliest map to determine data range
    const earliestMap = maps.reduce((earliest, map) =>
      map._creationTime < earliest._creationTime ? map : earliest
    );

    const now = new Date();
    const earliestDate = new Date(earliestMap._creationTime);

    // Calculate months between earliest data and now
    const monthsDiff = (now.getFullYear() - earliestDate.getFullYear()) * 12
      + (now.getMonth() - earliestDate.getMonth()) + 1;

    // Use the smaller of requested months or actual data range
    const actualMonths = Math.min(args.months, Math.max(monthsDiff, 1));

    // Group by month
    const monthCounts: Record<string, number> = {};

    // Initialize months from earliest data or requested window
    for (let i = actualMonths - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      monthCounts[key] = 0;
    }

    // Count maps per month
    maps.forEach(map => {
      const date = new Date(map._creationTime);
      const key = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      if (monthCounts[key] !== undefined) {
        monthCounts[key]++;
      }
    });

    // Sort by date to ensure chronological order
    return Object.entries(monthCounts)
      .sort((a, b) => {
        const dateA = new Date(a[0]);
        const dateB = new Date(b[0]);
        return dateA.getTime() - dateB.getTime();
      })
      .map(([month, count]) => ({
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

    if (markers.length === 0) {
      // Return empty data if no markers exist
      return [];
    }

    // Find the earliest marker to determine data range
    const earliestMarker = markers.reduce((earliest, marker) =>
      marker._creationTime < earliest._creationTime ? marker : earliest
    );

    const now = new Date();
    const earliestDate = new Date(earliestMarker._creationTime);

    // Calculate months between earliest data and now
    const monthsDiff = (now.getFullYear() - earliestDate.getFullYear()) * 12
      + (now.getMonth() - earliestDate.getMonth()) + 1;

    // Use the smaller of requested months or actual data range
    const actualMonths = Math.min(args.months, Math.max(monthsDiff, 1));

    // Group by month
    const monthCounts: Record<string, number> = {};

    // Initialize months from earliest data or requested window
    for (let i = actualMonths - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      monthCounts[key] = 0;
    }

    // Count markers per month
    markers.forEach(marker => {
      const date = new Date(marker._creationTime);
      const key = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      if (monthCounts[key] !== undefined) {
        monthCounts[key]++;
      }
    });

    // Sort by date to ensure chronological order
    return Object.entries(monthCounts)
      .sort((a, b) => {
        const dateA = new Date(a[0]);
        const dateB = new Date(b[0]);
        return dateA.getTime() - dateB.getTime();
      })
      .map(([month, count]) => ({
        month,
        count,
      }));
  },
});
