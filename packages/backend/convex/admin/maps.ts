import { query } from "../_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "../../helpers/admin-helpers";

/**
 * Get all maps with aggregated statistics
 * READ-ONLY
 */
export const getAllMapsWithStats = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);

    const maps = await ctx.db.query("maps").collect();

    return await Promise.all(maps.map(async (map) => {
      const [owner, markers, collaborators] = await Promise.all([
        ctx.db.get(map.owner_id),
        ctx.db
          .query("markers")
          .withIndex("by_map_id", q => q.eq("map_id", map._id))
          .collect(),
        ctx.db
          .query("map_users")
          .withIndex("by_map_id", q => q.eq("map_id", map._id))
          .collect(),
      ]);

      return {
        ...map,
        owner,
        markersCount: markers.length,
        collaboratorsCount: collaborators.length,
      };
    }));
  },
});

/**
 * Get detailed statistics for a specific map
 * READ-ONLY
 */
export const getMapDetailStats = query({
  args: { mapId: v.id("maps") },
  returns: v.object({
    markersCount: v.number(),
    collectionsCount: v.number(),
    pathsCount: v.number(),
    labelsCount: v.number(),
    routesCount: v.number(),
    collaboratorsCount: v.number(),
  }),
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const [markers, collections, paths, labels, routes, collaborators] = await Promise.all([
      ctx.db.query("markers").withIndex("by_map_id", q => q.eq("map_id", args.mapId)).collect(),
      ctx.db.query("collections").withIndex("by_map_id", q => q.eq("map_id", args.mapId)).collect(),
      ctx.db.query("paths").withIndex("byMapId", q => q.eq("mapId", args.mapId)).collect(),
      ctx.db.query("labels").withIndex("by_map_id", q => q.eq("map_id", args.mapId)).collect(),
      ctx.db.query("routes").withIndex("by_map_id", q => q.eq("map_id", args.mapId)).collect(),
      ctx.db.query("map_users").withIndex("by_map_id", q => q.eq("map_id", args.mapId)).collect(),
    ]);

    return {
      markersCount: markers.length,
      collectionsCount: collections.length,
      pathsCount: paths.length,
      labelsCount: labels.length,
      routesCount: routes.length,
      collaboratorsCount: collaborators.length,
    };
  },
});
