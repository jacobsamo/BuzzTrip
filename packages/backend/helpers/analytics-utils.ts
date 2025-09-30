import type {
  TimePeriods,
  AnalyticsTimeFilter,
  TrendData,
  TimePeriodKey,
  TimeSeriesData
} from "../types/admin-types";

// ========== TIME PERIOD UTILITIES ==========
/**
 * Creates standardized time periods for analytics calculations
 */
export const createTimePeriods = (now: number = Date.now()): TimePeriods => ({
  oneDayAgo: now - (24 * 60 * 60 * 1000),
  oneWeekAgo: now - (7 * 24 * 60 * 60 * 1000),
  oneMonthAgo: now - (30 * 24 * 60 * 60 * 1000),
  threeMonthsAgo: now - (90 * 24 * 60 * 60 * 1000),
  oneYearAgo: now - (365 * 24 * 60 * 60 * 1000),
} as const);

/**
 * Creates time filters for different periods
 */
export const createTimeFilters = (timePeriods: TimePeriods) => ({
  last24h: <T extends { _creationTime: number }>(item: T): boolean =>
    item._creationTime > timePeriods.oneDayAgo,
  lastWeek: <T extends { _creationTime: number }>(item: T): boolean =>
    item._creationTime > timePeriods.oneWeekAgo,
  lastMonth: <T extends { _creationTime: number }>(item: T): boolean =>
    item._creationTime > timePeriods.oneMonthAgo,
  last3Months: <T extends { _creationTime: number }>(item: T): boolean =>
    item._creationTime > timePeriods.threeMonthsAgo,
} as const);

// ========== ANALYTICS CALCULATION UTILITIES ==========
/**
 * Generic function to calculate time-based metrics
 */
export function calculateTimeBasedMetrics<T extends { _creationTime: number }>(
  items: readonly T[],
  timePeriods: TimePeriods
): TimeSeriesData<number> {
  const filters = createTimeFilters(timePeriods);

  return {
    last24h: items.filter(filters.last24h).length,
    lastWeek: items.filter(filters.lastWeek).length,
    lastMonth: items.filter(filters.lastMonth).length,
    last3Months: items.filter(filters.last3Months).length,
  } as const;
}

/**
 * Generic function to calculate growth rate
 */
export const calculateGrowthRate = (
  current: number,
  previous: number
): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current / previous) * 100) * 100) / 100;
};

/**
 * Generic function to calculate monthly growth rate
 */
export const calculateMonthlyGrowthRate = (
  monthlyCount: number,
  totalCount: number
): number => {
  const previousTotal = Math.max(totalCount - monthlyCount, 1);
  return Math.round(((monthlyCount / previousTotal) * 100) * 100) / 100;
};

/**
 * Generic trend data generator for daily analysis
 */
export function generateDailyTrends<T extends { _creationTime: number }>(
  items: readonly T[],
  days: number = 30,
  now: number = Date.now()
): readonly TrendData[] {
  const trends: TrendData[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const dayStart = now - (i * 24 * 60 * 60 * 1000);
    const dayEnd = dayStart + (24 * 60 * 60 * 1000);

    const dayItems = items.filter(item =>
      item._creationTime >= dayStart && item._creationTime < dayEnd
    );

    trends.push({
      date: new Date(dayStart).toISOString().split('T')[0],
      count: dayItems.length,
    });
  }

  return trends;
}

/**
 * Generic weekly trend data generator
 */
export function generateWeeklyTrends<T extends { _creationTime: number }>(
  items: readonly T[],
  weeks: number = 12,
  now: number = Date.now()
): readonly { week: string; count: number; startDate: string }[] {
  const trends: { week: string; count: number; startDate: string }[] = [];

  for (let week = 0; week < weeks; week++) {
    const weekStart = now - ((week + 1) * 7 * 24 * 60 * 60 * 1000);
    const weekEnd = now - (week * 7 * 24 * 60 * 60 * 1000);

    const weekItems = items.filter(item =>
      item._creationTime >= weekStart && item._creationTime < weekEnd
    );

    trends.unshift({
      week: `Week ${weeks - week}`,
      count: weekItems.length,
      startDate: new Date(weekStart).toISOString().split('T')[0],
    });
  }

  return trends;
}

// ========== DISTRIBUTION ANALYSIS UTILITIES ==========
/**
 * Generic function to analyze temporal distribution by hour
 */
export function analyzeHourlyDistribution<T extends { _creationTime: number }>(
  items: readonly T[]
): readonly number[] {
  const hourlyData = new Array(24).fill(0);

  items.forEach(item => {
    const hour = new Date(item._creationTime).getUTCHours();
    hourlyData[hour]++;
  });

  return hourlyData;
}

/**
 * Generic function to analyze temporal distribution by day of week
 */
export function analyzeDayOfWeekDistribution<T extends { _creationTime: number }>(
  items: readonly T[]
): readonly number[] {
  const dailyData = new Array(7).fill(0);

  items.forEach(item => {
    const day = new Date(item._creationTime).getUTCDay();
    dailyData[day]++;
  });

  return dailyData;
}

/**
 * Find peak activity periods
 */
export const findPeakActivity = (
  hourlyData: readonly number[],
  dailyData: readonly number[]
) => ({
  hour: hourlyData.indexOf(Math.max(...hourlyData)),
  day: dailyData.indexOf(Math.max(...dailyData)),
} as const);

// ========== COMPLEXITY ANALYSIS UTILITIES ==========
/**
 * Generic complexity calculator for maps
 */
export interface ComplexityWeights {
  readonly markers: number;
  readonly collections: number;
  readonly paths: number;
  readonly labels?: number;
}

export const calculateComplexity = (
  counts: {
    markers: number;
    collections: number;
    paths: number;
    labels?: number;
  },
  weights: ComplexityWeights = { markers: 1, collections: 2, paths: 3, labels: 1 }
): number => {
  return (
    counts.markers * weights.markers +
    counts.collections * weights.collections +
    counts.paths * weights.paths +
    (counts.labels || 0) * (weights.labels || 1)
  );
};

/**
 * Generic complexity distribution analyzer
 */
export function analyzeComplexityDistribution(
  complexities: readonly number[]
): {
  readonly simple: number;
  readonly moderate: number;
  readonly complex: number;
  readonly veryComplex?: number;
} {
  return {
    simple: complexities.filter(c => c <= 5).length,
    moderate: complexities.filter(c => c > 5 && c <= 20).length,
    complex: complexities.filter(c => c > 20 && c <= 50).length,
    veryComplex: complexities.filter(c => c > 50).length,
  };
}

// ========== ENGAGEMENT ANALYSIS UTILITIES ==========
/**
 * Generic retention rate calculator
 */
export const calculateRetentionRate = (
  engagedUsers: number,
  totalUsers: number
): number => {
  if (totalUsers === 0) return 0;
  return Math.round((engagedUsers / totalUsers) * 100 * 100) / 100;
};

/**
 * Generic adoption rate calculator
 */
export const calculateAdoptionRate = (
  itemsWithFeature: number,
  totalItems: number
): number => {
  if (totalItems === 0) return 0;
  return Math.round((itemsWithFeature / totalItems) * 100);
};

/**
 * Generic average calculator with precision
 */
export const calculatePreciseAverage = (
  total: number,
  count: number,
  precision: number = 2
): number => {
  if (count === 0) return 0;
  return Math.round((total / count) * Math.pow(10, precision)) / Math.pow(10, precision);
};

// ========== COLLABORATION ANALYSIS UTILITIES ==========
/**
 * Generic collaborator counter
 */
export function analyzeCollaborationPatterns<T extends { map_id: string }>(
  collaborations: readonly T[]
): Record<string, number> {
  return collaborations.reduce((acc, collaboration) => {
    acc[collaboration.map_id] = (acc[collaboration.map_id] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

/**
 * Generic unique collaborator counter
 */
export function countUniqueCollaborators<T extends { user_id: string }>(
  collaborations: readonly T[]
): number {
  return new Set(collaborations.map(c => c.user_id)).size;
}

// ========== DATA TRANSFORMATION UTILITIES ==========
/**
 * Generic safe array access with fallback
 */
export const safeArrayAccess = <T>(
  array: readonly T[],
  index: number,
  fallback: T
): T => {
  return array[index] ?? fallback;
};

/**
 * Generic null-safe operation
 */
export const withFallback = <T, R>(
  value: T | null | undefined,
  operation: (value: T) => R,
  fallback: R
): R => {
  return value != null ? operation(value) : fallback;
};

/**
 * Generic round to precision
 */
export const roundToPrecision = (
  value: number,
  precision: number = 2
): number => {
  return Math.round(value * Math.pow(10, precision)) / Math.pow(10, precision);
};

// ========== TYPE GUARDS AND VALIDATORS ==========
/**
 * Type guard for items with creation time
 */
export const hasCreationTime = (
  item: unknown
): item is { _creationTime: number } => {
  return typeof item === 'object' &&
         item !== null &&
         '_creationTime' in item &&
         typeof (item as any)._creationTime === 'number';
};

/**
 * Type guard for items with ID
 */
export const hasId = (
  item: unknown
): item is { _id: string } => {
  return typeof item === 'object' &&
         item !== null &&
         '_id' in item &&
         typeof (item as any)._id === 'string';
};

// ========== SORTING UTILITIES ==========
/**
 * Generic sorter by creation time
 */
export const sortByCreationTime = <T extends { _creationTime: number }>(
  ascending: boolean = false
) => (a: T, b: T): number => {
  return ascending
    ? a._creationTime - b._creationTime
    : b._creationTime - a._creationTime;
};

/**
 * Generic sorter by count/activity
 */
export const sortByActivity = <T extends { totalActivity?: number; totalElements?: number }>(
  descending: boolean = true
) => (a: T, b: T): number => {
  const aActivity = a.totalActivity ?? a.totalElements ?? 0;
  const bActivity = b.totalActivity ?? b.totalElements ?? 0;
  return descending ? bActivity - aActivity : aActivity - bActivity;
};

// ========== VALIDATION UTILITIES ==========
/**
 * Validates that a number is within expected range
 */
export const validateRange = (
  value: number,
  min: number = 0,
  max: number = Number.MAX_SAFE_INTEGER
): number => {
  return Math.max(min, Math.min(max, value));
};

/**
 * Validates percentage value
 */
export const validatePercentage = (value: number): number => {
  return validateRange(value, 0, 100);
};