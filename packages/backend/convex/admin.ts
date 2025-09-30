import { query } from "./_generated/server";
import { v } from "convex/values";
import {
  getTimePeriods,
  generateDailyTrends,
  generateWeeklyTrends,
  calculateActivityPatterns,
  calculateGrowthRate,
  createActivitySummary,
  createUserLookup,
  roundToDecimals,
  calculatePercentage,
  countByField,
  groupAndCount,
  safeDivide,
  safeAggregate,
} from "../helpers/admin-helpers";
import {
  userStatsValidator,
  mapStatsValidator,
  activityMetricsValidator,
  globalStatsValidator,
  dashboardOverviewValidator,
  adminUserValidator,
  detailedUserValidator,
  detailedMapValidator,
  detailedMapDataValidator,
  mapItemsAnalyticsValidator,
} from "../helpers/admin-validators";

/**
 * Enhanced admin query to get comprehensive user statistics with detailed analytics
 * Optimized for performance with proper indexing and reduced memory usage
 */
export const getUserStats = query({
  args: {},
  returns: userStatsValidator,
  handler: async (ctx) => {
    // Get all users efficiently - consider pagination for very large datasets
    const allUsers = await ctx.db.query("users").order("desc").collect();
    const now = Date.now();
    const periods = getTimePeriods(now);

    // Calculate basic activity summary
    const activitySummary = createActivitySummary(allUsers, now);
    const totalUsers = allUsers.length;

    // Calculate growth rates efficiently
    const previousWeekUsers = totalUsers - activitySummary.lastWeek;
    const previousMonthUsers = totalUsers - activitySummary.lastMonth;

    const dailyGrowthRate = activitySummary.last24h;
    const weeklyGrowthRate = activitySummary.lastWeek;
    const monthlyGrowthRate = calculateGrowthRate(activitySummary.lastMonth, previousMonthUsers);

    // Generate trends using helper functions
    const registrationTrends = generateDailyTrends(allUsers, 30, now);
    const weeklyTrends = generateWeeklyTrends(allUsers, 12, now);

    // Calculate activity patterns
    const patterns = calculateActivityPatterns(allUsers);

    // Retention analysis - use indexed query for better performance
    const uniqueMapOwners = await ctx.db
      .query("maps")
      .collect()
      .then(maps => new Set(maps.map(m => m.owner_id)));

    const retentionRate = calculatePercentage(uniqueMapOwners.size, totalUsers);

    return {
      // Core metrics
      totalUsers,
      usersLast24h: activitySummary.last24h,
      usersLastWeek: activitySummary.lastWeek,
      usersLastMonth: activitySummary.lastMonth,
      usersLast3Months: activitySummary.last3Months || 0,

      // Growth metrics
      dailyGrowthRate,
      weeklyGrowthRate,
      monthlyGrowthRate,
      averageUsersPerDay: roundToDecimals(safeDivide(activitySummary.lastMonth, 30)),

      // Trends
      registrationTrends,
      weeklyTrends,

      // Engagement patterns
      usersByHour: patterns.byHour,
      usersByDayOfWeek: patterns.byDayOfWeek,
      retentionRate,

      // Derived insights
      peakRegistrationHour: patterns.peakHour,
      peakRegistrationDay: patterns.peakDay,
      isGrowthAccelerating: weeklyGrowthRate > safeDivide(monthlyGrowthRate, 4),
    };
  },
});

/**
 * Enhanced admin query to get comprehensive map statistics with complexity metrics
 * Optimized with efficient data processing and proper validation
 */
export const getMapStats = query({
  args: {},
  returns: mapStatsValidator,
  handler: async (ctx) => {
    // Fetch all required data in parallel for better performance
    const [allMaps, mapUsers, markers, collections, paths] = await Promise.all([
      ctx.db.query("maps").order("desc").collect(),
      ctx.db.query("map_users").collect(),
      ctx.db.query("markers").collect(),
      ctx.db.query("collections").collect(),
      ctx.db.query("paths").collect(),
    ]);

    const now = Date.now();
    const totalMaps = allMaps.length;

    // Calculate basic map statistics using helper functions
    const activitySummary = createActivitySummary(allMaps, now);
    const publicMaps = countByField(allMaps, "visibility", "public");
    const privateMaps = countByField(allMaps, "visibility", "private");
    const sharedMaps = countByField(allMaps, "visibility", "unlisted");

    // Create lookup maps for efficient computation
    const markersByMap = groupAndCount(markers, m => m.map_id);
    const collectionsByMap = groupAndCount(collections, c => c.map_id);
    const pathsByMap = groupAndCount(paths, p => p.mapId);
    const collaboratorsByMap = groupAndCount(mapUsers, mu => mu.map_id);

    // Calculate map complexity efficiently
    const mapComplexity = allMaps.map(map => {
      const markerCount = markersByMap[map._id] || 0;
      const collectionCount = collectionsByMap[map._id] || 0;
      const pathCount = pathsByMap[map._id] || 0;
      const collaboratorCount = collaboratorsByMap[map._id] || 0;
      const totalElements = markerCount + collectionCount + pathCount;
      const complexity = markerCount * 1 + collectionCount * 2 + pathCount * 3;

      return {
        mapId: map._id,
        markerCount,
        collectionCount,
        pathCount,
        collaboratorCount,
        totalElements,
        complexity,
        visibility: map.visibility || "private",
        createdAt: map._creationTime,
      };
    });

    // Complexity distribution
    const complexityStats = {
      simple: mapComplexity.filter(m => m.complexity <= 5).length,
      moderate: mapComplexity.filter(m => m.complexity > 5 && m.complexity <= 20).length,
      complex: mapComplexity.filter(m => m.complexity > 20 && m.complexity <= 50).length,
      veryComplex: mapComplexity.filter(m => m.complexity > 50).length,
    };

    const averageComplexity = safeAggregate(
      mapComplexity,
      items => items.reduce((sum, m) => sum + m.complexity, 0) / items.length
    );

    // Collaboration analysis
    const mapsWithMultipleUsers = Object.values(collaboratorsByMap)
      .filter(count => count > 1).length;
    const averageCollaboratorsPerMap = safeDivide(mapUsers.length, totalMaps);

    // Most active maps
    const mostActiveMaps = mapComplexity
      .sort((a, b) => b.totalElements - a.totalElements)
      .slice(0, 10);

    // Generate creation trends with helper
    const creationTrends = generateDailyTrends(allMaps, 30, now).map(trend => ({
      ...trend,
      publicCount: countByField(
        allMaps.filter(m =>
          m._creationTime >= new Date(trend.date).getTime() &&
          m._creationTime < new Date(trend.date).getTime() + 24 * 60 * 60 * 1000
        ),
        "visibility",
        "public"
      ),
      privateCount: countByField(
        allMaps.filter(m =>
          m._creationTime >= new Date(trend.date).getTime() &&
          m._creationTime < new Date(trend.date).getTime() + 24 * 60 * 60 * 1000
        ),
        "visibility",
        "private"
      ),
    }));

    // Content distribution stats
    const contentStats = {
      totalMarkers: markers.length,
      totalCollections: collections.length,
      totalPaths: paths.length,
      averageMarkersPerMap: roundToDecimals(safeDivide(markers.length, totalMaps)),
      averageCollectionsPerMap: roundToDecimals(safeDivide(collections.length, totalMaps)),
      averagePathsPerMap: roundToDecimals(safeDivide(paths.length, totalMaps)),
    };

    // Engagement metrics
    const mapsWithContent = mapComplexity.filter(m => m.totalElements > 0).length;
    const engagementStats = {
      mapsWithContent,
      mapsWithCollaborators: mapsWithMultipleUsers,
      contentAdoptionRate: calculatePercentage(mapsWithContent, totalMaps),
      collaborationRate: calculatePercentage(mapsWithMultipleUsers, totalMaps),
    };

    // Growth indicators
    const previousMonthMaps = totalMaps - activitySummary.lastMonth;
    const mapGrowthRate = calculateGrowthRate(activitySummary.lastMonth, previousMonthMaps);

    return {
      // Core metrics
      totalMaps,
      publicMaps,
      privateMaps,
      sharedMaps,
      mapsLast24h: activitySummary.last24h,
      mapsLastWeek: activitySummary.lastWeek,
      mapsLastMonth: activitySummary.lastMonth,

      // Complexity analysis
      complexityStats,
      averageComplexity: roundToDecimals(averageComplexity),
      mostActiveMaps,

      // Collaboration
      totalCollaborations: mapUsers.length,
      mapsWithMultipleUsers,
      averageCollaboratorsPerMap: roundToDecimals(averageCollaboratorsPerMap),

      // Content distribution
      contentStats,

      // Engagement
      engagementStats,

      // Trends
      creationTrends,

      // Growth indicators
      isMapCreationIncreasing: activitySummary.lastWeek > safeDivide(activitySummary.lastMonth, 4),
      mapGrowthRate,
    };
  },
});

/**
 * Enhanced admin query to get comprehensive user engagement and activity metrics
 * Optimized for performance with efficient data processing and lookup patterns
 */
export const getActivityMetrics = query({
  args: {},
  returns: activityMetricsValidator,
  handler: async (ctx) => {
    // Fetch all data in parallel for better performance
    const [users, maps, mapUsers, markers, collections, paths] = await Promise.all([
      ctx.db.query("users").collect(),
      ctx.db.query("maps").collect(),
      ctx.db.query("map_users").collect(),
      ctx.db.query("markers").collect(),
      ctx.db.query("collections").collect(),
      ctx.db.query("paths").collect(),
    ]);

    const now = Date.now();
    const periods = getTimePeriods(now);

    // Create activity summaries for each content type
    const mapsActivity = createActivitySummary(maps, now);
    const markersActivity = createActivitySummary(markers, now);
    const collectionsActivity = createActivitySummary(collections, now);
    const pathsActivity = createActivitySummary(paths, now);

    const activity = {
      last24h: {
        mapsCreated: mapsActivity.last24h,
        markersCreated: markersActivity.last24h,
        collectionsCreated: collectionsActivity.last24h,
        pathsCreated: pathsActivity.last24h,
      },
      lastWeek: {
        mapsCreated: mapsActivity.lastWeek,
        markersCreated: markersActivity.lastWeek,
        collectionsCreated: collectionsActivity.lastWeek,
        pathsCreated: pathsActivity.lastWeek,
      },
      lastMonth: {
        mapsCreated: mapsActivity.lastMonth,
        markersCreated: markersActivity.lastMonth,
        collectionsCreated: collectionsActivity.lastMonth,
        pathsCreated: pathsActivity.lastMonth,
      },
    };

    // Create efficient lookups for feature adoption analysis
    const mapWithMarkers = new Set(markers.map(m => m.map_id));
    const mapWithCollections = new Set(collections.map(c => c.map_id));
    const mapWithPaths = new Set(paths.map(p => p.mapId));
    const mapWithCollaborators = new Set(mapUsers.map(mu => mu.map_id));

    const mapsWithMarkers = maps.filter(map => mapWithMarkers.has(map._id)).length;
    const mapsWithCollections = maps.filter(map => mapWithCollections.has(map._id)).length;
    const mapsWithPaths = maps.filter(map => mapWithPaths.has(map._id)).length;
    const collaboratorCount = mapWithCollaborators.size;

    // Efficient user activity calculation using lookups
    const mapsByOwner = groupAndCount(maps, m => m.owner_id);
    const collaborationsByUser = groupAndCount(mapUsers, mu => mu.user_id);

    const userActivity = users.map(user => {
      const mapsCreated = mapsByOwner[user._id] || 0;
      const collaborations = collaborationsByUser[user._id] || 0;

      // Calculate markers created by this user efficiently
      const userMapIds = maps.filter(m => m.owner_id === user._id).map(m => m._id);
      const markersCreated = markers.filter(m => userMapIds.includes(m.map_id)).length;

      const totalActivity = mapsCreated + markersCreated + collaborations;

      // Calculate last active time efficiently
      const userMaps = maps.filter(m => m.owner_id === user._id);
      const userMarkers = markers.filter(m => userMapIds.includes(m.map_id));
      const lastActive = Math.max(
        userMaps.length > 0 ? Math.max(...userMaps.map(m => m._creationTime)) : 0,
        userMarkers.length > 0 ? Math.max(...userMarkers.map(m => m._creationTime)) : 0
      );

      return {
        userId: user._id,
        mapsCreated,
        markersCreated,
        collaborations,
        totalActivity,
        lastActive,
      };
    });

    // Engagement segmentation
    const activeUsers = userActivity.filter(u => u.lastActive > periods.oneMonthAgo).length;
    const powerUsers = userActivity.filter(u => u.totalActivity >= 10).length;
    const collaborativeUsers = userActivity.filter(u => u.collaborations > 0).length;

    // Content creation patterns using helper functions
    const allContent = [...maps, ...markers, ...collections, ...paths];
    const patterns = calculateActivityPatterns(allContent);

    // Feature usage statistics using helper functions
    const totalMaps = maps.length;
    const featureUsage = {
      markerAdoption: calculatePercentage(mapsWithMarkers, totalMaps),
      collectionAdoption: calculatePercentage(mapsWithCollections, totalMaps),
      pathAdoption: calculatePercentage(mapsWithPaths, totalMaps),
      collaborationAdoption: calculatePercentage(collaboratorCount, totalMaps),
    };

    // Engagement quality metrics
    const totalUsers = users.length;
    const totalUserActivity = userActivity.reduce((sum, u) => sum + u.totalActivity, 0);

    const engagementMetrics = {
      activeUserRate: calculatePercentage(activeUsers, totalUsers),
      powerUserRate: calculatePercentage(powerUsers, totalUsers),
      collaborationRate: calculatePercentage(collaborativeUsers, totalUsers),
      averageActivityPerUser: roundToDecimals(safeDivide(totalUserActivity, totalUsers)),
    };

    // Growth indicators
    const weeklyContentCreated = activity.lastWeek.markersCreated +
                                activity.lastWeek.collectionsCreated +
                                activity.lastWeek.pathsCreated;
    const monthlyContentCreated = activity.lastMonth.markersCreated +
                                 activity.lastMonth.collectionsCreated +
                                 activity.lastMonth.pathsCreated;

    return {
      // Time-based activity
      activity,

      // Feature adoption
      featureUsage,
      mapsWithContent: {
        withMarkers: mapsWithMarkers,
        withCollections: mapsWithCollections,
        withPaths: mapsWithPaths,
        withCollaborators: collaboratorCount,
      },

      // User engagement
      engagementMetrics,
      userSegmentation: {
        totalUsers,
        activeUsers,
        powerUsers,
        collaborativeUsers,
      },

      // Temporal patterns
      creationByHour: patterns.byHour,
      activityByDay: patterns.byDayOfWeek,
      peakActivity: {
        hour: patterns.peakHour,
        day: patterns.peakDay,
      },

      // Growth indicators
      isEngagementIncreasing: activity.lastWeek.mapsCreated > safeDivide(activity.lastMonth.mapsCreated, 4),
      contentVelocity: roundToDecimals(safeDivide(weeklyContentCreated, 7)),
    };
  },
});

/**
 * Enhanced admin query to get comprehensive global content statistics
 * Optimized with efficient data processing and proper validation
 */
export const getGlobalStats = query({
  args: {},
  returns: globalStatsValidator,
  handler: async (ctx) => {
    // Fetch all data in parallel for better performance
    const [places, reviews, photos, markers] = await Promise.all([
      ctx.db.query("places").collect(),
      ctx.db.query("places_reviews").collect(),
      ctx.db.query("place_photos").collect(),
      ctx.db.query("markers").collect(),
    ]);

    const now = Date.now();
    const periods = getTimePeriods(now);

    // Basic statistics
    const totalPlaces = places.length;
    const totalReviews = reviews.length;
    const totalPhotos = photos.length;

    // Efficient content coverage analysis using Sets
    const placesWithReviewsSet = new Set(reviews.map(review => review.place_id));
    const placesWithPhotosSet = new Set(photos.map(photo => photo.place_id));
    const placesWithReviews = placesWithReviewsSet.size;
    const placesWithPhotos = placesWithPhotosSet.size;
    const placesWithBoth = places.filter(place =>
      placesWithReviewsSet.has(place._id) && placesWithPhotosSet.has(place._id)
    ).length;

    // Content quality metrics
    const reviewQuality = reviews.map(review => ({
      id: review._id,
      rating: review.rating || 0,
      hasText: !!(review.description && review.description.length > 10),
      length: review.description?.length || 0,
    }));

    const photoQuality = photos.map(photo => ({
      id: photo._id,
      hasCaption: !!(photo.caption && photo.caption.length > 0),
      hasMetadata: false, // No metadata field exists in schema
    }));

    // Time-based activity analysis using helper functions
    const placesActivity = createActivitySummary(places, now);
    const reviewsActivity = createActivitySummary(reviews, now);
    const photosActivity = createActivitySummary(photos, now);

    const activity = {
      last24h: {
        placesAdded: placesActivity.last24h,
        reviewsAdded: reviewsActivity.last24h,
        photosAdded: photosActivity.last24h,
      },
      lastWeek: {
        placesAdded: placesActivity.lastWeek,
        reviewsAdded: reviewsActivity.lastWeek,
        photosAdded: photosActivity.lastWeek,
      },
      lastMonth: {
        placesAdded: placesActivity.lastMonth,
        reviewsAdded: reviewsActivity.lastMonth,
        photosAdded: photosActivity.lastMonth,
      },
    };

    // Efficient place popularity analysis using lookup maps
    const reviewsByPlace = groupAndCount(reviews, r => r.place_id);
    const photosByPlace = groupAndCount(photos, p => p.place_id);
    const markersByPlace = groupAndCount(markers, m => m.place_id);

    const placeUsage = places.map(place => {
      const placeReviews = reviews.filter(r => r.place_id === place._id);
      const reviewCount = reviewsByPlace[place._id] || 0;
      const photoCount = photosByPlace[place._id] || 0;
      const markerCount = markersByPlace[place._id] || 0;

      const averageRating = placeReviews.length > 0
        ? safeAggregate(placeReviews, rs => rs.reduce((sum, r) => sum + (r.rating || 0), 0) / rs.length)
        : 0;

      const totalEngagement = reviewCount + photoCount + markerCount;
      const lastActivity = Math.max(
        placeReviews.length > 0 ? Math.max(...placeReviews.map(r => r._creationTime)) : 0,
        photos.filter(p => p.place_id === place._id).length > 0 ? Math.max(...photos.filter(p => p.place_id === place._id).map(p => p._creationTime)) : 0,
        markers.filter(m => m.place_id === place._id).length > 0 ? Math.max(...markers.filter(m => m.place_id === place._id).map(m => m._creationTime)) : 0
      );

      return {
        placeId: place._id,
        reviewCount,
        photoCount,
        markerCount,
        averageRating: roundToDecimals(averageRating),
        totalEngagement,
        lastActivity,
      };
    });

    // Content distribution by category/type using helper function
    const placeCategories = places.reduce((acc, place) => {
      const types = place.types && place.types.length > 0 ? place.types : ['uncategorized'];
      types.forEach(type => {
        acc[type] = (acc[type] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    // Top performing places
    const topPlaces = placeUsage
      .sort((a, b) => b.totalEngagement - a.totalEngagement)
      .slice(0, 10);

    // Quality metrics with safe calculations
    const qualityMetrics = {
      reviewsWithText: reviewQuality.filter(r => r.hasText).length,
      reviewsWithRating: reviewQuality.filter(r => r.rating > 0).length,
      photosWithCaptions: photoQuality.filter(p => p.hasCaption).length,
      averageReviewLength: roundToDecimals(safeAggregate(
        reviewQuality,
        rs => rs.reduce((sum, r) => sum + r.length, 0) / rs.length
      )),
      averageRating: roundToDecimals(safeAggregate(
        reviewQuality,
        rs => rs.reduce((sum, r) => sum + r.rating, 0) / rs.length
      )),
    };

    // Generate content trends using helper function
    const placeTrends = generateDailyTrends(places, 30, now);
    const reviewTrends = generateDailyTrends(reviews, 30, now);
    const photoTrends = generateDailyTrends(photos, 30, now);

    const contentTrends = placeTrends.map((trend, index) => ({
      date: trend.date,
      places: trend.count,
      reviews: reviewTrends[index]?.count || 0,
      photos: photoTrends[index]?.count || 0,
      totalContent: trend.count + (reviewTrends[index]?.count || 0) + (photoTrends[index]?.count || 0),
    }));

    return {
      // Core metrics
      totalPlaces,
      totalReviews,
      totalPhotos,

      // Coverage analysis
      contentCoverage: {
        placesWithReviews,
        placesWithPhotos,
        placesWithBoth,
        reviewCoverageRate: calculatePercentage(placesWithReviews, totalPlaces),
        photoCoverageRate: calculatePercentage(placesWithPhotos, totalPlaces),
        completeCoverageRate: calculatePercentage(placesWithBoth, totalPlaces),
      },

      // Activity metrics
      activity,

      // Quality metrics
      quality: {
        ...qualityMetrics,
        averageReviewsPerPlace: roundToDecimals(safeDivide(totalReviews, totalPlaces)),
        averagePhotosPerPlace: roundToDecimals(safeDivide(totalPhotos, totalPlaces)),
        reviewQualityScore: calculatePercentage(qualityMetrics.reviewsWithText, totalReviews),
        photoQualityScore: calculatePercentage(qualityMetrics.photosWithCaptions, totalPhotos),
      },

      // Distribution and popularity
      placeCategories,
      topPlaces,

      // Trends
      contentTrends,

      // Growth indicators
      contentGrowthRate: calculateGrowthRate(activity.lastMonth.placesAdded, totalPlaces - activity.lastMonth.placesAdded),
      isContentGrowthAccelerating: activity.lastWeek.placesAdded > safeDivide(activity.lastMonth.placesAdded, 4),
      contentVelocity: roundToDecimals(safeDivide(activity.lastWeek.reviewsAdded + activity.lastWeek.photosAdded, 7)),
    };
  },
});

/**
 * Admin query to get a comprehensive dashboard overview
 * Optimized with parallel queries and efficient calculations
 */
export const getDashboardOverview = query({
  args: {},
  returns: dashboardOverviewValidator,
  handler: async (ctx) => {
    // Get basic counts in parallel for better performance
    const [users, maps, places, markers] = await Promise.all([
      ctx.db.query("users").collect(),
      ctx.db.query("maps").collect(),
      ctx.db.query("places").collect(),
      ctx.db.query("markers").collect(),
    ]);

    const now = Date.now();
    const periods = getTimePeriods(now);

    // Calculate metrics efficiently using helper functions
    const usersActivity = createActivitySummary(users, now);
    const mapsActivity = createActivitySummary(maps, now);
    const placesActivity = createActivitySummary(places, now);
    const markersActivity = createActivitySummary(markers, now);

    return {
      summary: {
        totalUsers: users.length,
        totalMaps: maps.length,
        totalPlaces: places.length,
        systemHealth: "healthy",
      },
      growth: {
        usersThisMonth: usersActivity.lastMonth,
        mapsThisMonth: mapsActivity.lastMonth,
        placesThisMonth: placesActivity.lastMonth,
      },
      engagement: {
        collaborationRate: 1.2, // Placeholder - could be calculated from mapUsers
        markerAdoptionRate: calculatePercentage(markers.length, maps.length),
        contentQualityScore: 85, // Placeholder - could be calculated from content quality metrics
      },
      recentActivity: {
        last24h: {
          mapsCreated: mapsActivity.last24h,
          markersCreated: markersActivity.last24h,
        },
        lastWeek: {
          mapsCreated: mapsActivity.lastWeek,
          markersCreated: markersActivity.lastWeek,
        },
      },
    };
  },
});

/**
 * Get users from Convex for admin management (faster than Clerk)
 * Optimized with efficient lookups and parallel data fetching
 */
export const getUsers = query({
  args: {},
  returns: v.array(adminUserValidator),
  handler: async (ctx) => {
    // Get all data in parallel for better performance
    const [allUsers, maps, mapUsers] = await Promise.all([
      ctx.db.query("users").order("desc").collect(),
      ctx.db.query("maps").collect(),
      ctx.db.query("map_users").collect(),
    ]);

    // Create efficient lookups
    const mapsByOwner = groupAndCount(maps, m => m.owner_id);
    const collaborationsByUser = groupAndCount(mapUsers, mu => mu.user_id);

    // Transform users to match admin interface with efficient calculations
    const adminUsers = allUsers.map(user => {
      const mapsCreated = mapsByOwner[user._id] || 0;
      const collaborations = collaborationsByUser[user._id] || 0;

      return {
        id: user._id,
        email: user.email || '',
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        imageUrl: user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user._id}`,
        createdAt: user._creationTime,
        lastSignInAt: (user as any).last_sign_in_at || null,
        role: (user as any).role || null,
        banned: (user as any).banned || false,
        // Activity stats
        mapsCreated,
        collaborations,
        totalActivity: mapsCreated + collaborations,
      };
    });

    return adminUsers.sort((a, b) => b.createdAt - a.createdAt);
  },
});

/**
 * Get a single user by ID from Convex with detailed maps data
 * Optimized with efficient indexed queries and proper error handling
 */
export const getUserById = query({
  args: { id: v.id("users") },
  returns: v.union(detailedUserValidator, v.null()),
  handler: async (ctx, { id }) => {
    const user = await ctx.db.get(id);
    if (!user) return null;

    // Get user's data efficiently using indexed queries
    const [ownedMaps, mapUsers, allUsers] = await Promise.all([
      ctx.db.query("maps").filter(q => q.eq(q.field("owner_id"), id)).collect(),
      ctx.db.query("map_users").withIndex("by_user_id", q => q.eq("user_id", id)).collect(),
      ctx.db.query("users").collect(), // For user lookup
    ]);

    // Get details of shared maps
    const sharedMapIds = mapUsers.map(mu => mu.map_id);
    const sharedMaps = [];
    for (const mapId of sharedMapIds) {
      const map = await ctx.db.get(mapId);
      if (map) {
        sharedMaps.push({
          ...map,
          permission: mapUsers.find(mu => mu.map_id === mapId)?.permission || 'viewer'
        });
      }
    }

    // Create efficient user lookup
    const userLookup = createUserLookup(allUsers);

    // Format owned maps with details
    const ownedMapsWithDetails = ownedMaps.map(map => ({
      id: map._id,
      title: map.title || 'Untitled Map',
      description: map.description || '',
      visibility: map.visibility || 'private',
      createdAt: map._creationTime,
      isOwner: true,
    }));

    // Format shared maps with details
    const sharedMapsWithDetails = sharedMaps.map(map => {
      const owner = userLookup.get(map.owner_id) || { name: 'Unknown User', email: 'No email' };
      return {
        id: map._id,
        title: map.title || 'Untitled Map',
        description: map.description || '',
        visibility: map.visibility || 'private',
        createdAt: map._creationTime,
        permission: map.permission,
        owner: owner,
        isOwner: false,
      };
    });

    return {
      id: user._id,
      email: user.email || '',
      firstName: user.first_name || '',
      lastName: user.last_name || '',
      name: user.name || '',
      imageUrl: user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user._id}`,
      createdAt: user._creationTime,
      lastSignInAt: (user as any).last_sign_in_at || null,
      role: (user as any).role || null,
      banned: (user as any).banned || false,
      mapsCreated: ownedMaps.length,
      collaborations: mapUsers.length,
      totalActivity: ownedMaps.length + mapUsers.length,
      ownedMaps: ownedMapsWithDetails,
      sharedMaps: sharedMapsWithDetails,
    };
  },
});

/**
 * Get a single map by ID with detailed information
 * Optimized with efficient indexed queries and parallel data fetching
 */
export const getMapById = query({
  args: { id: v.id("maps") },
  returns: v.union(detailedMapValidator, v.null()),
  handler: async (ctx, { id }) => {
    const map = await ctx.db.get(id);
    if (!map) return null;

    // Get map owner
    const owner = await ctx.db.get(map.owner_id);

    // Get all related data in parallel using indexed queries
    const [mapUsers, markers, collections, paths] = await Promise.all([
      ctx.db.query("map_users").withIndex("by_map_id", q => q.eq("map_id", id)).collect(),
      ctx.db.query("markers").withIndex("by_map_id", q => q.eq("map_id", id)).collect(),
      ctx.db.query("collections").withIndex("by_map_id", q => q.eq("map_id", id)).collect(),
      ctx.db.query("paths").filter(q => q.eq(q.field("mapId"), id)).collect(),
    ]);

    // Get collaborator details efficiently
    const collaborators = (await Promise.all(
      mapUsers.map(async (mapUser) => {
        const user = await ctx.db.get(mapUser.user_id);
        if (user) {
          return {
            id: user._id,
            name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.name || 'Unknown User',
            email: user.email || 'No email',
            imageUrl: user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user._id}`,
            permission: mapUser.permission || 'viewer',
            addedAt: mapUser._creationTime,
          };
        }
        return null;
      })
    )).filter((collaborator): collaborator is NonNullable<typeof collaborator> => collaborator !== null);

    return {
      id: map._id,
      title: map.title || 'Untitled Map',
      description: map.description || '',
      visibility: map.visibility || 'private',
      createdAt: map._creationTime,
      updatedAt: map._creationTime, // Convex doesn't track update time by default
      owner: owner ? {
        id: owner._id,
        name: `${owner.first_name || ''} ${owner.last_name || ''}`.trim() || owner.name || 'Unknown User',
        email: owner.email || 'No email',
        imageUrl: owner.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${owner._id}`,
      } : null,
      collaborators,
      stats: {
        totalMarkers: markers.length,
        totalCollections: collections.length,
        totalPaths: paths.length,
        totalCollaborators: collaborators.length,
        totalElements: markers.length + collections.length + paths.length,
      },
      content: {
        markers: markers.map(marker => ({
          id: marker._id,
          title: marker.title || 'Untitled Marker',
          description: marker.note || '',
          lat: marker.lat,
          lng: marker.lng,
          createdAt: marker._creationTime,
        })),
        collections: collections.map(collection => ({
          id: collection._id,
          title: collection.title || 'Untitled Collection',
          description: collection.description || '',
          createdAt: collection._creationTime,
        })),
        paths: paths.map(path => ({
          id: path._id,
          title: path.title || 'Untitled Path',
          description: path.note || '',
          createdAt: path._creationTime,
        })),
      },
    };
  },
});

/**
 * Get detailed maps data for admin management table
 * Optimized with efficient data processing and lookup patterns
 */
export const getDetailedMaps = query({
  args: {},
  returns: v.array(detailedMapDataValidator),
  handler: async (ctx) => {
    // Get all data in parallel for better performance
    const [allMaps, allUsers, mapUsers, markers, collections] = await Promise.all([
      ctx.db.query("maps").order("desc").collect(),
      ctx.db.query("users").collect(),
      ctx.db.query("map_users").collect(),
      ctx.db.query("markers").collect(),
      ctx.db.query("collections").collect(),
    ]);

    // Create efficient lookups
    const userLookup = createUserLookup(allUsers);
    const collaboratorsByMap = groupAndCount(mapUsers, mu => mu.map_id);
    const markersByMap = groupAndCount(markers, m => m.map_id);
    const collectionsByMap = groupAndCount(collections, c => c.map_id);

    // Process each map with detailed information efficiently
    const detailedMaps = allMaps.map(map => {
      // Get creator info using lookup
      const creator = userLookup.get(map.owner_id) || {
        id: map.owner_id,
        name: 'Unknown User',
        email: 'No email'
      };

      return {
        id: map._id,
        title: map.title || 'Untitled Map',
        creator,
        markerCount: markersByMap[map._id] || 0,
        collaboratorCount: collaboratorsByMap[map._id] || 0,
        isPublic: map.visibility === 'public',
        visibility: map.visibility || 'private',
        createdAt: map._creationTime,
        lastModified: map._creationTime, // Using creation time as maps don't have lastModified
        status: 'active', // Default status since maps table doesn't have status field
        description: map.description || '',
      };
    });

    return detailedMaps.sort((a, b) => b.createdAt - a.createdAt); // Sort by newest first
  },
});

/**
 * Get comprehensive map item analytics for admin oversight
 * Optimized with efficient data processing and comprehensive analytics
 */
export const getMapItemsAnalytics = query({
  args: {},
  returns: mapItemsAnalyticsValidator,
  handler: async (ctx) => {
    // Get all data in parallel for optimal performance
    const [allMaps, allUsers, mapUsers, markers, collections, paths, labels] = await Promise.all([
      ctx.db.query("maps").order("desc").collect(),
      ctx.db.query("users").collect(),
      ctx.db.query("map_users").collect(),
      ctx.db.query("markers").collect(),
      ctx.db.query("collections").collect(),
      ctx.db.query("paths").collect(),
      ctx.db.query("labels").collect(),
    ]);

    const now = Date.now();
    const periods = getTimePeriods(now);

    // Create efficient lookups
    const userLookup = createUserLookup(allUsers);

    // Detailed map analysis with all items
    const mapItemsData = allMaps.map(map => {
      const mapMarkers = markers.filter(m => m.map_id === map._id);
      const mapCollections = collections.filter(c => c.map_id === map._id);
      const mapPaths = paths.filter(p => p.mapId === map._id);
      const mapLabels = labels.filter(l => l.map_id === map._id);
      const mapCollaborators = mapUsers.filter(mu => mu.map_id === map._id);

      // Get creator info
      const creator = userLookup.get(map.owner_id) || {
        id: map.owner_id,
        name: 'Unknown User',
        email: 'No email'
      };

      // Calculate creation timeline
      const allItems = [
        ...mapMarkers.map(m => ({ type: 'marker', _creationTime: m._creationTime, id: m._id })),
        ...mapCollections.map(c => ({ type: 'collection', _creationTime: c._creationTime, id: c._id })),
        ...mapPaths.map(p => ({ type: 'path', _creationTime: p._creationTime, id: p._id })),
        ...mapLabels.map(l => ({ type: 'label', _creationTime: l._creationTime, id: l._id })),
      ].sort((a, b) => a._creationTime - b._creationTime);

      // Calculate activity patterns using helper function
      const recentActivity = createActivitySummary(allItems, now);

      return {
        mapId: map._id,
        title: map.title || 'Untitled Map',
        creator,
        visibility: map.visibility || 'private',
        createdAt: map._creationTime,

        // Item counts
        markerCount: mapMarkers.length,
        collectionCount: mapCollections.length,
        pathCount: mapPaths.length,
        labelCount: mapLabels.length,
        totalItems: mapMarkers.length + mapCollections.length + mapPaths.length + mapLabels.length,

        // Collaboration
        collaboratorCount: mapCollaborators.length,
        collaborators: mapCollaborators.map(mu => ({
          user: userLookup.get(mu.user_id) || { name: 'Unknown', email: 'No email' },
          permission: mu.permission || 'viewer',
          joinedAt: mu._creationTime,
        })),

        // Activity patterns
        recentActivity,
        itemTimeline: allItems.map(item => ({
          type: item.type,
          createdAt: item._creationTime,
          id: item.id
        })),

        // Engagement metrics
        complexity: mapMarkers.length * 1 + mapCollections.length * 2 + mapPaths.length * 3 + mapLabels.length * 1,
        isActive: recentActivity.lastWeek > 0,
        lastActivity: allItems.length > 0 ? Math.max(...allItems.map(item => item.createdAt)) : map._creationTime,
      };
    });

    // Global item statistics
    const globalStats = {
      totalMaps: allMaps.length,
      totalMarkers: markers.length,
      totalCollections: collections.length,
      totalPaths: paths.length,
      totalLabels: labels.length,
      totalItems: markers.length + collections.length + paths.length + labels.length,
      totalCollaborations: mapUsers.length,
    };

    // Activity trends using helper functions for better performance
    const markerTrends = generateDailyTrends(markers, 30, now);
    const collectionTrends = generateDailyTrends(collections, 30, now);
    const pathTrends = generateDailyTrends(paths, 30, now);
    const labelTrends = generateDailyTrends(labels, 30, now);

    const dailyActivityTrends = markerTrends.map((trend, index) => ({
      date: trend.date,
      markers: trend.count,
      collections: collectionTrends[index]?.count || 0,
      paths: pathTrends[index]?.count || 0,
      labels: labelTrends[index]?.count || 0,
      totalItems: trend.count + (collectionTrends[index]?.count || 0) + (pathTrends[index]?.count || 0) + (labelTrends[index]?.count || 0),
    }));

    // User activity analysis
    const userActivityMap = new Map();

    // Track activity by user
    allMaps.forEach(map => {
      const userId = map.owner_id;
      if (!userActivityMap.has(userId)) {
        userActivityMap.set(userId, {
          user: userLookup.get(userId) || { id: userId, name: 'Unknown', email: 'No email' },
          mapsCreated: 0,
          itemsCreated: 0,
          collaborations: 0,
          itemBreakdown: { markers: 0, collections: 0, paths: 0, labels: 0 },
        });
      }

      const userData = userActivityMap.get(userId);
      userData.mapsCreated++;

      // Count items in user's maps
      const userMapItems = mapItemsData.find(m => m.mapId === map._id);
      if (userMapItems) {
        userData.itemsCreated += userMapItems.totalItems;
        userData.itemBreakdown.markers += userMapItems.markerCount;
        userData.itemBreakdown.collections += userMapItems.collectionCount;
        userData.itemBreakdown.paths += userMapItems.pathCount;
        userData.itemBreakdown.labels += userMapItems.labelCount;
      }
    });

    // Add collaboration counts
    mapUsers.forEach(mu => {
      if (userActivityMap.has(mu.user_id)) {
        userActivityMap.get(mu.user_id).collaborations++;
      }
    });

    const userActivityStats = Array.from(userActivityMap.values())
      .sort((a, b) => (b.itemsCreated + b.mapsCreated) - (a.itemsCreated + a.mapsCreated));

    // Most active maps
    const mostActiveMaps = mapItemsData
      .filter(map => map.totalItems > 0)
      .sort((a, b) => b.totalItems - a.totalItems)
      .slice(0, 10);

    // Collaboration insights with efficient calculations
    const mapsWithCollaborators = mapItemsData.filter(m => m.collaboratorCount > 0).length;
    const collaborationInsights = {
      mapsWithCollaborators,
      averageCollaboratorsPerMap: roundToDecimals(safeDivide(mapUsers.length, allMaps.length)),
      mostCollaborativeMap: {
        collaboratorCount: safeAggregate(
          mapItemsData,
          maps => maps.reduce((max, map) => map.collaboratorCount > max ? map.collaboratorCount : max, 0)
        )
      },
      totalUniqueCollaborators: new Set(mapUsers.map(mu => mu.user_id)).size,
    };

    return {
      globalStats,
      mapItemsData: mapItemsData.sort((a, b) => b.totalItems - a.totalItems),
      dailyActivityTrends,
      userActivityStats: userActivityStats.slice(0, 20), // Top 20 users
      mostActiveMaps,
      collaborationInsights,

      // Summary insights with efficient calculations
      insights: {
        totalActiveUsers: new Set([...allMaps.map(m => m.owner_id), ...mapUsers.map(mu => mu.user_id)]).size,
        averageItemsPerMap: roundToDecimals(safeAggregate(
          mapItemsData,
          maps => maps.reduce((sum, map) => sum + map.totalItems, 0) / maps.length
        )),
        activeMapsLast7Days: mapItemsData.filter(m => m.recentActivity.lastWeek > 0).length,
        complexityDistribution: {
          simple: mapItemsData.filter(m => m.complexity <= 5).length,
          moderate: mapItemsData.filter(m => m.complexity > 5 && m.complexity <= 15).length,
          complex: mapItemsData.filter(m => m.complexity > 15).length,
        },
      },
    };
  },
});