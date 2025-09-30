import { v } from "convex/values";
import type { Id as ConvexId } from "../convex/_generated/dataModel";

// ============================================================================
// ADVANCED TYPESCRIPT UTILITY TYPES
// ============================================================================

/**
 * Enhanced ID type with better type safety using Convex's generated types
 */
export type Id<T extends string> = ConvexId<T>;

/**
 * Template literal type for time periods with strict validation
 */
export type TimePeriodLiteral = "last24h" | "lastWeek" | "lastMonth" | "last3Months";

/**
 * Conditional type for extracting database table names
 */
export type ExtractTableName<T> = T extends Id<infer U> ? U : never;

/**
 * Utility type for making specific properties readonly
 */
export type ReadonlyFields<T, K extends keyof T> = Omit<T, K> & Readonly<Pick<T, K>>;

/**
 * Deep readonly utility type for nested objects
 */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

/**
 * Branded type for type-safe numeric values
 */
export type Brand<T, B> = T & { readonly __brand: B };

/**
 * Type-safe percentage (0-100)
 */
export type Percentage = Brand<number, "Percentage">;

/**
 * Type-safe complexity score
 */
export type ComplexityScore = Brand<number, "ComplexityScore">;

/**
 * Type-safe growth rate
 */
export type GrowthRate = Brand<number, "GrowthRate">;

/**
 * Union type for map visibility with literal types
 */
export type MapVisibility = "public" | "private" | "unlisted";

/**
 * Permission levels with hierarchical structure
 */
export type Permission = "owner" | "editor" | "viewer";

/**
 * System health status with literal types
 */
export type SystemHealth = "healthy" | "warning" | "critical";

/**
 * Map status with lifecycle states
 */
export type MapStatus = "active" | "inactive" | "archived";

/**
 * Content item types for discriminated unions
 */
export type ContentItemType = "marker" | "collection" | "path" | "label";

/**
 * Generic aggregation function with proper typing
 */
export type AggregationFn<T, R> = (items: ReadonlyArray<T>) => R;

/**
 * Type-safe error codes
 */
export type AdminErrorCode =
  | "VALIDATION_ERROR"
  | "DATABASE_ERROR"
  | "PERMISSION_DENIED"
  | "NOT_FOUND"
  | "RATE_LIMIT_EXCEEDED"
  | "INTERNAL_ERROR";

// ============================================================================
// TIME PERIOD TYPES WITH ENHANCED TYPE SAFETY
// ============================================================================

/**
 * Comprehensive time periods with computed timestamps
 */
export interface TimePeriods {
  readonly now: number;
  readonly oneDayAgo: number;
  readonly oneWeekAgo: number;
  readonly oneMonthAgo: number;
  readonly threeMonthsAgo: number;
  readonly oneYearAgo: number;
}

/**
 * Generic time range specification
 */
export interface TimeRange {
  readonly start: number;
  readonly end: number;
  readonly label: string;
}

/**
 * Time period constants for consistent calculations
 */
export const TIME_PERIODS = {
  ONE_DAY: 24 * 60 * 60 * 1000,
  ONE_WEEK: 7 * 24 * 60 * 60 * 1000,
  ONE_MONTH: 30 * 24 * 60 * 60 * 1000,
  THREE_MONTHS: 90 * 24 * 60 * 60 * 1000,
  ONE_YEAR: 365 * 24 * 60 * 60 * 1000,
} as const;

/**
 * Type for time period values
 */
export type TimePeriodValue = typeof TIME_PERIODS[keyof typeof TIME_PERIODS];

/**
 * Generic activity period with typed content creation metrics
 */
export interface ActivityPeriod {
  readonly mapsCreated: number;
  readonly markersCreated: number;
  readonly collectionsCreated: number;
  readonly pathsCreated: number;
}

/**
 * Enhanced activity period with additional metrics
 */
export interface ExtendedActivityPeriod extends ActivityPeriod {
  readonly labelsCreated: number;
  readonly collaborationsAdded: number;
  readonly totalActivity: number;
}

/**
 * Time-based activity with generic typing
 */
export interface TimeBasedActivity<T = ActivityPeriod> {
  readonly last24h: T;
  readonly lastWeek: T;
  readonly lastMonth: T;
  readonly last3Months?: T;
}

// ============================================================================
// ENHANCED ANALYTICS BASE TYPES WITH GENERICS
// ============================================================================

/**
 * Generic base analytics interface with configurable metrics
 */
export interface BaseAnalytics<T = number> {
  readonly totalCount: number;
  readonly recentActivity: TimeBasedActivity<T>;
  readonly growthRate?: GrowthRate;
  readonly trendDirection?: "up" | "down" | "stable";
}

/**
 * Analytics result with metadata
 */
export interface AnalyticsResult<T> {
  readonly data: T;
  readonly metadata: {
    readonly generatedAt: number;
    readonly dataQuality: "high" | "medium" | "low";
    readonly samplingRate?: number;
  };
}

/**
 * Paginated analytics result
 */
export interface PaginatedAnalytics<T> {
  readonly items: ReadonlyArray<T>;
  readonly totalCount: number;
  readonly hasMore: boolean;
  readonly cursor?: string;
}

/**
 * Enhanced trend data with additional metrics
 */
export interface TrendData {
  readonly date: string;
  readonly count: number;
  readonly change?: number;
  readonly percentChange?: Percentage;
}

/**
 * Comparative trend data for A/B analysis
 */
export interface ComparativeTrendData extends TrendData {
  readonly baseline: number;
  readonly variance: number;
  readonly confidence: Percentage;
}

/**
 * Enhanced weekly trend data
 */
export interface WeeklyTrendData extends TrendData {
  readonly week: string;
  readonly startDate: string;
  readonly endDate: string;
  readonly weekOfYear: number;
}

/**
 * Enhanced registration trend data with temporal patterns
 */
export interface RegistrationTrendData extends TrendData {
  readonly dayOfWeek: number;
  readonly weekNumber: number;
  readonly hourOfDay?: number;
  readonly seasonality?: "high" | "medium" | "low";
}

// ========== USER ANALYTICS TYPES ==========
export interface UserStatistics extends BaseAnalytics {
  readonly totalUsers: number;
  readonly usersLast24h: number;
  readonly usersLastWeek: number;
  readonly usersLastMonth: number;
  readonly usersLast3Months: number;
  readonly dailyGrowthRate: number;
  readonly weeklyGrowthRate: number;
  readonly monthlyGrowthRate: number;
  readonly averageUsersPerDay: number;
  readonly registrationTrends: readonly RegistrationTrendData[];
  readonly weeklyTrends: readonly WeeklyTrendData[];
  readonly usersByHour: readonly number[];
  readonly usersByDayOfWeek: readonly number[];
  readonly retentionRate: number;
  readonly peakRegistrationHour: number;
  readonly peakRegistrationDay: number;
  readonly isGrowthAccelerating: boolean;
}

/**
 * Base user profile with essential information
 */
export interface BaseUserProfile {
  readonly id: Id<"users">;
  readonly name: string;
  readonly email: string;
}

/**
 * Extended user profile with additional details
 */
export interface UserProfile extends BaseUserProfile {
  readonly firstName?: string;
  readonly lastName?: string;
  readonly imageUrl?: string;
  readonly username?: string;
}

/**
 * User profile with computed display properties
 */
export interface EnhancedUserProfile extends UserProfile {
  readonly displayName: string;
  readonly initials: string;
  readonly avatarUrl: string;
}

export interface AdminUser extends UserProfile {
  readonly firstName: string;
  readonly lastName: string;
  readonly imageUrl: string;
  readonly createdAt: number;
  readonly lastSignInAt: number | null;
  readonly role: string | null;
  readonly banned: boolean;
  readonly mapsCreated: number;
  readonly collaborations: number;
  readonly totalActivity: number;
}

// ========== MAP ANALYTICS TYPES ==========
export interface MapComplexityData {
  readonly mapId: Id<"maps">;
  readonly markerCount: number;
  readonly collectionCount: number;
  readonly pathCount: number;
  readonly collaboratorCount: number;
  readonly totalElements: number;
  readonly complexity: number;
  readonly visibility: "public" | "private" | "unlisted";
  readonly createdAt: number;
}

export interface ComplexityStats {
  readonly simple: number;
  readonly moderate: number;
  readonly complex: number;
  readonly veryComplex: number;
}

export interface ContentStats {
  readonly totalMarkers: number;
  readonly totalCollections: number;
  readonly totalPaths: number;
  readonly averageMarkersPerMap: number;
  readonly averageCollectionsPerMap: number;
  readonly averagePathsPerMap: number;
}

export interface EngagementStats {
  readonly mapsWithContent: number;
  readonly mapsWithCollaborators: number;
  readonly contentAdoptionRate: number;
  readonly collaborationRate: number;
}

export interface MapCreationTrendData extends TrendData {
  readonly publicCount: number;
  readonly privateCount: number;
}

export interface MapStatistics extends BaseAnalytics {
  readonly totalMaps: number;
  readonly publicMaps: number;
  readonly privateMaps: number;
  readonly sharedMaps: number;
  readonly mapsLast24h: number;
  readonly mapsLastWeek: number;
  readonly mapsLastMonth: number;
  readonly complexityStats: ComplexityStats;
  readonly averageComplexity: number;
  readonly mostActiveMaps: readonly MapComplexityData[];
  readonly totalCollaborations: number;
  readonly mapsWithMultipleUsers: number;
  readonly averageCollaboratorsPerMap: number;
  readonly contentStats: ContentStats;
  readonly engagementStats: EngagementStats;
  readonly creationTrends: readonly MapCreationTrendData[];
  readonly isMapCreationIncreasing: boolean;
  readonly mapGrowthRate: number;
}

// ========== ACTIVITY ANALYTICS TYPES ==========
export interface FeatureUsage {
  readonly markerAdoption: number;
  readonly collectionAdoption: number;
  readonly pathAdoption: number;
  readonly collaborationAdoption: number;
}

export interface MapsWithContent {
  readonly withMarkers: number;
  readonly withCollections: number;
  readonly withPaths: number;
  readonly withCollaborators: number;
}

export interface UserSegmentation {
  readonly totalUsers: number;
  readonly activeUsers: number;
  readonly powerUsers: number;
  readonly collaborativeUsers: number;
}

export interface PeakActivity {
  readonly hour: number;
  readonly day: number;
}

export interface ActivityMetrics {
  readonly activity: {
    readonly last24h: ActivityPeriod;
    readonly lastWeek: ActivityPeriod;
    readonly lastMonth: ActivityPeriod;
  };
  readonly featureUsage: FeatureUsage;
  readonly mapsWithContent: MapsWithContent;
  readonly engagementMetrics: {
    readonly activeUserRate: number;
    readonly powerUserRate: number;
    readonly collaborationRate: number;
    readonly averageActivityPerUser: number;
  };
  readonly userSegmentation: UserSegmentation;
  readonly creationByHour: readonly number[];
  readonly activityByDay: readonly number[];
  readonly peakActivity: PeakActivity;
  readonly isEngagementIncreasing: boolean;
  readonly contentVelocity: number;
}

// ========== GLOBAL CONTENT TYPES ==========
export interface ContentCoverage {
  readonly placesWithReviews: number;
  readonly placesWithPhotos: number;
  readonly placesWithBoth: number;
  readonly reviewCoverageRate: number;
  readonly photoCoverageRate: number;
  readonly completeCoverageRate: number;
}

export interface ContentActivity {
  readonly last24h: {
    readonly placesAdded: number;
    readonly reviewsAdded: number;
    readonly photosAdded: number;
  };
  readonly lastWeek: {
    readonly placesAdded: number;
    readonly reviewsAdded: number;
    readonly photosAdded: number;
  };
  readonly lastMonth: {
    readonly placesAdded: number;
    readonly reviewsAdded: number;
    readonly photosAdded: number;
  };
}

export interface PlaceUsageData {
  readonly placeId: Id<"places">;
  readonly reviewCount: number;
  readonly photoCount: number;
  readonly markerCount: number;
  readonly averageRating: number;
  readonly totalEngagement: number;
  readonly lastActivity: number;
}

export interface ContentQuality {
  readonly reviewsWithText: number;
  readonly reviewsWithRating: number;
  readonly photosWithCaptions: number;
  readonly averageReviewLength: number;
  readonly averageRating: number;
  readonly averageReviewsPerPlace: number;
  readonly averagePhotosPerPlace: number;
  readonly reviewQualityScore: number;
  readonly photoQualityScore: number;
}

export interface ContentTrendData {
  readonly date: string;
  readonly places: number;
  readonly reviews: number;
  readonly photos: number;
  readonly totalContent: number;
}

export interface GlobalStatistics {
  readonly totalPlaces: number;
  readonly totalReviews: number;
  readonly totalPhotos: number;
  readonly contentCoverage: ContentCoverage;
  readonly activity: ContentActivity;
  readonly quality: ContentQuality;
  readonly placeCategories: Record<string, number>;
  readonly topPlaces: readonly PlaceUsageData[];
  readonly contentTrends: readonly ContentTrendData[];
  readonly contentGrowthRate: number;
  readonly isContentGrowthAccelerating: boolean;
  readonly contentVelocity: number;
}

// ========== DASHBOARD OVERVIEW TYPES ==========
export interface DashboardSummary {
  readonly totalUsers: number;
  readonly totalMaps: number;
  readonly totalPlaces: number;
  readonly systemHealth: "healthy" | "warning" | "critical";
}

export interface DashboardGrowth {
  readonly usersThisMonth: number;
  readonly mapsThisMonth: number;
  readonly placesThisMonth: number;
}

export interface DashboardEngagement {
  readonly collaborationRate: number;
  readonly markerAdoptionRate: number;
  readonly contentQualityScore: number;
}

export interface DashboardActivity {
  readonly last24h: {
    readonly mapsCreated: number;
    readonly markersCreated: number;
  };
  readonly lastWeek: {
    readonly mapsCreated: number;
    readonly markersCreated: number;
  };
}

export interface DashboardOverview {
  readonly summary: DashboardSummary;
  readonly growth: DashboardGrowth;
  readonly engagement: DashboardEngagement;
  readonly recentActivity: DashboardActivity;
}

// ========== MAP ITEMS ANALYTICS TYPES ==========
export interface MapItemData {
  readonly mapId: Id<"maps">;
  readonly title: string;
  readonly creator: UserProfile;
  readonly visibility: "public" | "private" | "unlisted";
  readonly createdAt: number;
  readonly markerCount: number;
  readonly collectionCount: number;
  readonly pathCount: number;
  readonly labelCount: number;
  readonly totalItems: number;
  readonly collaboratorCount: number;
  readonly collaborators: readonly {
    readonly user: UserProfile;
    readonly permission: string;
    readonly joinedAt: number;
  }[];
  readonly recentActivity: {
    readonly last24h: number;
    readonly lastWeek: number;
    readonly lastMonth: number;
  };
  readonly itemTimeline: readonly {
    readonly type: "marker" | "collection" | "path" | "label";
    readonly createdAt: number;
    readonly id: string;
  }[];
  readonly complexity: number;
  readonly isActive: boolean;
  readonly lastActivity: number;
}

export interface GlobalItemStats {
  readonly totalMaps: number;
  readonly totalMarkers: number;
  readonly totalCollections: number;
  readonly totalPaths: number;
  readonly totalLabels: number;
  readonly totalItems: number;
  readonly totalCollaborations: number;
}

export interface DailyActivityTrend {
  readonly date: string;
  readonly markers: number;
  readonly collections: number;
  readonly paths: number;
  readonly labels: number;
  readonly totalItems: number;
}

export interface UserActivityData {
  readonly user: UserProfile;
  readonly mapsCreated: number;
  readonly itemsCreated: number;
  readonly collaborations: number;
  readonly itemBreakdown: {
    readonly markers: number;
    readonly collections: number;
    readonly paths: number;
    readonly labels: number;
  };
}

export interface CollaborationInsights {
  readonly mapsWithCollaborators: number;
  readonly averageCollaboratorsPerMap: number;
  readonly mostCollaborativeMap: {
    readonly collaboratorCount: number;
  };
  readonly totalUniqueCollaborators: number;
}

export interface MapItemsAnalytics {
  readonly globalStats: GlobalItemStats;
  readonly mapItemsData: readonly MapItemData[];
  readonly dailyActivityTrends: readonly DailyActivityTrend[];
  readonly userActivityStats: readonly UserActivityData[];
  readonly mostActiveMaps: readonly MapItemData[];
  readonly collaborationInsights: CollaborationInsights;
  readonly insights: {
    readonly totalActiveUsers: number;
    readonly averageItemsPerMap: number;
    readonly activeMapsLast7Days: number;
    readonly complexityDistribution: {
      readonly simple: number;
      readonly moderate: number;
      readonly complex: number;
    };
  };
}

// ========== DETAILED MAP TYPES ==========
export interface DetailedMapData {
  readonly id: Id<"maps">;
  readonly title: string;
  readonly creator: UserProfile;
  readonly markerCount: number;
  readonly collaboratorCount: number;
  readonly isPublic: boolean;
  readonly visibility: "public" | "private" | "unlisted";
  readonly createdAt: number;
  readonly lastModified: number;
  readonly status: "active" | "inactive" | "archived";
  readonly description: string;
}

export interface MapOwner {
  readonly id: Id<"users">;
  readonly name: string;
  readonly email: string;
  readonly imageUrl: string;
}

export interface MapCollaborator extends MapOwner {
  readonly permission: string;
  readonly addedAt: number;
}

export interface MapStats {
  readonly totalMarkers: number;
  readonly totalCollections: number;
  readonly totalPaths: number;
  readonly totalCollaborators: number;
  readonly totalElements: number;
}

export interface MapContentItem {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly createdAt: number;
}

export interface MapMarkerContent extends MapContentItem {
  readonly lat: number;
  readonly lng: number;
}

export interface MapContent {
  readonly markers: readonly MapMarkerContent[];
  readonly collections: readonly MapContentItem[];
  readonly paths: readonly MapContentItem[];
}

export interface DetailedMap {
  readonly id: Id<"maps">;
  readonly title: string;
  readonly description: string;
  readonly visibility: "public" | "private" | "unlisted";
  readonly createdAt: number;
  readonly updatedAt: number;
  readonly owner: MapOwner | null;
  readonly collaborators: readonly MapCollaborator[];
  readonly stats: MapStats;
  readonly content: MapContent;
}

export interface UserMapData {
  readonly id: Id<"maps">;
  readonly title: string;
  readonly description: string;
  readonly visibility: "public" | "private" | "unlisted";
  readonly createdAt: number;
  readonly isOwner: boolean;
  readonly permission?: string;
  readonly owner?: UserProfile;
}

export interface DetailedUserData extends AdminUser {
  readonly name: string;
  readonly ownedMaps: readonly UserMapData[];
  readonly sharedMaps: readonly UserMapData[];
}

// ========== CONVEX RETURN TYPE VALIDATORS ==========
export const userStatisticsValidator = v.object({
  totalUsers: v.number(),
  usersLast24h: v.number(),
  usersLastWeek: v.number(),
  usersLastMonth: v.number(),
  usersLast3Months: v.number(),
  dailyGrowthRate: v.number(),
  weeklyGrowthRate: v.number(),
  monthlyGrowthRate: v.number(),
  averageUsersPerDay: v.number(),
  registrationTrends: v.array(v.object({
    date: v.string(),
    count: v.number(),
    dayOfWeek: v.number(),
    weekNumber: v.number(),
  })),
  weeklyTrends: v.array(v.object({
    week: v.string(),
    count: v.number(),
    startDate: v.string(),
  })),
  usersByHour: v.array(v.number()),
  usersByDayOfWeek: v.array(v.number()),
  retentionRate: v.number(),
  peakRegistrationHour: v.number(),
  peakRegistrationDay: v.number(),
  isGrowthAccelerating: v.boolean(),
});

export const mapStatisticsValidator = v.object({
  totalMaps: v.number(),
  publicMaps: v.number(),
  privateMaps: v.number(),
  sharedMaps: v.number(),
  mapsLast24h: v.number(),
  mapsLastWeek: v.number(),
  mapsLastMonth: v.number(),
  complexityStats: v.object({
    simple: v.number(),
    moderate: v.number(),
    complex: v.number(),
    veryComplex: v.number(),
  }),
  averageComplexity: v.number(),
  mostActiveMaps: v.array(v.object({
    mapId: v.id("maps"),
    markerCount: v.number(),
    collectionCount: v.number(),
    pathCount: v.number(),
    collaboratorCount: v.number(),
    totalElements: v.number(),
    complexity: v.number(),
    visibility: v.union(v.literal("public"), v.literal("private"), v.literal("unlisted")),
    createdAt: v.number(),
  })),
  totalCollaborations: v.number(),
  mapsWithMultipleUsers: v.number(),
  averageCollaboratorsPerMap: v.number(),
  contentStats: v.object({
    totalMarkers: v.number(),
    totalCollections: v.number(),
    totalPaths: v.number(),
    averageMarkersPerMap: v.number(),
    averageCollectionsPerMap: v.number(),
    averagePathsPerMap: v.number(),
  }),
  engagementStats: v.object({
    mapsWithContent: v.number(),
    mapsWithCollaborators: v.number(),
    contentAdoptionRate: v.number(),
    collaborationRate: v.number(),
  }),
  creationTrends: v.array(v.object({
    date: v.string(),
    count: v.number(),
    publicCount: v.number(),
    privateCount: v.number(),
  })),
  isMapCreationIncreasing: v.boolean(),
  mapGrowthRate: v.number(),
});

export const dashboardOverviewValidator = v.object({
  summary: v.object({
    totalUsers: v.number(),
    totalMaps: v.number(),
    totalPlaces: v.number(),
    systemHealth: v.union(
      v.literal("healthy"),
      v.literal("warning"),
      v.literal("critical")
    ),
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

export const adminUsersValidator = v.array(v.object({
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
}));

// ========== HELPER TYPES FOR GENERIC ANALYTICS ==========
export type AnalyticsTimeFilter<T> = (item: T) => boolean;

export interface AnalyticsConfig<T> {
  readonly timeFilter: AnalyticsTimeFilter<T>;
  readonly complexityCalculator?: (item: T) => number;
  readonly activityCalculator?: (item: T) => number;
}

export type TimePeriodKey = 'last24h' | 'lastWeek' | 'lastMonth' | 'last3Months';

export type TimeSeriesData<T = number> = {
  readonly [K in TimePeriodKey]: T;
};

// ============================================================================
// ENHANCED ERROR HANDLING WITH DISCRIMINATED UNIONS
// ============================================================================

/**
 * Comprehensive admin error with metadata
 */
export interface AdminError {
  readonly code: AdminErrorCode;
  readonly message: string;
  readonly details?: Record<string, unknown>;
  readonly timestamp: number;
  readonly context?: {
    readonly functionName: string;
    readonly userId?: Id<"users">;
    readonly requestId?: string;
  };
}

/**
 * Result type with discriminated union for better type safety
 */
export type AdminResult<T, E = AdminError> =
  | { readonly success: true; readonly data: T; readonly error?: never }
  | { readonly success: false; readonly error: E; readonly data?: never };

/**
 * Async result type for promise-based operations
 */
export type AsyncAdminResult<T, E = AdminError> = Promise<AdminResult<T, E>>;

/**
 * Validation result with detailed error information
 */
export type ValidationResult<T> = AdminResult<T, {
  readonly code: "VALIDATION_ERROR";
  readonly message: string;
  readonly fieldErrors: Record<string, string[]>;
  readonly timestamp: number;
}>;

/**
 * Type guard for checking success results
 */
export const isSuccess = <T, E>(result: AdminResult<T, E>): result is { success: true; data: T } => {
  return result.success === true;
};

/**
 * Type guard for checking error results
 */
export const isError = <T, E>(result: AdminResult<T, E>): result is { success: false; error: E } => {
  return result.success === false;
};

// ============================================================================
// UTILITY FUNCTIONS FOR TYPE SAFETY
// ============================================================================

/**
 * Create a type-safe percentage value
 */
export const createPercentage = (value: number): Percentage => {
  if (value < 0 || value > 100) {
    throw new Error(`Invalid percentage value: ${value}. Must be between 0 and 100.`);
  }
  return value as Percentage;
};

/**
 * Create a type-safe complexity score
 */
export const createComplexityScore = (value: number): ComplexityScore => {
  if (value < 0) {
    throw new Error(`Invalid complexity score: ${value}. Must be non-negative.`);
  }
  return value as ComplexityScore;
};

/**
 * Create a type-safe growth rate
 */
export const createGrowthRate = (value: number): GrowthRate => {
  return value as GrowthRate;
};

/**
 * Type guard for checking valid map visibility
 */
export const isValidMapVisibility = (value: string): value is MapVisibility => {
  return ["public", "private", "unlisted"].includes(value);
};

/**
 * Type guard for checking valid permission
 */
export const isValidPermission = (value: string): value is Permission => {
  return ["owner", "editor", "viewer"].includes(value);
};

/**
 * Type guard for checking valid system health status
 */
export const isValidSystemHealth = (value: string): value is SystemHealth => {
  return ["healthy", "warning", "critical"].includes(value);
};

/**
 * Helper function to create time range
 */
export const createTimeRange = (start: number, end: number, label: string): TimeRange => {
  if (start >= end) {
    throw new Error("Start time must be before end time");
  }
  return { start, end, label };
};