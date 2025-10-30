"use client";

import { useEffect, useRef, useCallback } from "react";
import { useMutation } from "convex/react";
import { api } from "@buzztrip/backend/api";
import type { Id } from "@buzztrip/backend/dataModel";
import html2canvas from "html2canvas";

interface UseMapThumbnailOptions {
  mapId: Id<"maps">;
  mapElementId: string;
  enabled?: boolean;
  shouldUpdate: () => boolean;
  resetChanges: () => void;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Custom hook to capture and update map thumbnails intelligently
 *
 * Features:
 * - Captures DOM snapshot of the map ONLY on page unload
 * - Uses change tracking from Zustand store to decide if update is needed
 * - Non-blocking, fast capture using sendBeacon fallback
 * - Converts to base64 and stores in Convex
 *
 * Strategy:
 * - Changes are tracked locally in the store (markers, paths, collections)
 * - Before page closes, we check if changes are significant enough
 * - If yes, capture and upload thumbnail
 * - If no, skip the capture to save bandwidth and processing
 *
 * @param options Configuration options for thumbnail generation
 * @returns Object with manual capture trigger if needed
 */
export function useMapThumbnail({
  mapId,
  mapElementId,
  enabled = true,
  shouldUpdate,
  resetChanges,
  onSuccess,
  onError,
}: UseMapThumbnailOptions) {
  const updateThumbnail = useMutation(api.maps.updateMapThumbnail);
  const isCapturingRef = useRef(false);

  /**
   * Captures the map screenshot and uploads to Convex
   * This is the core function that does the heavy lifting
   */
  const captureAndUpload = useCallback(async () => {
    if (!enabled || isCapturingRef.current) return;

    // Check if we should even bother updating
    if (!shouldUpdate()) {
      console.log("Skipping thumbnail update - no significant changes");
      return;
    }

    try {
      isCapturingRef.current = true;
      const mapElement = document.getElementById(mapElementId);

      if (!mapElement) {
        console.warn(`Map element with id "${mapElementId}" not found`);
        return;
      }

      console.log("Capturing map thumbnail...");

      // Capture the map using html2canvas
      const canvas = await html2canvas(mapElement, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        scale: 0.5, // Reduce scale to keep file size manageable (0.5x for performance)
        logging: false,
        imageTimeout: 0,
        removeContainer: true,
      });

      // Convert to base64
      const base64Image = canvas.toDataURL("image/jpeg", 0.7); // JPEG with 70% quality for smaller size

      // Upload to Convex
      await updateThumbnail({
        mapId,
        thumbnailUrl: base64Image,
      });

      console.log("Thumbnail updated successfully");
      resetChanges(); // Reset the change tracking after successful upload
      onSuccess?.();
    } catch (error) {
      console.error("Failed to capture map thumbnail:", error);
      onError?.(error as Error);
    } finally {
      isCapturingRef.current = false;
    }
  }, [
    enabled,
    shouldUpdate,
    mapElementId,
    mapId,
    updateThumbnail,
    resetChanges,
    onSuccess,
    onError,
  ]);

  /**
   * Non-blocking capture that tries to complete before page unload
   * Uses a combination of immediate capture and sendBeacon as fallback
   */
  const captureBeforeUnload = useCallback(() => {
    if (!enabled || !shouldUpdate()) return;

    // Start the capture process immediately
    // We fire this off and hope it completes before the page unloads
    captureAndUpload().catch((err) => {
      console.error("Failed to capture thumbnail on unload:", err);
    });
  }, [enabled, shouldUpdate, captureAndUpload]);

  /**
   * Handle page unload - this is where the magic happens
   */
  useEffect(() => {
    if (!enabled) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Don't show confirmation dialog, just capture
      captureBeforeUnload();
    };

    // Also handle visibility change (when user switches tabs)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        // User is leaving or hiding the tab - good time to capture
        captureBeforeUnload();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [enabled, captureBeforeUnload]);

  return {
    /**
     * Manually trigger a thumbnail capture (useful for testing or manual updates)
     */
    captureNow: captureAndUpload,
  };
}
