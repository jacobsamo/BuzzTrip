import { useQuery } from "convex/react";
import { api } from "@buzztrip/backend/api";

/**
 * Hook to get user statistics for admin dashboard
 */
export function useUserStats() {
  return useQuery(api.admin.getUserStats);
}

/**
 * Hook to get map statistics for admin dashboard
 */
export function useMapStats() {
  return useQuery(api.admin.getMapStats);
}

/**
 * Hook to get activity metrics for admin dashboard
 */
export function useActivityMetrics() {
  return useQuery(api.admin.getActivityMetrics);
}

/**
 * Hook to get global statistics for admin dashboard
 */
export function useGlobalStats() {
  return useQuery(api.admin.getGlobalStats);
}

/**
 * Hook to get comprehensive dashboard overview
 */
export function useDashboardOverview() {
  return useQuery(api.admin.getDashboardOverview);
}

/**
 * Hook to get detailed maps data for management table
 */
export function useDetailedMaps() {
  return useQuery(api.admin.getDetailedMaps);
}

/**
 * Hook to get users from Convex (faster than Clerk)
 */
export function useConvexUsers() {
  return useQuery(api.admin.getUsers);
}

/**
 * Hook to get a single user by ID from Convex
 */
export function useConvexUserById(id: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return useQuery(api.admin.getUserById, { id: id as any });
}

/**
 * Hook to get a single map by ID from Convex
 */
export function useConvexMapById(id: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return useQuery(api.admin.getMapById, { id: id as any });
}

/**
 * Hook to get detailed map items analytics
 */
export function useMapItemsAnalytics() {
  return useQuery(api.admin.getMapItemsAnalytics);
}

/**
 * Hook to get all admin data at once with loading states
 */
export function useAdminDashboard() {
  const userStats = useUserStats();
  const mapStats = useMapStats();
  const activityMetrics = useActivityMetrics();
  const globalStats = useGlobalStats();
  const overview = useDashboardOverview();

  const isLoading = !userStats || !mapStats || !activityMetrics || !globalStats || !overview;
  const hasError = false; // Convex handles errors automatically

  return {
    userStats,
    mapStats,
    activityMetrics,
    globalStats,
    overview,
    isLoading,
    hasError,
  };
}