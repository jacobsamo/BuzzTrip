import { ConvexError, v } from "convex/values";
import { action, internalAction } from "../_generated/server";
import { zid } from "convex-helpers/server/zod";
import {
  travelBoundariesSchema,
  travelBoundariesEditSchema,
} from "../../zod-schemas/maps-schema";
import { authedQuery, authedMutation, zodMutation } from "../helpers";
import { internal } from "../_generated/api";

/**
 * Query to get all travel boundaries for a map
 */
export const getTravelBoundaries = authedQuery({
  args: {
    mapId: zid("maps"),
  },
  handler: async (ctx, { mapId }) => {
    const boundaries = await ctx.db
      .query("travel_boundaries")
      .withIndex("by_map_id", (q) => q.eq("map_id", mapId))
      .collect();

    return boundaries;
  },
});

/**
 * Query to get a single travel boundary
 */
export const getTravelBoundary = authedQuery({
  args: {
    boundaryId: zid("travel_boundaries"),
  },
  handler: async (ctx, { boundaryId }) => {
    const boundary = await ctx.db.get(boundaryId);

    if (!boundary) {
      throw new ConvexError("Travel boundary not found");
    }

    return boundary;
  },
});

/**
 * Internal mutation to create a new travel boundary with calculated polygon
 */
export const internalCreateTravelBoundary = zodMutation({
  args: travelBoundariesEditSchema.omit({ _id: true, _creationTime: true }),
  handler: async (ctx, args) => {
    const boundaryId = await ctx.db.insert("travel_boundaries", {
      ...args,
      _creationTime: Date.now(),
    });

    return boundaryId;
  },
});

/**
 * Mutation to update a travel boundary (e.g., change duration or visibility)
 */
export const updateTravelBoundary = authedMutation({
  args: {
    boundaryId: zid("travel_boundaries"),
    updates: travelBoundariesEditSchema.partial().omit({
      _id: true,
      _creationTime: true,
      map_id: true,
      created_by: true,
    }),
  },
  handler: async (ctx, { boundaryId, updates }) => {
    const boundary = await ctx.db.get(boundaryId);

    if (!boundary) {
      throw new ConvexError("Travel boundary not found");
    }

    await ctx.db.patch(boundaryId, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });

    return boundaryId;
  },
});

/**
 * Mutation to toggle visibility of a travel boundary
 */
export const toggleTravelBoundaryVisibility = authedMutation({
  args: {
    boundaryId: zid("travel_boundaries"),
  },
  handler: async (ctx, { boundaryId }) => {
    const boundary = await ctx.db.get(boundaryId);

    if (!boundary) {
      throw new ConvexError("Travel boundary not found");
    }

    await ctx.db.patch(boundaryId, {
      is_visible: !boundary.is_visible,
      updatedAt: new Date().toISOString(),
    });

    return boundaryId;
  },
});

/**
 * Mutation to delete a travel boundary
 */
export const deleteTravelBoundary = authedMutation({
  args: {
    boundaryId: zid("travel_boundaries"),
  },
  handler: async (ctx, { boundaryId }) => {
    const boundary = await ctx.db.get(boundaryId);

    if (!boundary) {
      throw new ConvexError("Travel boundary not found");
    }

    await ctx.db.delete(boundaryId);

    return boundaryId;
  },
});

/**
 * Internal action to calculate travel time boundary using Google Directions API
 * Uses 8-point radial sampling with binary search
 */
export const calculateTravelBoundary = internalAction({
  args: {
    centerLat: v.number(),
    centerLng: v.number(),
    durationMinutes: v.number(),
    mapId: zid("maps"),
  },
  handler: async (ctx, { centerLat, centerLng, durationMinutes }) => {
    // Get Google Maps API key from environment
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      throw new ConvexError("Google Maps API key not configured");
    }

    const targetDurationSeconds = durationMinutes * 60;

    // 8 compass directions (in degrees)
    const directions = [0, 45, 90, 135, 180, 225, 270, 315];
    const directionNames = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];

    const polygonPoints: Array<{ lat: number; lng: number }> = [];

    // Helper function to calculate destination point
    const getDestinationPoint = (lat: number, lng: number, bearing: number, distanceKm: number) => {
      const R = 6371; // Earth's radius in km
      const bearingRad = (bearing * Math.PI) / 180;
      const latRad = (lat * Math.PI) / 180;
      const lngRad = (lng * Math.PI) / 180;

      const newLatRad = Math.asin(
        Math.sin(latRad) * Math.cos(distanceKm / R) +
        Math.cos(latRad) * Math.sin(distanceKm / R) * Math.cos(bearingRad)
      );

      const newLngRad = lngRad + Math.atan2(
        Math.sin(bearingRad) * Math.sin(distanceKm / R) * Math.cos(latRad),
        Math.cos(distanceKm / R) - Math.sin(latRad) * Math.sin(newLatRad)
      );

      return {
        lat: (newLatRad * 180) / Math.PI,
        lng: (newLngRad * 180) / Math.PI,
      };
    };

    // Helper function to get travel time from Google Directions API
    const getTravelTime = async (destLat: number, destLng: number): Promise<number | null> => {
      try {
        const url = new URL("https://maps.googleapis.com/maps/api/directions/json");
        url.searchParams.append("origin", `${centerLat},${centerLng}`);
        url.searchParams.append("destination", `${destLat},${destLng}`);
        url.searchParams.append("mode", "driving");
        url.searchParams.append("key", apiKey);

        const response = await fetch(url.toString());
        const data = await response.json();

        if (data.status === "OK" && data.routes.length > 0) {
          const duration = data.routes[0].legs[0].duration.value; // in seconds
          return duration;
        }

        // Handle cases where no route is found (e.g., destination is on water)
        return null;
      } catch (error) {
        console.error("Error fetching travel time:", error);
        return null;
      }
    };

    // Binary search to find the furthest reachable point in each direction
    for (let i = 0; i < directions.length; i++) {
      const bearing = directions[i];
      const directionName = directionNames[i];

      // Initial search bounds (in km)
      let minDistance = 0;
      let maxDistance = 200; // Start with 200km max

      // First, check if we can even reach a short distance
      const testPoint = getDestinationPoint(centerLat, centerLng, bearing, 5);
      const testTime = await getTravelTime(testPoint.lat, testPoint.lng);

      if (testTime === null) {
        // Can't reach any point in this direction, use center point
        polygonPoints.push({ lat: centerLat, lng: centerLng });
        continue;
      }

      // Expand max distance if needed
      if (testTime < targetDurationSeconds) {
        // We can go further, increase max distance based on ratio
        maxDistance = Math.min(500, (targetDurationSeconds / testTime) * 5);
      }

      let bestPoint = { lat: centerLat, lng: centerLng };
      let bestDistance = 0;

      // Binary search for furthest reachable point
      let iterations = 0;
      const maxIterations = 6; // Limit to ~6 iterations per direction

      while (iterations < maxIterations && maxDistance - minDistance > 1) {
        const midDistance = (minDistance + maxDistance) / 2;
        const midPoint = getDestinationPoint(centerLat, centerLng, bearing, midDistance);

        const travelTime = await getTravelTime(midPoint.lat, midPoint.lng);

        if (travelTime === null) {
          // Can't reach this point, reduce max distance
          maxDistance = midDistance;
        } else if (travelTime <= targetDurationSeconds) {
          // Can reach this point within time limit, try going further
          bestPoint = midPoint;
          bestDistance = midDistance;
          minDistance = midDistance;
        } else {
          // Takes too long, reduce max distance
          maxDistance = midDistance;
        }

        iterations++;
      }

      polygonPoints.push(bestPoint);
    }

    // Close the polygon by adding the first point at the end
    if (polygonPoints.length > 0) {
      polygonPoints.push(polygonPoints[0]);
    }

    return polygonPoints;
  },
});

/**
 * Combined action to calculate and save a travel boundary
 */
export const calculateAndSaveTravelBoundary = action({
  args: {
    mapId: zid("maps"),
    centerLat: v.number(),
    centerLng: v.number(),
    durationMinutes: v.number(),
    title: v.optional(v.string()),
    userId: zid("users"),
  },
  handler: async (ctx, { mapId, centerLat, centerLng, durationMinutes, title, userId }) => {
    // Calculate the polygon
    const polygon = await ctx.runAction(internal.maps.travelBoundaries.calculateTravelBoundary, {
      centerLat,
      centerLng,
      durationMinutes,
      mapId,
    });

    if (polygon.length === 0) {
      throw new ConvexError("Failed to calculate travel boundary");
    }

    // Save the boundary
    const boundaryId = await ctx.runMutation(internal.maps.travelBoundaries.internalCreateTravelBoundary, {
      map_id: mapId,
      center_lat: centerLat,
      center_lng: centerLng,
      duration_minutes: durationMinutes,
      polygon,
      is_visible: true,
      title: title || `${durationMinutes} min drive`,
      created_by: userId,
    });

    return boundaryId;
  },
});
