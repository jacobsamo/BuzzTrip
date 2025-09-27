import { query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Enhanced admin query to get comprehensive user statistics with detailed analytics
 */
export const getUserStats = query({
  args: {},
  handler: async (ctx) => {
    // Get all users for comprehensive analysis
    const allUsers = await ctx.db.query("users").collect();
    const now = Date.now();

    // Define time periods
    const oneDayAgo = now - (24 * 60 * 60 * 1000);
    const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = now - (30 * 24 * 60 * 60 * 1000);
    const threeMonthsAgo = now - (90 * 24 * 60 * 60 * 1000);
    const oneYearAgo = now - (365 * 24 * 60 * 60 * 1000);

    // Basic counts
    const totalUsers = allUsers.length;
    const usersLast24h = allUsers.filter(u => u._creationTime > oneDayAgo).length;
    const usersLastWeek = allUsers.filter(u => u._creationTime > oneWeekAgo).length;
    const usersLastMonth = allUsers.filter(u => u._creationTime > oneMonthAgo).length;
    const usersLast3Months = allUsers.filter(u => u._creationTime > threeMonthsAgo).length;

    // Growth rate calculations
    const dailyGrowthRate = usersLast24h;
    const weeklyGrowthRate = usersLastWeek;
    const monthlyGrowthRate = ((usersLastMonth / Math.max(totalUsers - usersLastMonth, 1)) * 100);

    // Registration trends (last 30 days)
    const registrationTrends = [];
    for (let i = 29; i >= 0; i--) {
      const dayStart = now - (i * 24 * 60 * 60 * 1000);
      const dayEnd = dayStart + (24 * 60 * 60 * 1000);
      const dayUsers = allUsers.filter(user =>
        user._creationTime >= dayStart && user._creationTime < dayEnd
      );
      registrationTrends.push({
        date: new Date(dayStart).toISOString().split('T')[0],
        count: dayUsers.length,
        dayOfWeek: new Date(dayStart).getDay(),
        weekNumber: Math.floor(i / 7)
      });
    }

    // Weekly aggregation for cleaner trends
    const weeklyTrends = [];
    for (let week = 0; week < 12; week++) {
      const weekStart = now - ((week + 1) * 7 * 24 * 60 * 60 * 1000);
      const weekEnd = now - (week * 7 * 24 * 60 * 60 * 1000);
      const weekUsers = allUsers.filter(user =>
        user._creationTime >= weekStart && user._creationTime < weekEnd
      );
      weeklyTrends.unshift({
        week: `Week ${12 - week}`,
        count: weekUsers.length,
        startDate: new Date(weekStart).toISOString().split('T')[0]
      });
    }

    // User engagement patterns
    const usersByHour = new Array(24).fill(0);
    const usersByDayOfWeek = new Array(7).fill(0);

    allUsers.forEach(user => {
      const createdDate = new Date(user._creationTime);
      usersByHour[createdDate.getUTCHours()]++;
      usersByDayOfWeek[createdDate.getUTCDay()]++;
    });

    // Retention analysis (users who created maps)
    const maps = await ctx.db.query("maps").collect();
    const usersWithMaps = new Set(maps.map(m => m.user_id));
    const retentionRate = (usersWithMaps.size / totalUsers) * 100;

    return {
      // Core metrics
      totalUsers,
      usersLast24h,
      usersLastWeek,
      usersLastMonth,
      usersLast3Months,

      // Growth metrics
      dailyGrowthRate,
      weeklyGrowthRate,
      monthlyGrowthRate: Math.round(monthlyGrowthRate * 100) / 100,
      averageUsersPerDay: Math.round((usersLastMonth / 30) * 100) / 100,

      // Trends
      registrationTrends,
      weeklyTrends,

      // Engagement patterns
      usersByHour,
      usersByDayOfWeek,
      retentionRate: Math.round(retentionRate * 100) / 100,

      // Derived insights
      peakRegistrationHour: usersByHour.indexOf(Math.max(...usersByHour)),
      peakRegistrationDay: usersByDayOfWeek.indexOf(Math.max(...usersByDayOfWeek)),
      isGrowthAccelerating: usersLastWeek > (usersLastMonth - usersLastWeek) / 3,
    };
  },
});

/**
 * Enhanced admin query to get comprehensive map statistics with complexity metrics
 */
export const getMapStats = query({
  args: {},
  handler: async (ctx) => {
    // Get all data
    const allMaps = await ctx.db.query("maps").collect();
    const mapUsers = await ctx.db.query("map_users").collect();
    const markers = await ctx.db.query("markers").collect();
    const collections = await ctx.db.query("collections").collect();
    const paths = await ctx.db.query("paths").collect();

    const now = Date.now();
    const oneDayAgo = now - (24 * 60 * 60 * 1000);
    const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = now - (30 * 24 * 60 * 60 * 1000);

    // Basic map statistics
    const totalMaps = allMaps.length;
    const publicMaps = allMaps.filter(map => map.visibility === "public").length;
    const privateMaps = allMaps.filter(map => map.visibility === "private").length;
    const sharedMaps = allMaps.filter(map => map.visibility === "unlisted").length;

    // Activity patterns by time period
    const mapsLast24h = allMaps.filter(map => map._creationTime > oneDayAgo).length;
    const mapsLastWeek = allMaps.filter(map => map._creationTime > oneWeekAgo).length;
    const mapsLastMonth = allMaps.filter(map => map._creationTime > oneMonthAgo).length;

    // Map complexity analysis
    const mapComplexity = allMaps.map(map => {
      const mapMarkers = markers.filter(m => m.map_id === map._id);
      const mapCollections = collections.filter(c => c.map_id === map._id);
      const mapPaths = paths.filter(p => p.map_id === map._id);
      const mapCollaborators = mapUsers.filter(mu => mu.map_id === map._id);

      return {
        mapId: map._id,
        markerCount: mapMarkers.length,
        collectionCount: mapCollections.length,
        pathCount: mapPaths.length,
        collaboratorCount: mapCollaborators.length,
        totalElements: mapMarkers.length + mapCollections.length + mapPaths.length,
        complexity: mapMarkers.length * 1 + mapCollections.length * 2 + mapPaths.length * 3, // weighted complexity
        visibility: map.visibility,
        createdAt: map._creationTime,
      };
    });

    // Complexity metrics
    const complexityStats = {
      simple: mapComplexity.filter(m => m.complexity <= 5).length,
      moderate: mapComplexity.filter(m => m.complexity > 5 && m.complexity <= 20).length,
      complex: mapComplexity.filter(m => m.complexity > 20 && m.complexity <= 50).length,
      veryComplex: mapComplexity.filter(m => m.complexity > 50).length,
    };

    const averageComplexity = mapComplexity.reduce((sum, m) => sum + m.complexity, 0) / mapComplexity.length || 0;

    // Collaboration patterns
    const collaborationStats = mapUsers.reduce((acc, mapUser) => {
      acc[mapUser.map_id] = (acc[mapUser.map_id] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mapsWithMultipleUsers = Object.values(collaborationStats).filter(count => count > 1).length;
    const averageCollaboratorsPerMap = mapUsers.length / totalMaps || 0;

    // Most active maps (by element count)
    const mostActiveMaps = mapComplexity
      .sort((a, b) => b.totalElements - a.totalElements)
      .slice(0, 10);

    // Map creation trends (daily for last 30 days)
    const creationTrends = [];
    for (let i = 29; i >= 0; i--) {
      const dayStart = now - (i * 24 * 60 * 60 * 1000);
      const dayEnd = dayStart + (24 * 60 * 60 * 1000);
      const dayMaps = allMaps.filter(map =>
        map._creationTime >= dayStart && map._creationTime < dayEnd
      );
      creationTrends.push({
        date: new Date(dayStart).toISOString().split('T')[0],
        count: dayMaps.length,
        publicCount: dayMaps.filter(m => m.visibility === "public").length,
        privateCount: dayMaps.filter(m => m.visibility === "private").length,
      });
    }

    // Content distribution
    const contentStats = {
      totalMarkers: markers.length,
      totalCollections: collections.length,
      totalPaths: paths.length,
      averageMarkersPerMap: Math.round((markers.length / totalMaps) * 100) / 100 || 0,
      averageCollectionsPerMap: Math.round((collections.length / totalMaps) * 100) / 100 || 0,
      averagePathsPerMap: Math.round((paths.length / totalMaps) * 100) / 100 || 0,
    };

    // Engagement metrics
    const engagementStats = {
      mapsWithContent: mapComplexity.filter(m => m.totalElements > 0).length,
      mapsWithCollaborators: mapsWithMultipleUsers,
      contentAdoptionRate: Math.round((mapComplexity.filter(m => m.totalElements > 0).length / totalMaps) * 100),
      collaborationRate: Math.round((mapsWithMultipleUsers / totalMaps) * 100),
    };

    return {
      // Core metrics
      totalMaps,
      publicMaps,
      privateMaps,
      sharedMaps,
      mapsLast24h,
      mapsLastWeek,
      mapsLastMonth,

      // Complexity analysis
      complexityStats,
      averageComplexity: Math.round(averageComplexity * 100) / 100,
      mostActiveMaps,

      // Collaboration
      totalCollaborations: mapUsers.length,
      mapsWithMultipleUsers,
      averageCollaboratorsPerMap: Math.round(averageCollaboratorsPerMap * 100) / 100,

      // Content distribution
      contentStats,

      // Engagement
      engagementStats,

      // Trends
      creationTrends,

      // Growth indicators
      isMapCreationIncreasing: mapsLastWeek > mapsLastMonth / 4,
      mapGrowthRate: Math.round((mapsLastMonth / Math.max(totalMaps - mapsLastMonth, 1)) * 100 * 100) / 100,
    };
  },
});

/**
 * Enhanced admin query to get comprehensive user engagement and activity metrics
 */
export const getActivityMetrics = query({
  args: {},
  handler: async (ctx) => {
    // Get all data
    const users = await ctx.db.query("users").collect();
    const maps = await ctx.db.query("maps").collect();
    const mapUsers = await ctx.db.query("map_users").collect();
    const markers = await ctx.db.query("markers").collect();
    const collections = await ctx.db.query("collections").collect();
    const paths = await ctx.db.query("paths").collect();

    const now = Date.now();
    const oneDayAgo = now - (24 * 60 * 60 * 1000);
    const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = now - (30 * 24 * 60 * 60 * 1000);

    // Activity by time periods
    const activity = {
      last24h: {
        mapsCreated: maps.filter(m => m._creationTime > oneDayAgo).length,
        markersCreated: markers.filter(m => m._creationTime > oneDayAgo).length,
        collectionsCreated: collections.filter(c => c._creationTime > oneDayAgo).length,
        pathsCreated: paths.filter(p => p._creationTime > oneDayAgo).length,
      },
      lastWeek: {
        mapsCreated: maps.filter(m => m._creationTime > oneWeekAgo).length,
        markersCreated: markers.filter(m => m._creationTime > oneWeekAgo).length,
        collectionsCreated: collections.filter(c => c._creationTime > oneWeekAgo).length,
        pathsCreated: paths.filter(p => p._creationTime > oneWeekAgo).length,
      },
      lastMonth: {
        mapsCreated: maps.filter(m => m._creationTime > oneMonthAgo).length,
        markersCreated: markers.filter(m => m._creationTime > oneMonthAgo).length,
        collectionsCreated: collections.filter(c => c._creationTime > oneMonthAgo).length,
        pathsCreated: paths.filter(p => p._creationTime > oneMonthAgo).length,
      },
    };

    // Feature adoption analysis
    const mapsWithMarkers = maps.filter(map =>
      markers.some(marker => marker.map_id === map._id)
    ).length;

    const mapsWithCollections = maps.filter(map =>
      collections.some(collection => collection.map_id === map._id)
    ).length;

    const mapsWithPaths = maps.filter(map =>
      paths.some(path => path.map_id === map._id)
    ).length;

    const mapsWithCollaborators = new Set(mapUsers.map(mu => mu.map_id)).size;

    // User engagement patterns
    const userActivity = users.map(user => {
      const userMaps = maps.filter(m => m.user_id === user._id);
      const userMarkers = markers.filter(m => userMaps.some(map => map._id === m.map_id));
      const userCollaborations = mapUsers.filter(mu => mu.user_id === user._id);

      return {
        userId: user._id,
        mapsCreated: userMaps.length,
        markersCreated: userMarkers.length,
        collaborations: userCollaborations.length,
        totalActivity: userMaps.length + userMarkers.length + userCollaborations.length,
        lastActive: Math.max(
          userMaps.length > 0 ? Math.max(...userMaps.map(m => m._creationTime)) : 0,
          userMarkers.length > 0 ? Math.max(...userMarkers.map(m => m._creationTime)) : 0
        ),
      };
    });

    // Engagement segmentation
    const activeUsers = userActivity.filter(u => u.lastActive > oneMonthAgo).length;
    const powerUsers = userActivity.filter(u => u.totalActivity >= 10).length;
    const collaborativeUsers = userActivity.filter(u => u.collaborations > 0).length;

    // Content creation trends (hourly patterns)
    const creationByHour = new Array(24).fill(0);
    const allContent = [...maps, ...markers, ...collections, ...paths];
    allContent.forEach(item => {
      const hour = new Date(item._creationTime).getUTCHours();
      creationByHour[hour]++;
    });

    // Weekly activity distribution
    const activityByDay = new Array(7).fill(0);
    allContent.forEach(item => {
      const day = new Date(item._creationTime).getUTCDay();
      activityByDay[day]++;
    });

    // Feature usage statistics
    const featureUsage = {
      markerAdoption: Math.round((mapsWithMarkers / maps.length) * 100) || 0,
      collectionAdoption: Math.round((mapsWithCollections / maps.length) * 100) || 0,
      pathAdoption: Math.round((mapsWithPaths / maps.length) * 100) || 0,
      collaborationAdoption: Math.round((mapsWithCollaborators / maps.length) * 100) || 0,
    };

    // Engagement quality metrics
    const engagementMetrics = {
      activeUserRate: Math.round((activeUsers / users.length) * 100) || 0,
      powerUserRate: Math.round((powerUsers / users.length) * 100) || 0,
      collaborationRate: Math.round((collaborativeUsers / users.length) * 100) || 0,
      averageActivityPerUser: Math.round((userActivity.reduce((sum, u) => sum + u.totalActivity, 0) / users.length) * 100) / 100,
    };

    return {
      // Time-based activity
      activity,

      // Feature adoption
      featureUsage,
      mapsWithContent: {
        withMarkers: mapsWithMarkers,
        withCollections: mapsWithCollections,
        withPaths: mapsWithPaths,
        withCollaborators: mapsWithCollaborators,
      },

      // User engagement
      engagementMetrics,
      userSegmentation: {
        totalUsers: users.length,
        activeUsers,
        powerUsers,
        collaborativeUsers,
      },

      // Temporal patterns
      creationByHour,
      activityByDay,
      peakActivity: {
        hour: creationByHour.indexOf(Math.max(...creationByHour)),
        day: activityByDay.indexOf(Math.max(...activityByDay)),
      },

      // Growth indicators
      isEngagementIncreasing: activity.lastWeek.mapsCreated > activity.lastMonth.mapsCreated / 4,
      contentVelocity: Math.round(((activity.lastWeek.markersCreated + activity.lastWeek.collectionsCreated + activity.lastWeek.pathsCreated) / 7) * 100) / 100,
    };
  },
});

/**
 * Enhanced admin query to get comprehensive global content statistics
 */
export const getGlobalStats = query({
  args: {},
  handler: async (ctx) => {
    // Get all global data
    const places = await ctx.db.query("places").collect();
    const reviews = await ctx.db.query("places_reviews").collect();
    const photos = await ctx.db.query("place_photos").collect();
    const markers = await ctx.db.query("markers").collect();

    const now = Date.now();
    const oneDayAgo = now - (24 * 60 * 60 * 1000);
    const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = now - (30 * 24 * 60 * 60 * 1000);

    // Basic statistics
    const totalPlaces = places.length;
    const totalReviews = reviews.length;
    const totalPhotos = photos.length;

    // Content coverage analysis
    const placesWithReviews = new Set(reviews.map(review => review.place_id)).size;
    const placesWithPhotos = new Set(photos.map(photo => photo.place_id)).size;
    const placesWithBoth = places.filter(place => {
      const hasReview = reviews.some(r => r.place_id === place._id);
      const hasPhoto = photos.some(p => p.place_id === place._id);
      return hasReview && hasPhoto;
    }).length;

    // Content quality metrics
    const reviewQuality = reviews.map(review => ({
      id: review._id,
      rating: review.rating || 0,
      hasText: !!(review.review_text && review.review_text.length > 10),
      length: review.review_text?.length || 0,
    }));

    const photoQuality = photos.map(photo => ({
      id: photo._id,
      hasCaption: !!(photo.caption && photo.caption.length > 0),
      hasMetadata: !!(photo.metadata && Object.keys(photo.metadata).length > 0),
    }));

    // Time-based activity analysis
    const activity = {
      last24h: {
        placesAdded: places.filter(p => p._creationTime > oneDayAgo).length,
        reviewsAdded: reviews.filter(r => r._creationTime > oneDayAgo).length,
        photosAdded: photos.filter(p => p._creationTime > oneDayAgo).length,
      },
      lastWeek: {
        placesAdded: places.filter(p => p._creationTime > oneWeekAgo).length,
        reviewsAdded: reviews.filter(r => r._creationTime > oneWeekAgo).length,
        photosAdded: photos.filter(p => p._creationTime > oneWeekAgo).length,
      },
      lastMonth: {
        placesAdded: places.filter(p => p._creationTime > oneMonthAgo).length,
        reviewsAdded: reviews.filter(r => r._creationTime > oneMonthAgo).length,
        photosAdded: photos.filter(p => p._creationTime > oneMonthAgo).length,
      },
    };

    // Place popularity and usage analysis
    const placeUsage = places.map(place => {
      const placeReviews = reviews.filter(r => r.place_id === place._id);
      const placePhotos = photos.filter(p => p.place_id === place._id);
      const placeMarkers = markers.filter(m => m.place_id === place._id);

      return {
        placeId: place._id,
        reviewCount: placeReviews.length,
        photoCount: placePhotos.length,
        markerCount: placeMarkers.length,
        averageRating: placeReviews.length > 0
          ? placeReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / placeReviews.length
          : 0,
        totalEngagement: placeReviews.length + placePhotos.length + placeMarkers.length,
        lastActivity: Math.max(
          placeReviews.length > 0 ? Math.max(...placeReviews.map(r => r._creationTime)) : 0,
          placePhotos.length > 0 ? Math.max(...placePhotos.map(p => p._creationTime)) : 0,
          placeMarkers.length > 0 ? Math.max(...placeMarkers.map(m => m._creationTime)) : 0
        ),
      };
    });

    // Content distribution by category/type
    const placeCategories = places.reduce((acc, place) => {
      const category = place.category || 'uncategorized';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Top performing places
    const topPlaces = placeUsage
      .sort((a, b) => b.totalEngagement - a.totalEngagement)
      .slice(0, 10);

    // Quality metrics
    const qualityMetrics = {
      reviewsWithText: reviewQuality.filter(r => r.hasText).length,
      reviewsWithRating: reviewQuality.filter(r => r.rating > 0).length,
      photosWithCaptions: photoQuality.filter(p => p.hasCaption).length,
      averageReviewLength: reviewQuality.reduce((sum, r) => sum + r.length, 0) / reviewQuality.length || 0,
      averageRating: reviewQuality.reduce((sum, r) => sum + r.rating, 0) / reviewQuality.length || 0,
    };

    // Geographic and content trends
    const contentTrends = [];
    for (let i = 29; i >= 0; i--) {
      const dayStart = now - (i * 24 * 60 * 60 * 1000);
      const dayEnd = dayStart + (24 * 60 * 60 * 1000);

      const dayPlaces = places.filter(p => p._creationTime >= dayStart && p._creationTime < dayEnd);
      const dayReviews = reviews.filter(r => r._creationTime >= dayStart && r._creationTime < dayEnd);
      const dayPhotos = photos.filter(p => p._creationTime >= dayStart && p._creationTime < dayEnd);

      contentTrends.push({
        date: new Date(dayStart).toISOString().split('T')[0],
        places: dayPlaces.length,
        reviews: dayReviews.length,
        photos: dayPhotos.length,
        totalContent: dayPlaces.length + dayReviews.length + dayPhotos.length,
      });
    }

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
        reviewCoverageRate: Math.round((placesWithReviews / totalPlaces) * 100) || 0,
        photoCoverageRate: Math.round((placesWithPhotos / totalPlaces) * 100) || 0,
        completeCoverageRate: Math.round((placesWithBoth / totalPlaces) * 100) || 0,
      },

      // Activity metrics
      activity,

      // Quality metrics
      quality: {
        ...qualityMetrics,
        averageReviewsPerPlace: Math.round((totalReviews / totalPlaces) * 100) / 100 || 0,
        averagePhotosPerPlace: Math.round((totalPhotos / totalPlaces) * 100) / 100 || 0,
        reviewQualityScore: Math.round((qualityMetrics.reviewsWithText / totalReviews) * 100) || 0,
        photoQualityScore: Math.round((qualityMetrics.photosWithCaptions / totalPhotos) * 100) || 0,
      },

      // Distribution and popularity
      placeCategories,
      topPlaces,

      // Trends
      contentTrends,

      // Growth indicators
      contentGrowthRate: Math.round((activity.lastMonth.placesAdded / Math.max(totalPlaces - activity.lastMonth.placesAdded, 1)) * 100 * 100) / 100,
      isContentGrowthAccelerating: activity.lastWeek.placesAdded > activity.lastMonth.placesAdded / 4,
      contentVelocity: Math.round(((activity.lastWeek.reviewsAdded + activity.lastWeek.photosAdded) / 7) * 100) / 100,
    };
  },
});

/**
 * Admin query to get a comprehensive dashboard overview
 */
export const getDashboardOverview = query({
  args: {},
  handler: async (ctx) => {
    // Get basic counts directly
    const users = await ctx.db.query("users").collect();
    const maps = await ctx.db.query("maps").collect();
    const places = await ctx.db.query("places").collect();
    const markers = await ctx.db.query("markers").collect();

    // Calculate time periods
    const now = Date.now();
    const oneMonthAgo = now - (30 * 24 * 60 * 60 * 1000);
    const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000);
    const oneDayAgo = now - (24 * 60 * 60 * 1000);

    // Calculate metrics
    const recentUsers = users.filter(user => user._creationTime > oneMonthAgo).length;
    const recentMaps = maps.filter(map => map._creationTime > oneMonthAgo).length;
    const recentPlaces = places.filter(place => place._creationTime > oneMonthAgo).length;

    const mapsLast24h = maps.filter(map => map._creationTime > oneDayAgo).length;
    const markersLast24h = markers.filter(marker => marker._creationTime > oneDayAgo).length;
    const mapsLastWeek = maps.filter(map => map._creationTime > oneWeekAgo).length;
    const markersLastWeek = markers.filter(marker => marker._creationTime > oneWeekAgo).length;

    return {
      summary: {
        totalUsers: users.length,
        totalMaps: maps.length,
        totalPlaces: places.length,
        systemHealth: "healthy",
      },
      growth: {
        usersThisMonth: recentUsers,
        mapsThisMonth: recentMaps,
        placesThisMonth: recentPlaces,
      },
      engagement: {
        collaborationRate: 1.2, // Placeholder
        markerAdoptionRate: (markers.length / maps.length) * 100 || 0,
        contentQualityScore: 85, // Placeholder
      },
      recentActivity: {
        last24h: {
          mapsCreated: mapsLast24h,
          markersCreated: markersLast24h,
        },
        lastWeek: {
          mapsCreated: mapsLastWeek,
          markersCreated: markersLastWeek,
        },
      },
    };
  },
});