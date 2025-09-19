import { pathsToGeoJson } from "@/lib/geojson";
import { ActiveState } from "@/lib/stores/default-state";
import { Path } from "@buzztrip/backend/types";
import { useEffect, useRef } from "react";
import { TerraDraw, TerraDrawExtend } from "terra-draw";

const drawingModes = [
  "static",
  "select",
  "polygon",
  "linestring",
  "circle",
  "rectangle",
] as const;

export type DrawingMode = (typeof drawingModes)[number];

export type FeatureId = TerraDrawExtend.FeatureId;

export interface UseTerraDrawSyncProps {
  terraDrawInstance: TerraDraw | null;
  isReady: boolean;
  paths: Path[] | null;
  activeState: ActiveState | null;
  prevState: ActiveState | null;
  uiState: string;
  mode: DrawingMode;
  setDrawingMode: (mode: DrawingMode | null) => void;
}

/**
 * Custom hook that handles synchronization between Terra Draw and the application state.
 * This includes:
 * - Syncing paths changes (add, update, delete)
 * - Handling active state dismissal (form close/cancel)
 * - Managing feature selection and mode changes
 */
export const useTerraDrawSync = ({
  terraDrawInstance,
  isReady,
  paths,
  activeState,
  prevState,
  uiState,
  mode,
  setDrawingMode,
}: UseTerraDrawSyncProps) => {
  const prevPathRef = useRef<Path[] | null>(null);
  const featureIdMap = useRef(new Map<string, FeatureId>());

  /**
   * Diff function to detect changes in paths
   * @param prevPaths - previous paths
   * @param newPaths - new paths
   * @returns {deleted, changed, added} - deleted, changed, added paths
   */
  const diffPaths = (prevPaths: Path[], newPaths: Path[]) => {
    const deleted: Path[] = [];
    const changed: Path[] = [];
    const added: Path[] = [];

    const newMap = new Map(newPaths.map((p) => [p._id, p]));
    const prevMap = new Map(prevPaths.map((p) => [p._id, p]));

    // check for deleted + changed
    for (const prev of prevPaths) {
      const current = newMap.get(prev._id);

      if (!current) {
        deleted.push(prev);
      } else if (JSON.stringify(prev) !== JSON.stringify(current)) {
        changed.push(current);
      }
    }

    // check for added
    for (const curr of newPaths) {
      if (!prevMap.has(curr._id)) {
        added.push(curr);
      }
    }

    return { deleted, changed, added };
  };

  /**
   * Sync paths changes with Terra Draw
   * @param fullRefresh - if true, will do a full refresh with the paths in the store
   */
  const syncPaths = (fullRefresh: boolean = false) => {
    if (!paths || !terraDrawInstance || !isReady) return;

    const prevPaths = prevPathRef.current;
    const snapShot = terraDrawInstance.getSnapshot();
    featureIdMap.current = new Map(
      snapShot
        .filter((f) => f.properties._id !== undefined || f.id !== undefined)
        .map((f) => [f.properties._id as string, f.id as FeatureId])
    );

    // --- First load ---
    if (!prevPaths) {
      const geoJson = pathsToGeoJson(paths);
      const validation = terraDrawInstance.addFeatures(geoJson);
      console.log("Validation return", validation);

      prevPathRef.current = paths;
      return;
    }

    if (prevPaths && fullRefresh) {
      // first we need to remove all features
      const featureIds = Array.from(featureIdMap.current.values());
      terraDrawInstance.removeFeatures(featureIds);

      // then we need to add the new features
      const geoJson = pathsToGeoJson(paths);
      terraDrawInstance.addFeatures(geoJson);

      prevPathRef.current = paths;
      return;
    }

    // --- Subsequent updates ---
    const { deleted, changed, added } = diffPaths(prevPaths, paths);
    console.log("Diff", {
      featureIdMap: featureIdMap.current,
      deleted,
      changed,
      added,
      prevPaths,
    });

    // handle deleted
    if (deleted.length > 0) {
      const featureIds = deleted
        .map((p) => featureIdMap.current.get(p._id))
        .filter((id): id is FeatureId => id !== undefined);

      terraDrawInstance.removeFeatures(featureIds);
    }

    // handle changed
    if (changed.length > 0) {
      const toRemove = changed
        .map((p) => featureIdMap.current.get(p._id))
        .filter((id): id is FeatureId => id !== undefined);
      terraDrawInstance.removeFeatures(toRemove);

      const newGeoJson = pathsToGeoJson(changed);
      terraDrawInstance.addFeatures(newGeoJson);
    }

    // handle added
    if (added.length > 0) {
      const undefinedItem = featureIdMap.current.get(undefined as any);
      if (!undefinedItem) {
        console.log("No feature found", undefinedItem, featureIdMap.current);
        return;
      }
      terraDrawInstance.removeFeatures([undefinedItem]);

      const newGeoJson = pathsToGeoJson(added);
      console.log("Removed item new geoJson", {
        added,
        newGeoJson,
        undefinedItem,
      });
      terraDrawInstance.addFeatures(newGeoJson);
    }

    // update ref for next run
    prevPathRef.current = paths;
  };

  /**
   * Handle active state dismissal - resync Terra Draw with store state
   */
  const handleActiveStateDismissal = () => {
    if (!terraDrawInstance || !isReady) return;

    // If activeState becomes null (form dismissed), we need to resync Terra Draw
    const shouldResync =   !activeState && !prevState && uiState === "paths" &&
    ["select", "polygon", "linestring", "circle", "rectangle"].includes(mode)
    console.log("shouldResync", {
      activeState,
      prevState,
      mode,
      uiState,
      shouldResync,
    });
    if (
      shouldResync
    ) {
      console.log("ActiveState dismissed, resyncing Terra Draw state");

      // Clear any current selection by resetting mode
      // This will automatically deselect any selected features
      syncPaths(true);

      // Reset to appropriate mode based on uiState
      if (uiState === "paths") {
        setDrawingMode("select");
      } else {
        setDrawingMode("static");
      }
    }
  };

  // Effect for syncing paths changes
  useEffect(() => {
    syncPaths();
  }, [paths, terraDrawInstance, isReady]);

  // Effect for handling active state dismissal
  // useEffect(() => {
  //   handleActiveStateDismissal();
  // }, [activeState, terraDrawInstance, isReady, mode, uiState, setDrawingMode]);

  // Return utilities that might be useful
  return {
    featureIdMap: featureIdMap.current,
    syncPaths,
    handleActiveStateDismissal,
  };
};
