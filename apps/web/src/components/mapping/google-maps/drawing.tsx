import { useMapStore } from "@/components/providers/map-state-provider";
import { Button } from "@/components/ui/button";
import { geoJsonToPaths, pathsToGeoJson } from "@/lib/geojson";
import { cn } from "@/lib/utils";
import { PathStyle } from "@buzztrip/backend/types";
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
  X,
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

type DrawingMode = "select" | "polygon" | "linestring" | "circle" | "rectangle";

const fallbackStyle = {
  strokeColor: "#000000",
  strokeOpacity: 1,
  strokeWidth: 2,
  fillColor: "#FFFFFF",
  fillOpacity: 0.5,
};

const ensureValidStyleOnFeature = (
  feature: GeoJSONStoreFeatures
): PathStyle => {
  const parsed = stylesSchema.safeParse(feature.properties.styles);
  if (parsed.success) {
    return parsed.data;
  } else {
    console.warn("Invalid style found, using fallback:", parsed.error);
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
    map,
    paths,
    setActiveState,
  } = useMapStore((state) => state);
  const googleMap = useMap();
  const [terraDrawInstance, setTerraDrawInstance] = useState<TerraDraw | null>(
    null
  );
  const adapterRef = useRef<TerraDrawGoogleMapsAdapter | null>(null);
  const [mode, setMode] = useState<DrawingMode>("select");
  const [isReady, setIsReady] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const initTimeoutRef = useRef<NodeJS.Timeout>(null);

  if (!googleMap) return null;

  useEffect(() => {
    // Only initialize when we actually need drawing (paths UI is active)
    console.log("Map is ready, initializing Terra Draw...");

    // Prevent multiple initializations
    if (isInitializing || terraDrawInstance || !document) return;

    console.log("Starting Terra Draw initialization...");
    setIsInitializing(true);

    // Add a timeout to detect if initialization is stuck
    initTimeoutRef.current = setTimeout(() => {
      console.error("Terra Draw initialization timed out after 10 seconds");
      setIsInitializing(false);
    }, 10000);

    let draw: TerraDraw | null = null;

    // Wait for map to be fully ready
    const initializeTerraDrawWhenReady = () => {
      // Check if map is fully loaded
      if (
        typeof window === "undefined" ||
        !document ||
        !googleMap.getCenter() ||
        !googleMap.getZoom()
      ) {
        console.log("Map or window not ready, retrying...");
        setTimeout(initializeTerraDrawWhenReady, 100);
        return;
      }

      const mapDiv = googleMap.getDiv();
      if (!mapDiv) {
        console.log("Map div not ready, retrying...");
        setTimeout(initializeTerraDrawWhenReady, 100);
        return;
      }

      if (!mapDiv.id) {
        mapDiv.id = "google-map-container";
      }

      try {
        console.log("Map is ready, creating Terra Draw adapter...");
        const mapDiv = googleMap.getDiv();
        if (!mapDiv) {
          console.log("Map div not ready yet, retrying in 100ms...");
          setTimeout(initializeTerraDrawWhenReady, 100);
          return;
        }
        if (!mapDiv.id) {
          mapDiv.id = "google-map-container";
        }

        const adapter = new TerraDrawGoogleMapsAdapter({
          lib: google.maps,
          map: googleMap,
          coordinatePrecision: 6,
        });

        adapterRef.current = adapter;
        console.log("Adapter created, setting up modes...");

        // Simplified modes with minimal styling for faster initialization
        const modes = [
          new TerraDrawSelectMode({
            flags: {
              // Polygon
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
              // Line
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
              // Circle
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
              // Rectangle
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
                ensureValidStyleOnFeature(feature).fillOpacity ??
                fallbackStyle.fillOpacity,
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
        draw.start();
        console.log(
          "Terra Draw instance created, setting up event listeners..."
        );

        // Set up event listeners
        draw.on("ready", () => {
          if (!draw) return;

          console.log("Terra Draw is ready!");
          if (initTimeoutRef.current) {
            clearTimeout(initTimeoutRef.current);
          }
          draw.setMode("select");
          setMode("select");
          setIsReady(true);
          setIsInitializing(false);
        });

        draw.on("finish", (id, context) => {
          if (!draw) return;

          console.log("Drawing finished:", {
            id,
            context,
          });
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

        // draw.on("change", (ids) => {
        //   console.log("Features changed:", ids);
        // });

        draw.on("select", (ids) => {
          console.log("Features selected:", ids);
        });

        setTerraDrawInstance(draw);
        console.log("Starting Terra Draw...");
        draw.start();
      } catch (error) {
        console.error("Error initializing Terra Draw:", error);
        setIsInitializing(false);
        if (initTimeoutRef.current) {
          clearTimeout(initTimeoutRef.current);
        }
      }
    };

    // Start the initialization process
    initializeTerraDrawWhenReady();

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
    };
  }, [googleMap, uiState]);

  useEffect(() => {
    if (paths && terraDrawInstance) {
      const geoJsonPaths = pathsToGeoJson(paths);
      console.log("terra draw points", {
        paths,
        geoJsonPaths,
      });
      terraDrawInstance.addFeatures(geoJsonPaths);
    }
  }, [paths, terraDrawInstance]);

  const setDrawingMode = useCallback(
    (newMode: DrawingMode | null) => {
      if (!terraDrawInstance || !isReady) {
        console.warn("Terra Draw not ready");
        return;
      }

      try {
        const targetMode = newMode === null ? "select" : newMode;
        console.log("Setting mode to:", targetMode);
        terraDrawInstance.setMode(targetMode);
        setMode(targetMode as DrawingMode);
      } catch (error) {
        console.error("Error setting drawing mode:", error);
      }
    },
    [terraDrawInstance, isReady]
  );

  const clearDrawings = useCallback(() => {
    if (!terraDrawInstance || !isReady) return;

    try {
      terraDrawInstance.clear();
      console.log("All drawings cleared");
    } catch (error) {
      console.error("Error clearing drawings:", error);
    }
  }, [terraDrawInstance, isReady]);

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
          "top-[68px] left-[400px] flex-row": !isMobile,
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

      {/* Clear button */}
      <Button
        variant="destructive"
        size="icon"
        className="z-50"
        onClick={clearDrawings}
        disabled={!isReady}
        title="Clear all drawings"
      >
        <X />
      </Button>
    </div>
  );
};

export default DrawingTest;
