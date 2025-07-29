import { Id } from "@buzztrip/backend/dataModel";
import { NewPath, Path } from "@buzztrip/backend/types";
import * as turf from "@turf/turf";
import { Feature, LineString, Point, Polygon } from "geojson";
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
      id: path._id,
      title: path.title,
      notes: path.notes || null,
      measurements: path.measurements,
      styles: path.styles || null,
      createdBy: path.createdBy,
      mapId: path.mapId,
      mode: path.pathType === "line" ? "linestring" : path.pathType,
    };

    switch (path.pathType) {
      case "polygon": {
        // Handle polygon coordinates using Turf
        try {
          let coordinates: number[][][] = [];

          if (
            Array.isArray(path.points[0]) &&
            Array.isArray(path.points[0][0])
          ) {
            // Already in the correct format for polygon coordinates
            coordinates = path.points as number[][][];
          } else {
            // Single ring polygon
            coordinates = [path.points as number[][]];
          }

          // Validate and create polygon using Turf
          const polygon = turf.polygon(coordinates);

          return {
            type: "Feature",
            geometry: polygon.geometry,
            properties,
          } as Feature<Polygon, DefinedProperties>;
        } catch (error) {
          console.error("Invalid polygon coordinates:", error);
          throw new Error("Invalid polygon coordinates");
        }
      }

      case "line": {
        // Handle line coordinates using Turf
        try {
          const coordinates = path.points as number[][];
          const lineString = turf.lineString(coordinates);

          return {
            type: "Feature",
            geometry: lineString.geometry,
            properties,
          } as Feature<LineString, DefinedProperties>;
        } catch (error) {
          console.error("Invalid line coordinates:", error);
          throw new Error("Invalid line coordinates");
        }
      }

      case "circle": {
        // Convert circle to polygon using Turf's circle function
        try {
          const center = path.points as [number, number];
          const radius = (path.measurements as any).radius;

          // Turf.circle creates a polygon approximation of a circle
          // radius should be in kilometers for turf.circle
          const radiusInKm = radius / 1000; // Convert meters to kilometers
          const circlePolygon = turf.circle(center, radiusInKm, {
            steps: 32, // Number of sides for the polygon approximation
            units: "kilometers",
          });

          return {
            type: "Feature",
            geometry: circlePolygon.geometry,
            properties,
          } as Feature<Polygon, DefinedProperties>;
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
            type: "Feature",
            geometry: rectanglePolygon.geometry,
            properties,
          } as Feature<Polygon, DefinedProperties>;
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
): Partial<NewPath>[] => {
  return features.map((feature) => {
    const mode = feature.properties?.["mode"] as DrawingMode;
    const pathType = mode === "linestring" ? "line" : mode;

    let path: Partial<NewPath> = {
      title: (feature.properties?.["title"] as string) || "Untitled",
      notes: (feature.properties?.["notes"] as string) || undefined,
      styles: (feature.properties?.["styles"] as any) || undefined,
      //   createdBy: createdBy,
      mapId: mapId as Id<"maps">,
      pathType: pathType as any,
    };

    // Calculate measurements based on the geometry and path type
    let calculatedMeasurements;

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
