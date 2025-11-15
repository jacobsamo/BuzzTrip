import { zodQuery } from "../../convex/helpers";
import { requireAdmin } from "../../helpers/admin-helpers";
import { mapsSchema, userSchema, mapViewSchema, iconSchema } from "../../zod-schemas";
import * as z from "zod";
import { zid } from "convex-helpers/server/zod4";

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

/**
 * Get map view analytics for a specific map
 * READ-ONLY
 */
export const getMapViewAnalytics = zodQuery({
  args: { mapId: zid("maps") },
  returns: z.object({
    totalViews: z.number(),
    uniqueUsers: z.number(),
    lastAccessed: z.number().nullable(),
    recentViews: z.array(
      mapViewSchema.pick({
        _id: true,
        _creationTime: true,
        userId: true,
        country: true,
        city: true,
        browser: true,
        device: true,
      })
    ),
    dailyViews: z.array(
      z.object({
        date: z.string(),
        views: z.number(),
      })
    ),
  }),
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const views = await ctx.db
      .query("mapViews")
      .withIndex("by_map_id", (q) => q.eq("mapId", args.mapId))
      .collect();

    // Get unique user IDs (excluding null/undefined for anonymous views)
    const uniqueUserIds = new Set(
      views.filter((v) => v.userId).map((v) => v.userId)
    );

    // Get most recent 10 views
    const recentViews = views
      .sort((a, b) => b._creationTime - a._creationTime)
      .slice(0, 10);

    // Get last accessed time (most recent view)
    const lastAccessed = views.length > 0
      ? Math.max(...views.map((v) => v._creationTime))
      : null;

    // Group views by day for the last 30 days
    const dailyViewsMap = new Map<string, number>();
    const now = Date.now();
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

    views.forEach((view) => {
      if (view._creationTime >= thirtyDaysAgo) {
        const isoString = new Date(view._creationTime).toISOString();
        const date = isoString.substring(0, 10); // YYYY-MM-DD
        dailyViewsMap.set(date, (dailyViewsMap.get(date) || 0) + 1);
      }
    });

    // Convert to array and sort by date
    const dailyViews = Array.from(dailyViewsMap.entries())
      .map(([date, views]) => ({ date, views }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      totalViews: views.length,
      uniqueUsers: uniqueUserIds.size,
      lastAccessed,
      recentViews,
      dailyViews,
    };
  },
});

/**
 * Get markers for a specific map with place information
 * READ-ONLY
 */
export const getMapMarkers = zodQuery({
  args: { mapId: zid("maps") },
  returns: z.array(
    z.object({
      _id: zid("markers"),
      _creationTime: z.number(),
      title: z.string(),
      note: z.string().optional(),
      lat: z.number(),
      lng: z.number(),
      icon: iconSchema,
      color: z.string(),
      created_by: zid("users"),
      creatorName: z.string().nullable(),
    })
  ),
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const markers = await ctx.db
      .query("markers")
      .withIndex("by_map_id", (q) => q.eq("map_id", args.mapId))
      .collect();

    return await Promise.all(
      markers.map(async (marker) => {
        const creator = await ctx.db.get(marker.created_by);
        return {
          _id: marker._id,
          _creationTime: marker._creationTime,
          title: marker.title,
          note: marker.note,
          lat: marker.lat,
          lng: marker.lng,
          icon: marker.icon,
          color: marker.color,
          created_by: marker.created_by,
          creatorName: creator?.name ?? null,
        };
      })
    );
  },
});

/**
 * Get paths for a specific map
 * READ-ONLY
 */
export const getMapPaths = zodQuery({
  args: { mapId: zid("maps") },
  returns: z.array(
    z.object({
      _id: zid("paths"),
      _creationTime: z.number(),
      title: z.string(),
      note: z.string().optional(),
      pathType: z.enum(["text", "circle", "rectangle", "polygon", "line"]),
      createdBy: zid("users"),
      creatorName: z.string().nullable(),
    })
  ),
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const paths = await ctx.db
      .query("paths")
      .withIndex("byMapId", (q) => q.eq("mapId", args.mapId))
      .collect();

    return await Promise.all(
      paths.map(async (path) => {
        const creator = await ctx.db.get(path.createdBy);
        return {
          _id: path._id,
          _creationTime: path._creationTime,
          title: path.title,
          note: path.note,
          pathType: path.pathType,
          createdBy: path.createdBy,
          creatorName: creator?.name ?? null,
        };
      })
    );
  },
});

/**
 * Get collaborators for a specific map with user details
 * READ-ONLY
 */
export const getMapCollaborators = zodQuery({
  args: { mapId: zid("maps") },
  returns: z.array(
    z.object({
      _id: zid("map_users"),
      _creationTime: z.number(),
      user_id: zid("users"),
      permission: z.enum(["owner", "editor", "viewer", "commenter"]).optional(),
      userName: z.string().nullable(),
      userEmail: z.string().nullable(),
      userImage: z.string().optional().nullable(),
    })
  ),
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const collaborators = await ctx.db
      .query("map_users")
      .withIndex("by_map_id", (q) => q.eq("map_id", args.mapId))
      .collect();

    return await Promise.all(
      collaborators.map(async (collab) => {
        const user = await ctx.db.get(collab.user_id);
        return {
          _id: collab._id,
          _creationTime: collab._creationTime,
          user_id: collab.user_id,
          permission: collab.permission,
          userName: user?.name ?? null,
          userEmail: user?.email ?? null,
          userImage: user?.image ?? null,
        };
      })
    );
  },
});

/**
 * Get marker and path creation timeline for a specific map
 * READ-ONLY
 */
export const getMapCreationTimeline = zodQuery({
  args: { mapId: zid("maps") },
  returns: z.object({
    dailyCreations: z.array(
      z.object({
        date: z.string(),
        markers: z.number(),
        paths: z.number(),
      })
    ),
  }),
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const [markers, paths] = await Promise.all([
      ctx.db
        .query("markers")
        .withIndex("by_map_id", (q) => q.eq("map_id", args.mapId))
        .collect(),
      ctx.db
        .query("paths")
        .withIndex("byMapId", (q) => q.eq("mapId", args.mapId))
        .collect(),
    ]);

    // Group by day for the last 30 days
    const dailyCreationsMap = new Map<
      string,
      { markers: number; paths: number }
    >();
    const now = Date.now();
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

    markers.forEach((marker) => {
      if (marker._creationTime >= thirtyDaysAgo) {
        const isoString = new Date(marker._creationTime).toISOString();
        const date = isoString.substring(0, 10); // YYYY-MM-DD
        const current = dailyCreationsMap.get(date) || { markers: 0, paths: 0 };
        dailyCreationsMap.set(date, {
          ...current,
          markers: current.markers + 1,
        });
      }
    });

    paths.forEach((path) => {
      if (path._creationTime >= thirtyDaysAgo) {
        const isoString = new Date(path._creationTime).toISOString();
        const date = isoString.substring(0, 10); // YYYY-MM-DD
        const current = dailyCreationsMap.get(date) || { markers: 0, paths: 0 };
        dailyCreationsMap.set(date, { ...current, paths: current.paths + 1 });
      }
    });

    // Convert to array and sort by date
    const dailyCreations = Array.from(dailyCreationsMap.entries())
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      dailyCreations,
    };
  },
});
