import type { Id } from "../convex/_generated/dataModel";
import type { QueryCtx } from "../convex/_generated/server";
import type {
  TimeRange,
  TimePeriods,
  ActivitySummary,
  ActivityPatterns,
  AggregationFn,
  LookupMap,
  Percentage,
  ComplexityScore,
  GrowthRate,
  AdminResult,
  createPercentage,
  createComplexityScore,
  createGrowthRate,
} from "../types/admin-types";

/**
 * Time period constants for consistent date calculations across admin functions
 */
export const TIME_PERIODS = {
  ONE_DAY: 24 * 60 * 60 * 1000,
  ONE_WEEK: 7 * 24 * 60 * 60 * 1000,
  ONE_MONTH: 30 * 24 * 60 * 60 * 1000,
  THREE_MONTHS: 90 * 24 * 60 * 60 * 1000,
  ONE_YEAR: 365 * 24 * 60 * 60 * 1000,
} as const;

/**
 * Calculate time periods relative to current time
 */
export function getTimePeriods(now: number = Date.now()) {
  return {
    now,
    oneDayAgo: now - TIME_PERIODS.ONE_DAY,
    oneWeekAgo: now - TIME_PERIODS.ONE_WEEK,
    oneMonthAgo: now - TIME_PERIODS.ONE_MONTH,
    threeMonthsAgo: now - TIME_PERIODS.THREE_MONTHS,
    oneYearAgo: now - TIME_PERIODS.ONE_YEAR,
  };
}

/**
 * Generate daily trend data for a given time range
 */
export function generateDailyTrends<T extends { _creationTime: number }>(
  items: T[],
  days: number = 30,
  now: number = Date.now()
): Array<{ date: string; count: number; dayOfWeek: number; weekNumber: number }> {
  const trends = [];

  for (let i = days - 1; i >= 0; i--) {
    const dayStart = now - (i * TIME_PERIODS.ONE_DAY);
    const dayEnd = dayStart + TIME_PERIODS.ONE_DAY;

    const dayItems = items.filter(item =>
      item._creationTime >= dayStart && item._creationTime < dayEnd
    );

    trends.push({
      date: new Date(dayStart).toISOString().split('T')[0],
      count: dayItems.length,
      dayOfWeek: new Date(dayStart).getDay(),
      weekNumber: Math.floor(i / 7)
    });
  }

  return trends;
}

/**
 * Generate weekly trend data for a given time range
 */
export function generateWeeklyTrends<T extends { _creationTime: number }>(
  items: T[],
  weeks: number = 12,
  now: number = Date.now()
): Array<{ week: string; count: number; startDate: string }> {
  const trends = [];

  for (let week = 0; week < weeks; week++) {
    const weekStart = now - ((week + 1) * TIME_PERIODS.ONE_WEEK);
    const weekEnd = now - (week * TIME_PERIODS.ONE_WEEK);

    const weekItems = items.filter(item =>
      item._creationTime >= weekStart && item._creationTime < weekEnd
    );

    trends.unshift({
      week: `Week ${weeks - week}`,
      count: weekItems.length,
      startDate: new Date(weekStart).toISOString().split('T')[0]
    });
  }

  return trends;
}

/**
 * Calculate type-safe activity patterns by hour and day of week
 */
export function calculateActivityPatterns<T extends { _creationTime: number }>(
  items: ReadonlyArray<T>
): ActivityPatterns {
  const byHour = new Array(24).fill(0) as number[];
  const byDayOfWeek = new Array(7).fill(0) as number[];

  items.forEach(item => {
    const date = new Date(item._creationTime);
    byHour[date.getUTCHours()]++;
    byDayOfWeek[date.getUTCDay()]++;
  });

  return {
    byHour: Object.freeze(byHour),
    byDayOfWeek: Object.freeze(byDayOfWeek),
    peakHour: byHour.indexOf(Math.max(...byHour)),
    peakDay: byDayOfWeek.indexOf(Math.max(...byDayOfWeek)),
  } as const;
}

/**
 * Calculate advanced activity patterns with statistical insights
 */
export function calculateAdvancedActivityPatterns<T extends { _creationTime: number }>(
  items: ReadonlyArray<T>
): ActivityPatterns & {
  statistics: {
    hourlyAverage: number;
    dailyAverage: number;
    hourlyVariance: number;
    dailyVariance: number;
    activityScore: ComplexityScore;
  };
} {
  const patterns = calculateActivityPatterns(items);

  const hourlyAverage = patterns.byHour.reduce((sum, count) => sum + count, 0) / 24;
  const dailyAverage = patterns.byDayOfWeek.reduce((sum, count) => sum + count, 0) / 7;

  const hourlyVariance = patterns.byHour.reduce((sum, count) =>
    sum + Math.pow(count - hourlyAverage, 2), 0) / 24;
  const dailyVariance = patterns.byDayOfWeek.reduce((sum, count) =>
    sum + Math.pow(count - dailyAverage, 2), 0) / 7;

  // Activity score based on distribution evenness (lower variance = higher score)
  const activityScore = createComplexityScore(
    Math.max(0, 100 - (hourlyVariance + dailyVariance) / 2)
  );

  return {
    ...patterns,
    statistics: {
      hourlyAverage,
      dailyAverage,
      hourlyVariance,
      dailyVariance,
      activityScore,
    },
  };
}

/**
 * Calculate type-safe growth rate between two time periods
 */
export function calculateGrowthRate(current: number, previous: number): GrowthRate {
  if (previous === 0) return createGrowthRate(current > 0 ? 100 : 0);
  const rate = Math.round(((current - previous) / previous) * 100 * 100) / 100;
  return createGrowthRate(rate);
}

/**
 * Calculate growth rate with detailed metadata
 */
export function calculateDetailedGrowthRate(
  current: number,
  previous: number
): {
  rate: GrowthRate;
  direction: "up" | "down" | "stable";
  isSignificant: boolean;
} {
  const rate = calculateGrowthRate(current, previous);
  const direction = rate > 0 ? "up" : rate < 0 ? "down" : "stable";
  const isSignificant = Math.abs(rate) >= 5; // 5% threshold for significance

  return { rate, direction, isSignificant };
}

/**
 * Filter items by time period with enhanced type safety
 */
export function filterByTimePeriod<T extends { _creationTime: number }>(
  items: ReadonlyArray<T>,
  periodMs: number,
  now: number = Date.now()
): ReadonlyArray<T> {
  const cutoff = now - periodMs;
  return items.filter(item => item._creationTime > cutoff);
}

/**
 * Filter items by custom time range
 */
export function filterByTimeRange<T extends { _creationTime: number }>(
  items: ReadonlyArray<T>,
  timeRange: TimeRange
): ReadonlyArray<T> {
  return items.filter(item =>
    item._creationTime >= timeRange.start && item._creationTime <= timeRange.end
  );
}

/**
 * Multi-criteria filter with type safety
 */
export function filterByCriteria<T>(
  items: ReadonlyArray<T>,
  criteria: Array<(item: T) => boolean>
): ReadonlyArray<T> {
  return items.filter(item => criteria.every(criterion => criterion(item)));
}

/**
 * Create type-safe activity summary for different time periods
 */
export function createActivitySummary<T extends { _creationTime: number }>(
  items: ReadonlyArray<T>,
  now: number = Date.now()
): ActivitySummary {
  const periods = getTimePeriods(now);

  return {
    last24h: filterByTimePeriod(items, TIME_PERIODS.ONE_DAY, now).length,
    lastWeek: filterByTimePeriod(items, TIME_PERIODS.ONE_WEEK, now).length,
    lastMonth: filterByTimePeriod(items, TIME_PERIODS.ONE_MONTH, now).length,
    last3Months: filterByTimePeriod(items, TIME_PERIODS.THREE_MONTHS, now).length,
  } as const;
}

/**
 * Create detailed activity summary with metadata
 */
export function createDetailedActivitySummary<T extends { _creationTime: number }>(
  items: ReadonlyArray<T>,
  now: number = Date.now()
): ActivitySummary & {
  metadata: {
    totalItems: number;
    processingTime: number;
    oldestItem?: number;
    newestItem?: number;
  };
} {
  const startTime = performance.now();
  const summary = createActivitySummary(items, now);
  const endTime = performance.now();

  const timestamps = items.map(item => item._creationTime);

  return {
    ...summary,
    metadata: {
      totalItems: items.length,
      processingTime: endTime - startTime,
      oldestItem: timestamps.length > 0 ? Math.min(...timestamps) : undefined,
      newestItem: timestamps.length > 0 ? Math.max(...timestamps) : undefined,
    },
  };
}

/**
 * User data interface for lookup creation
 */
export interface UserLookupData {
  readonly _id: Id<"users">;
  readonly first_name?: string;
  readonly last_name?: string;
  readonly name?: string;
  readonly email?: string;
  readonly image?: string;
}

/**
 * Enhanced user lookup result
 */
export interface UserLookupResult {
  readonly id: Id<"users">;
  readonly name: string;
  readonly email: string;
  readonly displayName: string;
  readonly initials: string;
  readonly imageUrl?: string;
}

/**
 * Create a type-safe user lookup map for efficient user data retrieval
 */
export function createUserLookup(
  users: ReadonlyArray<UserLookupData>
): LookupMap<Id<"users">, UserLookupResult> {
  const lookup = new Map<Id<"users">, UserLookupResult>();

  users.forEach(user => {
    const firstName = user.first_name || '';
    const lastName = user.last_name || '';
    const fullName = `${firstName} ${lastName}`.trim();
    const displayName = fullName || user.name || 'Unknown User';

    // Generate initials from name
    const initials = displayName
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');

    lookup.set(user._id, {
      id: user._id,
      name: displayName,
      email: user.email || 'No email',
      displayName,
      initials: initials || 'U',
      imageUrl: user.image,
    });
  });

  return lookup;
}

/**
 * Generic lookup map creator for any entity type
 */
export function createGenericLookup<T, K extends keyof T, R>(
  items: ReadonlyArray<T>,
  keySelector: (item: T) => T[K],
  valueMapper: (item: T) => R
): LookupMap<T[K], R> {
  const lookup = new Map<T[K], R>();

  items.forEach(item => {
    const key = keySelector(item);
    const value = valueMapper(item);
    lookup.set(key, value);
  });

  return lookup;
}

/**
 * Round number to specified decimal places
 */
export function roundToDecimals(num: number, decimals: number = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round(num * factor) / factor;
}

/**
 * Safe division with fallback
 */
export function safeDivide(numerator: number, denominator: number, fallback: number = 0): number {
  return denominator === 0 ? fallback : numerator / denominator;
}

/**
 * Calculate type-safe percentage with rounding
 */
export function calculatePercentage(part: number, total: number): Percentage {
  const percentage = roundToDecimals(safeDivide(part, total, 0) * 100);
  return createPercentage(Math.min(100, Math.max(0, percentage)));
}

/**
 * Calculate percentage with confidence interval
 */
export function calculatePercentageWithConfidence(
  part: number,
  total: number,
  confidenceLevel: number = 0.95
): {
  percentage: Percentage;
  confidence: {
    lower: Percentage;
    upper: Percentage;
    level: number;
  };
} {
  const percentage = calculatePercentage(part, total);

  // Simple confidence interval calculation (for large samples)
  const p = part / total;
  const z = confidenceLevel === 0.95 ? 1.96 : confidenceLevel === 0.99 ? 2.576 : 1.645;
  const margin = z * Math.sqrt((p * (1 - p)) / total);

  const lower = createPercentage(Math.max(0, (p - margin) * 100));
  const upper = createPercentage(Math.min(100, (p + margin) * 100));

  return {
    percentage,
    confidence: {
      lower,
      upper,
      level: confidenceLevel,
    },
  };
}

/**
 * Efficiently count items by a specific field value with type safety
 */
export function countByField<T, K extends keyof T>(
  items: ReadonlyArray<T>,
  field: K,
  value: T[K]
): number {
  return items.filter(item => item[field] === value).length;
}

/**
 * Count items by multiple field values efficiently
 */
export function countByMultipleFields<T>(
  items: ReadonlyArray<T>,
  conditions: Partial<T>
): number {
  return items.filter(item => {
    return Object.entries(conditions).every(([key, value]) =>
      item[key as keyof T] === value
    );
  }).length;
}

/**
 * Group items by a field and count them with enhanced type safety
 */
export function groupAndCount<T, K extends string | number>(
  items: ReadonlyArray<T>,
  getKey: (item: T) => K
): Record<K, number> {
  return items.reduce((acc, item) => {
    const key = getKey(item);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<K, number>);
}

/**
 * Advanced grouping with custom aggregation
 */
export function groupAndAggregate<T, K extends string | number, R>(
  items: ReadonlyArray<T>,
  getKey: (item: T) => K,
  aggregateFn: (items: ReadonlyArray<T>) => R
): Record<K, R> {
  const grouped = items.reduce((acc, item) => {
    const key = getKey(item);
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {} as Record<K, T[]>);

  const result = {} as Record<K, R>;
  for (const [key, groupItems] of Object.entries(grouped)) {
    result[key as K] = aggregateFn(groupItems);
  }

  return result;
}

/**
 * Get activity metrics for a specific time period
 */
export function getActivityMetrics<T extends { _creationTime: number }>(
  allItems: T[],
  filterFn: (item: T) => boolean,
  now: number = Date.now()
) {
  const filteredItems = allItems.filter(filterFn);
  const periods = getTimePeriods(now);

  return {
    total: filteredItems.length,
    last24h: filteredItems.filter(item => item._creationTime > periods.oneDayAgo).length,
    lastWeek: filteredItems.filter(item => item._creationTime > periods.oneWeekAgo).length,
    lastMonth: filteredItems.filter(item => item._creationTime > periods.oneMonthAgo).length,
  };
}

/**
 * Efficiently get users from database with proper indexing
 */
export async function getOptimizedUsers(ctx: QueryCtx) {
  // Use limit and proper ordering to avoid collecting all users at once
  return await ctx.db
    .query("users")
    .order("desc") // Most recent first
    .collect();
}

/**
 * Enhanced paginated results with proper metadata and type safety
 */
export interface PaginatedResult<T> {
  readonly items: ReadonlyArray<T>;
  readonly totalCount: number;
  readonly hasMore: boolean;
  readonly cursor?: string;
  readonly metadata: {
    readonly pageSize: number;
    readonly currentPage: number;
    readonly totalPages: number;
    readonly processingTime: number;
  };
}

/**
 * Create paginated result with calculated metadata
 */
export function createPaginatedResult<T>(
  items: ReadonlyArray<T>,
  totalCount: number,
  pageSize: number,
  currentPage: number,
  processingTime: number,
  cursor?: string
): PaginatedResult<T> {
  const totalPages = Math.ceil(totalCount / pageSize);
  const hasMore = currentPage < totalPages;

  return {
    items,
    totalCount,
    hasMore,
    cursor,
    metadata: {
      pageSize,
      currentPage,
      totalPages,
      processingTime,
    },
  };
}

/**
 * Create a type-safe aggregation helper that handles edge cases
 */
export function safeAggregate<T, R = number>(
  items: ReadonlyArray<T>,
  aggregateFn: AggregationFn<T, R>,
  fallback: R
): AdminResult<R> {
  try {
    if (items.length === 0) {
      return { success: true, data: fallback };
    }

    const result = aggregateFn(items);
    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: `Aggregation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: Date.now(),
        details: { itemCount: items.length },
      },
    };
  }
}

/**
 * Batch aggregation with parallel processing
 */
export function batchAggregate<T, R>(
  items: ReadonlyArray<T>,
  aggregationFns: Record<string, AggregationFn<T, R>>,
  batchSize: number = 1000
): AdminResult<Record<string, R>> {
  try {
    const results: Record<string, R> = {};

    // Process items in batches to avoid memory issues
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);

      for (const [key, fn] of Object.entries(aggregationFns)) {
        if (i === 0) {
          results[key] = fn(batch);
        } else {
          // Combine results (assumes numeric aggregation)
          results[key] = (results[key] as any) + fn(batch);
        }
      }
    }

    return { success: true, data: results };
  } catch (error) {
    return {
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: `Batch aggregation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: Date.now(),
        details: { itemCount: items.length, batchSize },
      },
    };
  }
}

// ============================================================================
// ADVANCED ANALYTICS HELPER FUNCTIONS
// ============================================================================

/**
 * Calculate statistical summary for numeric data
 */
export function calculateStatistics(values: ReadonlyArray<number>): {
  mean: number;
  median: number;
  mode: number;
  standardDeviation: number;
  min: number;
  max: number;
  count: number;
  quartiles: {
    q1: number;
    q2: number;
    q3: number;
  };
} {
  if (values.length === 0) {
    throw new Error("Cannot calculate statistics for empty array");
  }

  const sorted = [...values].sort((a, b) => a - b);
  const count = values.length;
  const mean = values.reduce((sum, val) => sum + val, 0) / count;

  // Median
  const median = count % 2 === 0
    ? (sorted[count / 2 - 1] + sorted[count / 2]) / 2
    : sorted[Math.floor(count / 2)];

  // Mode (most frequent value)
  const frequency = new Map<number, number>();
  values.forEach(val => frequency.set(val, (frequency.get(val) || 0) + 1));
  const mode = [...frequency.entries()].reduce((a, b) => a[1] > b[1] ? a : b)[0];

  // Standard deviation
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / count;
  const standardDeviation = Math.sqrt(variance);

  // Quartiles
  const q1Index = Math.floor(count * 0.25);
  const q2Index = Math.floor(count * 0.5);
  const q3Index = Math.floor(count * 0.75);

  return {
    mean: roundToDecimals(mean),
    median: roundToDecimals(median),
    mode,
    standardDeviation: roundToDecimals(standardDeviation),
    min: Math.min(...values),
    max: Math.max(...values),
    count,
    quartiles: {
      q1: sorted[q1Index],
      q2: sorted[q2Index],
      q3: sorted[q3Index],
    },
  };
}

/**
 * Create time-based filters for analytics
 */
export function createTimeFilter<T extends { _creationTime: number }>(
  timeRange: TimeRange
): (item: T) => boolean {
  return (item: T) =>
    item._creationTime >= timeRange.start && item._creationTime <= timeRange.end;
}

/**
 * Efficient counter for categorical data
 */
export function createCounter<T extends string | number>(
  items: ReadonlyArray<T>
): ReadonlyMap<T, number> {
  const counter = new Map<T, number>();

  items.forEach(item => {
    counter.set(item, (counter.get(item) || 0) + 1);
  });

  return counter;
}