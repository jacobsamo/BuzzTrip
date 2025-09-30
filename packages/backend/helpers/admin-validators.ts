import { v } from "convex/values";

// Base activity summary shape
export const activitySummaryValidator = v.object({
  last24h: v.number(),
  lastWeek: v.number(),
  lastMonth: v.number(),
  last3Months: v.optional(v.number()),
});

// Trend data validators
export const dailyTrendValidator = v.object({
  date: v.string(),
  count: v.number(),
  dayOfWeek: v.number(),
  weekNumber: v.number(),
});

export const weeklyTrendValidator = v.object({
  week: v.string(),
  count: v.number(),
  startDate: v.string(),
});

// Activity patterns validator
export const activityPatternsValidator = v.object({
  byHour: v.array(v.number()),
  byDayOfWeek: v.array(v.number()),
  peakHour: v.number(),
  peakDay: v.number(),
});

// User stats return validator
export const userStatsValidator = v.object({
  // Core metrics
  totalUsers: v.number(),
  usersLast24h: v.number(),
  usersLastWeek: v.number(),
  usersLastMonth: v.number(),
  usersLast3Months: v.number(),

  // Growth metrics
  dailyGrowthRate: v.number(),
  weeklyGrowthRate: v.number(),
  monthlyGrowthRate: v.number(),
  averageUsersPerDay: v.number(),

  // Trends
  registrationTrends: v.array(dailyTrendValidator),
  weeklyTrends: v.array(weeklyTrendValidator),

  // Engagement patterns
  usersByHour: v.array(v.number()),
  usersByDayOfWeek: v.array(v.number()),
  retentionRate: v.number(),

  // Derived insights
  peakRegistrationHour: v.number(),
  peakRegistrationDay: v.number(),
  isGrowthAccelerating: v.boolean(),
});

// Map complexity stats validator
export const complexityStatsValidator = v.object({
  simple: v.number(),
  moderate: v.number(),
  complex: v.number(),
  veryComplex: v.number(),
});

// Map stats return validator
export const mapStatsValidator = v.object({
  // Core metrics
  totalMaps: v.number(),
  publicMaps: v.number(),
  privateMaps: v.number(),
  sharedMaps: v.number(),
  mapsLast24h: v.number(),
  mapsLastWeek: v.number(),
  mapsLastMonth: v.number(),

  // Complexity analysis
  complexityStats: complexityStatsValidator,
  averageComplexity: v.number(),
  mostActiveMaps: v.array(v.object({
    mapId: v.id("maps"),
    markerCount: v.number(),
    collectionCount: v.number(),
    pathCount: v.number(),
    collaboratorCount: v.number(),
    totalElements: v.number(),
    complexity: v.number(),
    visibility: v.string(),
    createdAt: v.number(),
  })),

  // Collaboration
  totalCollaborations: v.number(),
  mapsWithMultipleUsers: v.number(),
  averageCollaboratorsPerMap: v.number(),

  // Content distribution
  contentStats: v.object({
    totalMarkers: v.number(),
    totalCollections: v.number(),
    totalPaths: v.number(),
    averageMarkersPerMap: v.number(),
    averageCollectionsPerMap: v.number(),
    averagePathsPerMap: v.number(),
  }),

  // Engagement
  engagementStats: v.object({
    mapsWithContent: v.number(),
    mapsWithCollaborators: v.number(),
    contentAdoptionRate: v.number(),
    collaborationRate: v.number(),
  }),

  // Trends
  creationTrends: v.array(v.object({
    date: v.string(),
    count: v.number(),
    publicCount: v.number(),
    privateCount: v.number(),
  })),

  // Growth indicators
  isMapCreationIncreasing: v.boolean(),
  mapGrowthRate: v.number(),
});

// Activity metrics return validator
export const activityMetricsValidator = v.object({
  // Time-based activity
  activity: v.object({
    last24h: v.object({
      mapsCreated: v.number(),
      markersCreated: v.number(),
      collectionsCreated: v.number(),
      pathsCreated: v.number(),
    }),
    lastWeek: v.object({
      mapsCreated: v.number(),
      markersCreated: v.number(),
      collectionsCreated: v.number(),
      pathsCreated: v.number(),
    }),
    lastMonth: v.object({
      mapsCreated: v.number(),
      markersCreated: v.number(),
      collectionsCreated: v.number(),
      pathsCreated: v.number(),
    }),
  }),

  // Feature adoption
  featureUsage: v.object({
    markerAdoption: v.number(),
    collectionAdoption: v.number(),
    pathAdoption: v.number(),
    collaborationAdoption: v.number(),
  }),

  mapsWithContent: v.object({
    withMarkers: v.number(),
    withCollections: v.number(),
    withPaths: v.number(),
    withCollaborators: v.number(),
  }),

  // User engagement
  engagementMetrics: v.object({
    activeUserRate: v.number(),
    powerUserRate: v.number(),
    collaborationRate: v.number(),
    averageActivityPerUser: v.number(),
  }),

  userSegmentation: v.object({
    totalUsers: v.number(),
    activeUsers: v.number(),
    powerUsers: v.number(),
    collaborativeUsers: v.number(),
  }),

  // Temporal patterns
  creationByHour: v.array(v.number()),
  activityByDay: v.array(v.number()),
  peakActivity: v.object({
    hour: v.number(),
    day: v.number(),
  }),

  // Growth indicators
  isEngagementIncreasing: v.boolean(),
  contentVelocity: v.number(),
});

// Global stats return validator
export const globalStatsValidator = v.object({
  // Core metrics
  totalPlaces: v.number(),
  totalReviews: v.number(),
  totalPhotos: v.number(),

  // Coverage analysis
  contentCoverage: v.object({
    placesWithReviews: v.number(),
    placesWithPhotos: v.number(),
    placesWithBoth: v.number(),
    reviewCoverageRate: v.number(),
    photoCoverageRate: v.number(),
    completeCoverageRate: v.number(),
  }),

  // Activity metrics
  activity: v.object({
    last24h: v.object({
      placesAdded: v.number(),
      reviewsAdded: v.number(),
      photosAdded: v.number(),
    }),
    lastWeek: v.object({
      placesAdded: v.number(),
      reviewsAdded: v.number(),
      photosAdded: v.number(),
    }),
    lastMonth: v.object({
      placesAdded: v.number(),
      reviewsAdded: v.number(),
      photosAdded: v.number(),
    }),
  }),

  // Quality metrics
  quality: v.object({
    reviewsWithText: v.number(),
    reviewsWithRating: v.number(),
    photosWithCaptions: v.number(),
    averageReviewLength: v.number(),
    averageRating: v.number(),
    averageReviewsPerPlace: v.number(),
    averagePhotosPerPlace: v.number(),
    reviewQualityScore: v.number(),
    photoQualityScore: v.number(),
  }),

  // Distribution and popularity
  placeCategories: v.record(v.string(), v.number()),
  topPlaces: v.array(v.object({
    placeId: v.id("places"),
    reviewCount: v.number(),
    photoCount: v.number(),
    markerCount: v.number(),
    averageRating: v.number(),
    totalEngagement: v.number(),
    lastActivity: v.number(),
  })),

  // Trends
  contentTrends: v.array(v.object({
    date: v.string(),
    places: v.number(),
    reviews: v.number(),
    photos: v.number(),
    totalContent: v.number(),
  })),

  // Growth indicators
  contentGrowthRate: v.number(),
  isContentGrowthAccelerating: v.boolean(),
  contentVelocity: v.number(),
});

// Dashboard overview validator
export const dashboardOverviewValidator = v.object({
  summary: v.object({
    totalUsers: v.number(),
    totalMaps: v.number(),
    totalPlaces: v.number(),
    systemHealth: v.string(),
  }),
  growth: v.object({
    usersThisMonth: v.number(),
    mapsThisMonth: v.number(),
    placesThisMonth: v.number(),
  }),
  engagement: v.object({
    collaborationRate: v.number(),
    markerAdoptionRate: v.number(),
    contentQualityScore: v.number(),
  }),
  recentActivity: v.object({
    last24h: v.object({
      mapsCreated: v.number(),
      markersCreated: v.number(),
    }),
    lastWeek: v.object({
      mapsCreated: v.number(),
      markersCreated: v.number(),
    }),
  }),
});

// Admin user validator
export const adminUserValidator = v.object({
  id: v.id("users"),
  email: v.string(),
  firstName: v.string(),
  lastName: v.string(),
  imageUrl: v.string(),
  createdAt: v.number(),
  lastSignInAt: v.union(v.number(), v.null()),
  role: v.union(v.string(), v.null()),
  banned: v.boolean(),
  mapsCreated: v.number(),
  collaborations: v.number(),
  totalActivity: v.number(),
});

// Detailed user validator
export const detailedUserValidator = v.object({
  id: v.id("users"),
  email: v.string(),
  firstName: v.string(),
  lastName: v.string(),
  name: v.string(),
  imageUrl: v.string(),
  createdAt: v.number(),
  lastSignInAt: v.union(v.number(), v.null()),
  role: v.union(v.string(), v.null()),
  banned: v.boolean(),
  mapsCreated: v.number(),
  collaborations: v.number(),
  totalActivity: v.number(),
  ownedMaps: v.array(v.object({
    id: v.id("maps"),
    title: v.string(),
    description: v.string(),
    visibility: v.string(),
    createdAt: v.number(),
    isOwner: v.boolean(),
  })),
  sharedMaps: v.array(v.object({
    id: v.id("maps"),
    title: v.string(),
    description: v.string(),
    visibility: v.string(),
    createdAt: v.number(),
    permission: v.string(),
    owner: v.object({
      name: v.string(),
      email: v.string(),
    }),
    isOwner: v.boolean(),
  })),
});

// Detailed map validator
export const detailedMapValidator = v.object({
  id: v.id("maps"),
  title: v.string(),
  description: v.string(),
  visibility: v.string(),
  createdAt: v.number(),
  updatedAt: v.number(),
  owner: v.union(v.object({
    id: v.id("users"),
    name: v.string(),
    email: v.string(),
    imageUrl: v.string(),
  }), v.null()),
  collaborators: v.array(v.object({
    id: v.id("users"),
    name: v.string(),
    email: v.string(),
    imageUrl: v.string(),
    permission: v.string(),
    addedAt: v.number(),
  })),
  stats: v.object({
    totalMarkers: v.number(),
    totalCollections: v.number(),
    totalPaths: v.number(),
    totalCollaborators: v.number(),
    totalElements: v.number(),
  }),
  content: v.object({
    markers: v.array(v.object({
      id: v.id("markers"),
      title: v.string(),
      description: v.string(),
      lat: v.number(),
      lng: v.number(),
      createdAt: v.number(),
    })),
    collections: v.array(v.object({
      id: v.id("collections"),
      title: v.string(),
      description: v.string(),
      createdAt: v.number(),
    })),
    paths: v.array(v.object({
      id: v.id("paths"),
      title: v.string(),
      description: v.string(),
      createdAt: v.number(),
    })),
  }),
});

// Additional validators for remaining functions
export const detailedMapDataValidator = v.object({
  id: v.id("maps"),
  title: v.string(),
  creator: v.object({
    id: v.id("users"),
    name: v.string(),
    email: v.string(),
  }),
  markerCount: v.number(),
  collaboratorCount: v.number(),
  isPublic: v.boolean(),
  visibility: v.string(),
  createdAt: v.number(),
  lastModified: v.number(),
  status: v.string(),
  description: v.string(),
});

export const mapItemsAnalyticsValidator = v.object({
  globalStats: v.object({
    totalMaps: v.number(),
    totalMarkers: v.number(),
    totalCollections: v.number(),
    totalPaths: v.number(),
    totalLabels: v.number(),
    totalItems: v.number(),
    totalCollaborations: v.number(),
  }),
  mapItemsData: v.array(v.object({
    mapId: v.id("maps"),
    title: v.string(),
    creator: v.object({
      id: v.id("users"),
      name: v.string(),
      email: v.string(),
    }),
    visibility: v.string(),
    createdAt: v.number(),
    markerCount: v.number(),
    collectionCount: v.number(),
    pathCount: v.number(),
    labelCount: v.number(),
    totalItems: v.number(),
    collaboratorCount: v.number(),
    collaborators: v.array(v.object({
      user: userProfileValidator,
      permission: permissionValidator,
      joinedAt: v.number(),
    })),
    recentActivity: activitySummaryValidator,
    itemTimeline: v.array(v.object({
      type: contentItemTypeValidator,
      createdAt: v.number(),
      id: v.string(),
      title: v.optional(v.string()),
    })),
    complexity: v.number(),
    isActive: v.boolean(),
    lastActivity: v.number(),
  })),
  dailyActivityTrends: v.array(v.object({
    date: v.string(),
    markers: v.number(),
    collections: v.number(),
    paths: v.number(),
    labels: v.number(),
    totalItems: v.number(),
  })),
  userActivityStats: v.array(v.object({
    user: v.object({
      id: v.id("users"),
      name: v.string(),
      email: v.string(),
    }),
    mapsCreated: v.number(),
    itemsCreated: v.number(),
    collaborations: v.number(),
    itemBreakdown: v.object({
      markers: v.number(),
      collections: v.number(),
      paths: v.number(),
      labels: v.number(),
    }),
  })),
  mostActiveMaps: v.array(v.object({
    mapId: v.id("maps"),
    title: v.string(),
    creator: v.object({
      id: v.id("users"),
      name: v.string(),
      email: v.string(),
    }),
    visibility: v.string(),
    createdAt: v.number(),
    markerCount: v.number(),
    collectionCount: v.number(),
    pathCount: v.number(),
    labelCount: v.number(),
    totalItems: v.number(),
    collaboratorCount: v.number(),
    collaborators: v.array(v.object({
      user: userProfileValidator,
      permission: permissionValidator,
      joinedAt: v.number(),
    })),
    recentActivity: activitySummaryValidator,
    itemTimeline: v.array(v.object({
      type: contentItemTypeValidator,
      createdAt: v.number(),
      id: v.string(),
      title: v.optional(v.string()),
    })),
    complexity: v.number(),
    isActive: v.boolean(),
    lastActivity: v.number(),
  })),
  collaborationInsights: v.object({
    mapsWithCollaborators: v.number(),
    averageCollaboratorsPerMap: v.number(),
    mostCollaborativeMap: v.object({
      collaboratorCount: v.number(),
    }),
    totalUniqueCollaborators: v.number(),
  }),
  insights: v.object({
    totalActiveUsers: v.number(),
    averageItemsPerMap: v.number(),
    activeMapsLast7Days: v.number(),
    complexityDistribution: v.object({
      simple: v.number(),
      moderate: v.number(),
      complex: v.number(),
    }),
  }),
});