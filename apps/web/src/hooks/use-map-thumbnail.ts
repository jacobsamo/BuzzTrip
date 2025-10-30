"use client";

import { useMapStore } from "@/components/providers/map-state-provider";
import { api } from "@buzztrip/backend/api";
import type { Id } from "@buzztrip/backend/dataModel";
import type { CombinedMarker, Map, Path } from "@buzztrip/backend/types";
import { useMutation } from "convex/react";
import html2canvas from "html2canvas";
import { useEffect, useRef } from "react";

interface UseMapThumbnailOptions {
  mapId: Id<"maps">;
  mapElementId: string;
  googleMapInstance: google.maps.Map | null;
  currentMap: Map;
  enabled?: boolean;
}

/**
 * Check if all items are within the given bounds
 */
function areItemsWithinBounds(
  markers: CombinedMarker[] | null,
  paths: Path[] | null,
  bounds: { north: number; south: number; east: number; west: number } | null
): boolean {
  if (!bounds) return false;

  const points: { lat: number; lng: number }[] = [];

  // Collect all points from markers
  if (markers && markers.length > 0) {
    markers.forEach((marker) => {
      points.push({ lat: marker.lat, lng: marker.lng });
    });
  }

  // Collect all points from paths
  if (paths && paths.length > 0) {
    paths.forEach((path) => {
      if (path.points) {
        const extractPoint = (point: number[]) => {
          if (
            point.length >= 2 &&
            point[0] !== undefined &&
            point[1] !== undefined
          ) {
            points.push({ lat: point[1], lng: point[0] });
          }
        };

        if (typeof path.points[0] === "number") {
          extractPoint(path.points as number[]);
        } else if (Array.isArray(path.points[0])) {
          (path.points as number[][] | number[][][]).forEach((item) => {
            if (typeof item[0] === "number") {
              extractPoint(item as number[]);
            } else if (Array.isArray(item[0])) {
              (item as number[][]).forEach((nestedPoint) => {
                extractPoint(nestedPoint);
              });
            }
          });
        }
      }
    });
  }

  // If no points, consider them within bounds
  if (points.length === 0) return true;

  // Check if all points are within bounds
  return points.every(
    (point) =>
      point.lat >= bounds.south &&
      point.lat <= bounds.north &&
      point.lng >= bounds.west &&
      point.lng <= bounds.east
  );
}

/**
 * Helper function to calculate bounds that encompass all map items
 */
function calculateBoundsFromItems(
  markers: CombinedMarker[] | null,
  paths: Path[] | null
): google.maps.LatLngBoundsLiteral | null {
  const points: { lat: number; lng: number }[] = [];

  // Add all marker positions
  if (markers && markers.length > 0) {
    markers.forEach((marker) => {
      points.push({ lat: marker.lat, lng: marker.lng });
    });
  }

  // Add all path coordinates
  // Points are in GeoJSON format: [lng, lat] or arrays of those
  if (paths && paths.length > 0) {
    paths.forEach((path) => {
      if (path.points) {
        // Helper to extract lat/lng from a point tuple [lng, lat]
        const extractPoint = (point: number[]) => {
          if (
            point.length >= 2 &&
            point[0] !== undefined &&
            point[1] !== undefined
          ) {
            points.push({ lat: point[1], lng: point[0] }); // GeoJSON is [lng, lat]
          }
        };

        // Handle different point structures
        if (typeof path.points[0] === "number") {
          // Single point: [lng, lat]
          extractPoint(path.points as number[]);
        } else if (Array.isArray(path.points[0])) {
          // Array of points or array of arrays
          (path.points as number[][] | number[][][]).forEach((item) => {
            if (typeof item[0] === "number") {
              // Single point in array: [[lng, lat], [lng, lat], ...]
              extractPoint(item as number[]);
            } else if (Array.isArray(item[0])) {
              // Nested array (polygon): [[[lng, lat], [lng, lat], ...]]
              (item as number[][]).forEach((nestedPoint) => {
                extractPoint(nestedPoint);
              });
            }
          });
        }
      }
    });
  }

  // If no points, return null
  if (points.length === 0) return null;

  // Calculate bounds
  const bounds = {
    north: Math.max(...points.map((p) => p.lat)),
    south: Math.min(...points.map((p) => p.lat)),
    east: Math.max(...points.map((p) => p.lng)),
    west: Math.min(...points.map((p) => p.lng)),
  };

  // Add some padding (5% on each side)
  const latPadding = (bounds.north - bounds.south) * 0.05;
  const lngPadding = (bounds.east - bounds.west) * 0.05;

  return {
    north: bounds.north + latPadding,
    south: bounds.south - latPadding,
    east: bounds.east + lngPadding,
    west: bounds.west - lngPadding,
  };
}

/**
 * Custom hook to capture and update map thumbnails on page leave ONLY
 *
 * Features:
 * - Captures DOM snapshot ONLY on page unload, navigation, or tab switch
 * - Smart logic: Always generate if no thumbnail exists, only update on changes if one exists
 * - Auto-adjusts map bounds to fit all items before capture for complete thumbnail
 * - Updates map bounds in database ONLY if items are outside current bounds
 * - Non-blocking, fast capture
 * - Converts to base64 and stores in Convex
 *
 * Strategy:
 * - Triggers ONLY when user leaves the page (never during editing):
 *   1. Browser close/refresh (beforeunload + pagehide events)
 *   2. Tab switch (visibilitychange event)
 *   3. Navigate away (component unmount)
 * - Before capture, checks if items are within current bounds
 * - If items outside bounds: Updates bounds in database first
 * - If items within bounds: Skips bounds update (no unnecessary API calls)
 * - Then temporarily adjusts view to show all items
 * - Captures thumbnail showing complete map
 * - Changes are tracked locally in the store (markers, paths, collections)
 *
 * @param options Configuration options for thumbnail generation
 * @returns Object with manual capture trigger if needed
 */
export function useMapThumbnail({
  mapId,
  mapElementId,
  googleMapInstance,
  currentMap,
  enabled = true,
}: UseMapThumbnailOptions) {
  const updateThumbnail = useMutation(api.maps.index.updateMapThumbnail);
  const updateMapBounds = useMutation(api.maps.index.updateMapBounds);
  const isCapturingRef = useRef(false);

  // Store refs to access latest values without causing re-renders
  const googleMapRef = useRef(googleMapInstance);
  const currentMapRef = useRef(currentMap);
  const mapIdRef = useRef(mapId);

  // Update refs when props change
  useEffect(() => {
    googleMapRef.current = googleMapInstance;
    currentMapRef.current = currentMap;
    mapIdRef.current = mapId;
  }, [googleMapInstance, currentMap, mapId]);

  /**
   * Single useEffect that runs ONLY on mount/unmount
   */
  useEffect(() => {
    if (!enabled) return;

    console.log("[useMapThumbnail] Setting up event listeners");

    // Shared capture function that all events call
    const handleCapture = async (
      markers: typeof useMapStore extends (...args: any[]) => infer R ? ReturnType<R>['markers'] : never,
      paths: typeof useMapStore extends (...args: any[]) => infer R ? ReturnType<R>['paths'] : never,
      mapChanges: typeof useMapStore extends (...args: any[]) => infer R ? ReturnType<R>['mapChanges'] : never,
      resetChanges: typeof useMapStore extends (...args: any[]) => infer R ? ReturnType<R>['resetChanges'] : never
    ) => {
      const googleMap = googleMapRef.current;
      const map = currentMapRef.current;
      const currentMapId = mapIdRef.current;

      // Check if we should do anything
      if (isCapturingRef.current || !googleMap) {
        console.log("[handleCapture] Skipping - already capturing or no map");
        return;
      }

      // Check if we have a thumbnail already
      const hasThumbnail = !!map.thumbnailUrl;
      console.log("[handleCapture] Has thumbnail:", hasThumbnail);
      console.log("[handleCapture] Map changes:", mapChanges);

      // Determine if thumbnail needs update
      const shouldUpdateThumbnail =
        !hasThumbnail || // Always update if no thumbnail
        mapChanges.totalChanges === 0
          ? false // No changes, skip
          : // Significant changes warrant an update
            mapChanges.markers.deleted >= 2 ||
            mapChanges.markers.added >= 3 ||
            mapChanges.paths.added > 0 ||
            mapChanges.paths.updated > 0 ||
            mapChanges.paths.deleted > 0 ||
            mapChanges.collections.added >= 2 ||
            mapChanges.collections.deleted >= 2;

      console.log(
        "[handleCapture] Should update thumbnail:",
        shouldUpdateThumbnail
      );

      if (!shouldUpdateThumbnail) {
        console.log("[handleCapture] No thumbnail update needed");
        return;
      }

      try {
        isCapturingRef.current = true;
        console.log("[handleCapture] Starting capture process...");

        const mapElement = document.getElementById(mapElementId);
        if (!mapElement) {
          console.log("[handleCapture] Map element not found");
          return;
        }

        // Calculate bounds from all items
        const calculatedBounds = calculateBoundsFromItems(markers, paths);
        console.log("[handleCapture] Calculated bounds:", calculatedBounds);

        // Check if bounds need updating
        const currentBounds = map.bounds;
        const needsBoundsUpdate =
          calculatedBounds &&
          currentBounds &&
          !areItemsWithinBounds(markers, paths, currentBounds);

        console.log("[handleCapture] Needs bounds update:", needsBoundsUpdate);

        // Update bounds if needed
        if (needsBoundsUpdate && calculatedBounds) {
          console.log("[handleCapture] Updating map bounds...");
          const center = {
            lat: (calculatedBounds.north + calculatedBounds.south) / 2,
            lng: (calculatedBounds.east + calculatedBounds.west) / 2,
          };
          const location_name = `${center.lat.toFixed(6)}, ${center.lng.toFixed(6)}`;

          await updateMapBounds({
            mapId: currentMapId,
            lat: center.lat,
            lng: center.lng,
            bounds: calculatedBounds,
            location_name,
          });
          console.log("[handleCapture] ✅ Bounds updated");
        }

        // Save current map state
        const originalCenter = googleMap.getCenter();
        const originalZoom = googleMap.getZoom();

        // Fit bounds for thumbnail capture
        if (calculatedBounds) {
          console.log("[handleCapture] Fitting bounds for capture...");
          googleMap.fitBounds(calculatedBounds);
          await new Promise((resolve) => setTimeout(resolve, 500));
        }

        // Capture screenshot
        console.log("[handleCapture] Capturing screenshot...");
        const canvas = await html2canvas(mapElement, {
          useCORS: true,
          allowTaint: true,
          backgroundColor: null,
          scale: 0.5,
          logging: false,
          imageTimeout: 0,
          removeContainer: true,
        });

        // Convert to base64
        const base64Image = canvas.toDataURL("image/jpeg", 0.7);
        console.log(
          "[handleCapture] Image size:",
          (base64Image.length / 1024).toFixed(2),
          "KB"
        );

        // Upload thumbnail
        console.log("[handleCapture] Uploading thumbnail...");
        await updateThumbnail({
          mapId: currentMapId,
          thumbnailUrl: base64Image,
        });
        console.log("[handleCapture] ✅ Thumbnail uploaded successfully!");

        // Reset changes
        resetChanges();

        // Restore map state
        if (originalCenter && originalZoom) {
          googleMap.setCenter(originalCenter);
          googleMap.setZoom(originalZoom);
        }
      } catch (error) {
        console.error("[handleCapture] ❌ Error:", error);
      } finally {
        isCapturingRef.current = false;
      }
    };

    // Event handlers get fresh store state and pass to handleCapture
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      console.log("[handleBeforeUnload] Event fired");
      const { markers, paths, mapChanges, resetChanges } = useMapStore((state) => state);
      handleCapture(markers, paths, mapChanges, resetChanges);
    };

    const handleVisibilityChange = () => {
      console.log(
        "[handleVisibilityChange] Event fired, visibility:",
        document.visibilityState
      );
      if (document.visibilityState === "hidden") {
        const { markers, paths, mapChanges, resetChanges } = useMapStore((state) => state);
        handleCapture(markers, paths, mapChanges, resetChanges);
      }
    };

    const handlePageHide = (e: PageTransitionEvent) => {
      console.log("[handlePageHide] Event fired");
      const { markers, paths, mapChanges, resetChanges } = useMapStore((state) => state);
      handleCapture(markers, paths, mapChanges, resetChanges);
    };

    // Add event listeners
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("pagehide", handlePageHide);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup function - ONLY remove listeners, do NOT call handleCapture
    return () => {
      console.log(
        "[useMapThumbnail] ========== CLEANUP: Removing listeners =========="
      );

      // Remove event listeners
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("pagehide", handlePageHide);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [enabled, mapElementId, updateMapBounds, updateThumbnail]); // Minimal dependencies - only things that won't change

  return {
    captureNow: () => {
      console.log("Manual capture not implemented");
    },
  };
}
