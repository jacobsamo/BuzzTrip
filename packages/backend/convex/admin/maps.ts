import { zodQuery } from "../../convex/helpers";
import { requireAdmin } from "../../helpers/admin-helpers";
import { mapsSchema, userSchema } from "../../zod-schemas";
import * as z from "zod";
import { zid } from "convex-helpers/server/zod";

/**
 * Get all maps with aggregated statistics
 * READ-ONLY
 */
export const getAllMapsWithStats = zodQuery({
  args: {},
  returns: z.array(
    mapsSchema.extend({
      owner: userSchema.nullable(),
      markersCount: z.number(),
      collaboratorsCount: z.number(),
    })
  ),
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
export const getMapDetailStats = zodQuery({
  args: { mapId: zid("maps") },
  returns: z.object({
    markersCount: z.number(),
    collectionsCount: z.number(),
    pathsCount: z.number(),
    labelsCount: z.number(),
    routesCount: z.number(),
    collaboratorsCount: z.number(),
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
