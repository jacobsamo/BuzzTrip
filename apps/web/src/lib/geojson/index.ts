import { Id } from "@buzztrip/backend/dataModel";
import { Measurements, NewPath, Path } from "@buzztrip/backend/types";
import * as turf from "@turf/turf";
import { Feature, LineString, Point, Polygon, Position } from "geojson";
import { calculateMeasurementsFromGeoJSON } from "./calculate-measurements";

// Types from your existing code
type JSON = string | number | boolean | null | JSONArray | JSONObject;
export interface JSONObject {
  [member: string]: JSON;
}
type JSONArray = Array<JSON>;
type DefinedProperties = Record<string, JSON>;
export type GeoJSONStoreGeometries = Polygon | LineString | Point;
export type BBoxPolygon = Feature<Polygon, DefinedProperties>;
export type GeoJSONStoreFeatures = Feature<
  GeoJSONStoreGeometries,
  DefinedProperties
>;

type DrawingMode = "polygon" | "circle" | "rectangle" | "linestring";

export const pathsToGeoJson = (paths: Path[]): GeoJSONStoreFeatures[] => {
  return paths.map((path) => {
    const properties: DefinedProperties = {
      path_id: path._id,
      title: path.title,
      note: path.note || null,
      measurements: path.measurements ?? null,
      styles: path.styles || null,
      createdBy: path.createdBy,
      mapId: path.mapId,
      mode: path.pathType === "line" ? "linestring" : path.pathType,
    };

    switch (path.pathType) {
      case "polygon": {
        // Handle polygon coordinates using Turf
        try {
          let coordinates: Position[][] = [];

          if (
            Array.isArray(path.points[0]) &&
            Array.isArray(path.points[0][0])
          ) {
            // Already in the correct format for polygon coordinates
            coordinates = path.points as Position[][];
          } else {
            // Single ring polygon
            coordinates = path.points as Position[][];
          }

          // Validate and create polygon using Turf
          const polygon = turf.polygon(coordinates);

          return {
            ...polygon,
            properties,
          };
        } catch (error) {
          console.error("Invalid polygon coordinates:", error);
          throw new Error("Invalid polygon coordinates");
        }
      }

      case "line": {
        // Handle line coordinates using Turf
        try {
          const lineString = turf.lineString(path.points as Position[]);

          return {
            ...lineString,
            properties,
          };
        } catch (error) {
          console.error("Invalid line coordinates:", error);
          throw new Error("Invalid line coordinates");
        }
      }

      case "circle": {
        // Convert circle to polygon using Turf's circle function
        try {
          // when we save a circle we save the center as the path.points
          const center = path.points as Position;
          const radius = (path.measurements as any).radius;

          // Turf.circle creates a polygon approximation of a circle
          // radius should be in kilometers for turf.circle
          const radiusInKm = radius / 1000; // Convert meters to kilometers
          const circlePolygon = turf.circle(center, radiusInKm, {
            // steps: 6, // Number of sides for the polygon approximation
            units: "kilometers",
          });

          return {
            ...circlePolygon,
            properties,
          };
        } catch (error) {
          console.error("Invalid circle parameters:", error);
          throw new Error("Invalid circle parameters");
        }
      }

      case "rectangle": {
        // Convert rectangle to polygon using Turf's polygon function
        try {
          const points = path.points as number[][];
          if (points.length < 2) {
            throw new Error("Rectangle requires at least 2 points");
          }

          if (!points[0] || !points[1]) {
            throw new Error("Invalid rectangle points");
          }

          const [minLng, minLat] = points[0];
          const [maxLng, maxLat] = points[1];

          if (!minLng || !minLat || !maxLng || !maxLat) {
            throw new Error("Invalid rectangle coordinates");
          }

          // Create rectangle coordinates (closed polygon)
          const rectangleCoords = [
            [minLng, minLat],
            [maxLng, minLat],
            [maxLng, maxLat],
            [minLng, maxLat],
            [minLng, minLat], // Close the polygon
          ];

          const rectanglePolygon = turf.polygon([rectangleCoords]);

          return {
            ...rectanglePolygon,
            properties,
          };
        } catch (error) {
          console.error("Invalid rectangle coordinates:", error);
          throw new Error("Invalid rectangle coordinates");
        }
      }

      default:
        throw new Error(`Unsupported path type: ${path.pathType}`);
    }
  });
};

export const geoJsonToPaths = (
  features: GeoJSONStoreFeatures[],
  mapId: string
): NewPath[] => {
  return features.map((feature) => {
    const mode = feature.properties?.["mode"] as DrawingMode;
    const pathType = mode === "linestring" ? "line" : mode;
    let calculatedMeasurements: Measurements = {
      perimeter: 0,
    };

    let path: NewPath = {
      title: (feature.properties?.["title"] as string) || "",
      note: (feature.properties?.["notes"] as string) || undefined,
      styles: (feature.properties?.["styles"] as any) || undefined,
      mapId: mapId as Id<"maps">,
      pathType: pathType as any,
      measurements: calculatedMeasurements,
      points: [], // temporarily empty, will be filled below
    };

    try {
      calculatedMeasurements = calculateMeasurementsFromGeoJSON(
        feature,
        pathType
      );
    } catch (error) {
      console.error(`Error calculating measurements for ${pathType}:`, error);
      // Fallback to existing measurements if calculation fails
      calculatedMeasurements = feature.properties?.["measurements"] as any;
    }

    // Use calculated measurements, fallback to existing if calculation failed
    path.measurements =
      calculatedMeasurements || (feature.properties?.["measurements"] as any);

    switch (feature.geometry.type) {
      case "Polygon": {
        if (mode === "circle") {
          // For circles, extract the center using Turf's centroid
          try {
            const centroid = turf.centroid(feature);
            path.points = centroid.geometry.coordinates as [number, number];
          } catch (error) {
            console.error("Error extracting circle center:", error);
          }
        } else if (mode === "rectangle") {
          // For rectangles, extract bounding box using Turf
          try {
            const bbox = turf.bbox(feature);
            // bbox returns [minLng, minLat, maxLng, maxLat]
            path.points = [
              [bbox[0], bbox[1]], // min corner
              [bbox[2], bbox[3]], // max corner
            ] as [[number, number], [number, number]];
          } catch (error) {
            console.error("Error extracting rectangle bounds:", error);
          }
        } else {
          // Regular polygon
          try {
            const coordinates = feature.geometry.coordinates;
            if (coordinates && coordinates.length > 0) {
              // Convert coordinates to the expected format
              if (!coordinates[0] || !coordinates[0][0]) {
                throw new Error("Invalid polygon coordinates");
              }
              const polygonPoints =
                coordinates.length === 1
                  ? coordinates[0].map(
                      (coord) => [coord[0], coord[1]] as [number, number]
                    )
                  : coordinates.map((ring) =>
                      ring.map(
                        (coord) => [coord[0], coord[1]] as [number, number]
                      )
                    );

              path.points = polygonPoints as any;
            }
          } catch (error) {
            console.error("Error processing polygon coordinates:", error);
          }
        }
        break;
      }

      case "LineString": {
        try {
          const coordinates = feature.geometry.coordinates;
          if (coordinates && Array.isArray(coordinates)) {
            // Validate coordinates using Turf
            const validatedLine = turf.lineString(coordinates);
            path.points = validatedLine.geometry.coordinates as [
              number,
              number,
            ][];
          }
        } catch (error) {
          console.error("Error processing line coordinates:", error);
        }
        break;
      }

      case "Point": {
        try {
          const coordinates = feature.geometry.coordinates;
          if (
            coordinates &&
            Array.isArray(coordinates) &&
            coordinates.length >= 2
          ) {
            // Validate point using Turf
            const validatedPoint = turf.point(coordinates);
            path.points = validatedPoint.geometry.coordinates as [
              number,
              number,
            ];
          }
        } catch (error) {
          console.error("Error processing point coordinates:", error);
        }
        break;
      }

      default:
        throw new Error(
          `Unsupported geometry type: ${(feature.geometry as any).type}`
        );
    }

    return path;
  });
};
