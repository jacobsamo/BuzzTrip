import { useMapStore } from "@/components/providers/map-state-provider";
import { fallbackStyle } from "@/components/show-path-icon";
import { Button } from "@/components/ui/button";
import { geoJsonToPaths, pathsToGeoJson } from "@/lib/geojson";
import { cn } from "@/lib/utils";
import { PathStyle, Path} from "@buzztrip/backend/types";
import { stylesSchema } from "@buzztrip/backend/zod-schemas";
import { useMap } from "@vis.gl/react-google-maps";
import {
  ChevronLeft,
  Circle,
  LineSquiggle,
  Minus,
  MousePointer2,
  RectangleHorizontal,
  Triangle,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  GeoJSONStoreFeatures,
  HexColor,
  TerraDraw,
  TerraDrawCircleMode,
  TerraDrawLineStringMode,
  TerraDrawPolygonMode,
  TerraDrawRectangleMode,
  TerraDrawSelectMode,
} from "terra-draw";
import { TerraDrawGoogleMapsAdapter } from "./terra-draw-google-maps-adapter";

type DrawingMode =
  | "static"
  | "select"
  | "polygon"
  | "linestring"
  | "circle"
  | "rectangle";

const ensureValidStyleOnFeature = (
  feature: GeoJSONStoreFeatures
): PathStyle => {
  const parsed = stylesSchema.safeParse(feature.properties.styles);
  if (parsed.success) {
    return parsed.data;
  } else {
    feature.properties.styles = fallbackStyle;
    return fallbackStyle;
  }
};

const DrawingTest = () => {
  const {
    isMobile,
    searchValue,
    uiState,
    setUiState,
    activeState,
    map,
    paths,
    setActiveState,
    terraDrawInstance,
    setTerraDrawInstance,
  } = useMapStore((state) => state);
  const googleMap = useMap();
  const adapterRef = useRef<TerraDrawGoogleMapsAdapter | null>(null);
  const [mode, setMode] = useState<DrawingMode>("static");
  const [isReady, setIsReady] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const initTimeoutRef = useRef<NodeJS.Timeout>(null);
  const pathsLoadedRef = useRef(false);

  // First useEffect: Check if Google Map is ready
  useEffect(() => {
    if (!googleMap) return;

    const checkMapReady = () => {
      try {
        // More comprehensive readiness checks
        const hasCenter =
          googleMap.getCenter() !== null && googleMap.getCenter() !== undefined;
        const hasZoom = typeof googleMap.getZoom() === "number";
        const hasDiv = googleMap.getDiv() !== null;
        const hasBounds =
          googleMap.getBounds() !== null && googleMap.getBounds() !== undefined;

        // Check if Google Maps API is fully loaded
        const hasGoogleMapsLib =
          typeof window !== "undefined" &&
          window.google &&
          window.google.maps &&
          window.google.maps.OverlayView;

        if (hasCenter && hasZoom && hasDiv && hasBounds && hasGoogleMapsLib) {
          console.log("Google Map is fully ready");
          setMapReady(true);
          return;
        }
      } catch (error) {
        console.log("Map not ready yet, will retry...", error);
      }

      // Retry after a short delay
      setTimeout(checkMapReady, 100);
    };

    // Start checking map readiness
    checkMapReady();
  }, [googleMap]);

  // Second useEffect: Initialize Terra Draw when map is ready
  useEffect(() => {
    if (!mapReady || !googleMap || isInitializing || terraDrawInstance) {
      return;
    }

    console.log("Map is ready, initializing Terra Draw...");
    setIsInitializing(true);

    // Add a timeout to detect if initialization is stuck
    initTimeoutRef.current = setTimeout(() => {
      console.error("Terra Draw initialization timed out after 10 seconds");
      setIsInitializing(false);
    }, 10000);

    let draw: TerraDraw | null = null;

    const initializeTerraDrawNow = async () => {
      try {
        const mapDiv = googleMap.getDiv();
        if (!mapDiv) {
          throw new Error("Map div not available");
        }

        // Ensure map div has an ID
        if (!mapDiv.id) {
          mapDiv.id = "google-map-map";
          console.log("Set map div ID:", mapDiv.id);
        }

        console.log("Creating Terra Draw adapter...");
        const adapter = new TerraDrawGoogleMapsAdapter({
          lib: window.google.maps,
          map: googleMap,
          coordinatePrecision: 6,
        });

        adapterRef.current = adapter;
        console.log("Adapter created, setting up modes...");

        // Create modes
        const modes = [
          new TerraDrawSelectMode({
            flags: {
              polygon: {
                feature: {
                  draggable: true,
                  coordinates: {
                    midpoints: true,
                    draggable: true,
                    deletable: true,
                  },
                },
              },
              linestring: {
                feature: {
                  draggable: true,
                  coordinates: {
                    midpoints: true,
                    draggable: true,
                    deletable: true,
                  },
                },
              },
              circle: {
                feature: {
                  draggable: true,
                  coordinates: {
                    midpoints: true,
                    draggable: true,
                    deletable: true,
                  },
                },
              },
              rectangle: {
                feature: {
                  draggable: true,
                  coordinates: {
                    midpoints: true,
                    draggable: true,
                    deletable: true,
                  },
                },
              },
            },
          }),
          new TerraDrawPolygonMode({
            styles: {
              fillColor: (feature) =>
                (ensureValidStyleOnFeature(feature).fillColor ??
                  fallbackStyle.fillColor) as HexColor,
              fillOpacity: (feature) =>
                ensureValidStyleOnFeature(feature).fillOpacity ??
                fallbackStyle.fillOpacity,
              outlineColor: (feature) =>
                (ensureValidStyleOnFeature(feature).strokeColor ??
                  fallbackStyle.strokeColor) as HexColor,
            },
          }),
          new TerraDrawLineStringMode({
            styles: {
              lineStringColor: (feature) =>
                (ensureValidStyleOnFeature(feature).fillColor ??
                  fallbackStyle.fillColor) as HexColor,
              lineStringWidth: (feature) =>
                ensureValidStyleOnFeature(feature).strokeWidth ??
                fallbackStyle.strokeWidth,
            },
          }),
          new TerraDrawCircleMode({
            styles: {
              fillColor: (feature) =>
                (ensureValidStyleOnFeature(feature).fillColor ??
                  fallbackStyle.fillColor) as HexColor,
              fillOpacity: (feature) =>
                ensureValidStyleOnFeature(feature).fillOpacity ??
                fallbackStyle.fillOpacity,
              outlineColor: (feature) =>
                (ensureValidStyleOnFeature(feature).strokeColor ??
                  fallbackStyle.strokeColor) as HexColor,
            },
          }),
          new TerraDrawRectangleMode({
            styles: {
              fillColor: (feature) =>
                (ensureValidStyleOnFeature(feature).fillColor ??
                  fallbackStyle.fillColor) as HexColor,
              fillOpacity: (feature) =>
                ensureValidStyleOnFeature(feature).fillOpacity ??
                fallbackStyle.fillOpacity,
              outlineColor: (feature) =>
                (ensureValidStyleOnFeature(feature).strokeColor ??
                  fallbackStyle.strokeColor) as HexColor,
            },
          }),
        ];

        console.log("Creating Terra Draw instance...");
        draw = new TerraDraw({
          adapter,
          modes,
        });

        // Set up event listeners before starting
        draw.on("ready", () => {
          if (!draw) return;

          console.log("Terra Draw is ready!");
          if (initTimeoutRef.current) {
            clearTimeout(initTimeoutRef.current);
          }
          setIsReady(true);
          setIsInitializing(false);
        });

        draw.on("finish", (id, context) => {
          if (!draw) return;

          console.log("Drawing finished:", { id, context });
          const features = draw.getSnapshot();
          const feature = features.find((f) => f.id === id);

          if (feature && context.action === "draw") {
            console.log("Feature created:", feature);

            const path = geoJsonToPaths([feature], map._id);
            if (!path || path.length === 0 || !path[0]) {
              console.error("No valid path created from feature");
              return;
            }
            setActiveState({
              event: "paths:create",
              payload: {
                ...path[0],
              },
            });
          }
        });

        draw.on('select', (id) => {
  if (activeState?.event !== "paths:update") {
    const features = draw?.getSnapshot()
    const feature = features?.find(f => f.properties._id === id)
    const path: Path = {
      ...feature?.properties as Path
    }
    setActiveState({event: "paths:update", payload: path});
  }
});
        console.log("Starting Terra Draw...");
        draw.start();
        setTerraDrawInstance(draw);
      } catch (error) {
        console.error("Error initializing Terra Draw:", error);
        setIsInitializing(false);
        if (initTimeoutRef.current) {
          clearTimeout(initTimeoutRef.current);
        }
      }
    };

    // Initialize immediately since we know the map is ready
    initializeTerraDrawNow();

    return () => {
      console.log("Cleaning up Terra Draw...");
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
      }
      if (draw) {
        try {
          draw.stop();
        } catch (error) {
          console.error("Error stopping Terra Draw:", error);
        }
      }
      setTerraDrawInstance(null);
      adapterRef.current = null;
      setIsReady(false);
      setIsInitializing(false);
      pathsLoadedRef.current = false;
    };
  }, [mapReady, googleMap]); // Only depend on mapReady, not uiState

  // Third useEffect: Load existing paths when Terra Draw is ready
  useEffect(() => {
    if (paths && terraDrawInstance && isReady && !pathsLoadedRef.current) {
      console.log("Loading existing paths into Terra Draw...");
      try {
        const geoJsonPaths = pathsToGeoJson(paths);

        terraDrawInstance.addFeatures(geoJsonPaths);
        pathsLoadedRef.current = true;
      } catch (error) {
        console.error("Error loading paths:", error);
      }
    }
  }, [paths, terraDrawInstance, isReady]);

  const setDrawingMode = useCallback(
    (newMode: DrawingMode | null) => {
      if (!terraDrawInstance || !isReady) {
        console.warn("Terra Draw not ready");
        return;
      }

      try {
        const targetMode = newMode ?? "select";
        console.log("Setting mode to:", targetMode);
        terraDrawInstance.setMode(targetMode);
        setMode(targetMode as DrawingMode);
      } catch (error) {
        console.error("Error setting drawing mode:", error);
      }
    },
    [terraDrawInstance, isReady]
  );

  useEffect(() => {
    if (uiState === "paths") {
      setDrawingMode("select");
    }

    if (uiState !== "paths" && mode !== "static") {
      setDrawingMode("static");
    }
  }, [uiState]);

  const getFeature = (pathId: string) => {}


  useEffect(() => {
    if (activeState?.event === "path:update") {
    }
  }, [activeState]);

  // Show loading state while initializing
  if (isInitializing && uiState === "paths") {
    return (
      <div
        className={cn(
          "fixed flex flex-col md:flex-row gap-2 items-center justify-start z-50",
          {
            "right-2 top-2 flex-col": isMobile,
            "top-[68px] left-[400px] flex-row": !isMobile,
          }
        )}
      >
        <Button
          variant="outline"
          size="icon"
          onClick={() => setUiState("default")}
        >
          <ChevronLeft />
        </Button>
        <div className="px-4 py-2 bg-gray-100 rounded-md text-sm">
          Loading drawing tools...
        </div>
      </div>
    );
  }

  if (uiState !== "paths") {
    return (
      <Button
        variant="outline"
        size="icon"
        className={cn("fixed z-50", {
          "right-2 top-2": isMobile,
          "top-[68px] left-[400px]": !isMobile,
          "z-0": searchValue && !isMobile,
        })}
        onClick={() => setUiState("paths")}
      >
        <LineSquiggle />
      </Button>
    );
  }

  return (
    <div
      className={cn(
        "fixed flex flex-col md:flex-row gap-2 items-center justify-start z-50",
        {
          "right-2 top-2 flex-col": isMobile,
          "top-[68px] left-[360px] flex-row": !isMobile,
        }
      )}
    >
      <Button
        variant="outline"
        size="icon"
        className={cn(" z-50", {
          "z-0": searchValue && !isMobile,
        })}
        onClick={() => setUiState("default")}
      >
        <ChevronLeft />
      </Button>

      {/* Select Mode */}
      <Button
        variant="outline"
        size="icon"
        className={cn("z-50", {
          "scale-105 border-2 border-blue-500 shadow-lg bg-blue-100":
            mode === "select",
          "z-0": searchValue && !isMobile,
        })}
        onClick={() => setDrawingMode("select")}
        disabled={!isReady}
        title="Select and edit shapes"
      >
        <MousePointer2 />
      </Button>

      {/* Line Mode */}
      <Button
        variant="outline"
        size="icon"
        className={cn("z-50", {
          "scale-105 border-2 border-purple-500 shadow-lg bg-purple-100":
            mode === "linestring",
          "z-0": searchValue && !isMobile,
        })}
        onClick={() => setDrawingMode("linestring")}
        disabled={!isReady}
        title="Draw lines"
      >
        <Minus />
      </Button>

      {/* Polygon Mode */}
      <Button
        variant="outline"
        size="icon"
        className={cn("z-50", {
          "scale-105 border-2 border-green-500 shadow-lg bg-green-100":
            mode === "polygon",
          "z-0": searchValue && !isMobile,
        })}
        onClick={() => setDrawingMode("polygon")}
        disabled={!isReady}
        title="Draw polygons"
      >
        <Triangle />
      </Button>

      {/* Rectangle Mode */}
      <Button
        variant="outline"
        size="icon"
        className={cn("z-50", {
          "scale-105 border-2 border-red-500 shadow-lg bg-red-100":
            mode === "rectangle",
          "z-0": searchValue && !isMobile,
        })}
        onClick={() => setDrawingMode("rectangle")}
        disabled={!isReady}
        title="Draw rectangles"
      >
        <RectangleHorizontal />
      </Button>

      {/* Circle Mode */}
      <Button
        variant="outline"
        size="icon"
        className={cn("z-50", {
          "scale-105 border-2 border-orange-500 shadow-lg bg-orange-100":
            mode === "circle",
          "z-0": searchValue && !isMobile,
        })}
        onClick={() => setDrawingMode("circle")}
        disabled={!isReady}
        title="Draw circles"
      >
        <Circle />
      </Button>
    </div>
  );
};

export default DrawingTest;
