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
  debounceMs?: number;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Custom hook to capture and update map thumbnails
 *
 * Features:
 * - Captures DOM snapshot of the map
 * - Debounces updates to avoid constant regeneration
 * - Captures on page unload
 * - Converts to base64 and stores in Convex
 *
 * @param options Configuration options for thumbnail generation
 * @returns Object with manual capture trigger and loading state
 */
export function useMapThumbnail({
  mapId,
  mapElementId,
  enabled = true,
  debounceMs = 2000,
  onSuccess,
  onError,
}: UseMapThumbnailOptions) {
  const updateThumbnail = useMutation(api.maps.updateMapThumbnail);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isCapturingRef = useRef(false);
  const lastCaptureTimeRef = useRef<number>(0);

  /**
   * Captures the map screenshot and uploads to Convex
   */
  const captureAndUpload = useCallback(async () => {
    if (!enabled || isCapturingRef.current) return;

    try {
      isCapturingRef.current = true;
      const mapElement = document.getElementById(mapElementId);

      if (!mapElement) {
        console.warn(`Map element with id "${mapElementId}" not found`);
        return;
      }

      // Capture the map using html2canvas
      const canvas = await html2canvas(mapElement, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        scale: 0.5, // Reduce scale to keep file size manageable
        logging: false,
        imageTimeout: 0,
        removeContainer: true,
      });

      // Convert to base64
      const base64Image = canvas.toDataURL("image/jpeg", 0.7); // Use JPEG with 70% quality for smaller size

      // Upload to Convex
      await updateThumbnail({
        mapId,
        thumbnail: base64Image,
      });

      lastCaptureTimeRef.current = Date.now();
      onSuccess?.();
    } catch (error) {
      console.error("Failed to capture map thumbnail:", error);
      onError?.(error as Error);
    } finally {
      isCapturingRef.current = false;
    }
  }, [enabled, mapElementId, mapId, updateThumbnail, onSuccess, onError]);

  /**
   * Debounced version of capture and upload
   */
  const debouncedCapture = useCallback(() => {
    if (!enabled) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      captureAndUpload();
    }, debounceMs);
  }, [enabled, debounceMs, captureAndUpload]);

  /**
   * Handle page unload to capture final state
   */
  useEffect(() => {
    if (!enabled) return;

    const handleBeforeUnload = () => {
      // If it's been more than 5 seconds since last capture, trigger one more
      const timeSinceLastCapture = Date.now() - lastCaptureTimeRef.current;
      if (timeSinceLastCapture > 5000) {
        captureAndUpload();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [enabled, captureAndUpload]);

  return {
    /**
     * Manually trigger a thumbnail capture
     */
    captureThumbnail: debouncedCapture,
    /**
     * Immediately capture without debounce
     */
    captureNow: captureAndUpload,
  };
}
