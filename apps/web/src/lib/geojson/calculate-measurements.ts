import {
  CircleMeasurements,
  LineMeasurements,
  Measurements,
  PolygonMeasurements,
  RectangleMeasurements,
} from "@buzztrip/backend/types";
import * as turf from "@turf/turf";
import { Feature, LineString, Point, Polygon } from "geojson";

// Helper function to calculate circle measurements
export const calculateCircleMeasurements = (
  center: [number, number],
  radius: number // radius in meters
): CircleMeasurements => {
  // Create a circle polygon for area calculation
  const radiusInKm = radius / 1000;
  const circlePolygon = turf.circle(center, radiusInKm, {
    steps: 64, // More steps for better accuracy
    units: "kilometers",
  });

  // Calculate area using Turf (returns square meters)
  const area = turf.area(circlePolygon);

  // Calculate perimeter (circumference) = 2 * π * radius
  const perimeter = 2 * Math.PI * radius;

  // Calculate diameter
  const diameter = radius * 2;

  return {
    radius,
    diameter,
    perimeter,
    area,
  };
};

// Helper function to calculate rectangle measurements
export const calculateRectangleMeasurements = (
  bounds: [[number, number], [number, number]] // [[minLng, minLat], [maxLng, maxLat]]
): RectangleMeasurements => {
  const [[minLng, minLat], [maxLng, maxLat]] = bounds;

  // Create rectangle polygon
  const rectangleCoords = [
    [minLng, minLat],
    [maxLng, minLat],
    [maxLng, maxLat],
    [minLng, maxLat],
    [minLng, minLat], // Close the polygon
  ];
  const rectanglePolygon = turf.polygon([rectangleCoords]);

  // Calculate area using Turf (returns square meters)
  const area = turf.area(rectanglePolygon);

  // Calculate width and height using Turf distance
  const width = turf.distance([minLng, minLat], [maxLng, minLat], {
    units: "meters",
  });
  const height = turf.distance([minLng, minLat], [minLng, maxLat], {
    units: "meters",
  });

  // Calculate perimeter
  const perimeter = 2 * (width + height);

  return {
    width,
    height,
    perimeter,
    area,
  };
};

// Helper function to calculate line measurements
export const calculateLineMeasurements = (
  coordinates: [number, number][]
): LineMeasurements => {
  // Create line string
  const lineString = turf.lineString(coordinates);

  // Calculate total length using Turf (returns meters)
  const length = turf.length(lineString, { units: "meters" });

  return {
    perimeter: length,
    area: undefined, // Lines do not have area
  };
};

// Helper function to calculate polygon measurements
export const calculatePolygonMeasurements = (
  coordinates: number[][][] | number[][] // Can be single ring or multi-ring
): PolygonMeasurements => {
  // Normalize coordinates to multi-ring format
  if (!coordinates[0] || !coordinates[0][0]) {
    throw new Error("Invalid polygon coordinates");
  }

  const polygonCoords = Array.isArray(coordinates[0][0])
    ? (coordinates as number[][][])
    : [coordinates as number[][]];

  // Create polygon
  const polygon = turf.polygon(polygonCoords);

  // Calculate area using Turf (returns square meters)
  const area = turf.area(polygon);

  // Calculate perimeter by summing the length of all rings
  let perimeter = 0;
  for (const ring of polygonCoords) {
    // Create a line string for each ring to calculate its length
    if (!ring || ring.length < 2 || !ring[0]) {
      throw new Error("Invalid polygon ring");
    }
    const ringLine = turf.lineString([...ring, ring[0]]); // Ensure ring is closed
    perimeter += turf.length(ringLine, { units: "meters" });
  }

  return {
    perimeter,
    area,
  };
};

// Main function to calculate measurements based on path type
export const calculateMeasurements = (
  pathType: "circle" | "rectangle" | "polygon" | "line",
  points: any, // Using any since the points structure varies by type
  additionalData?: { radius?: number } // For circles, we might need the radius
): Measurements => {
  switch (pathType) {
    case "circle": {
      const center = points as [number, number];
      const radius = additionalData?.radius;

      if (!radius) {
        throw new Error("Radius is required for circle measurements");
      }

      return calculateCircleMeasurements(center, radius);
    }

    case "rectangle": {
      const bounds = points as [[number, number], [number, number]];
      return calculateRectangleMeasurements(bounds);
    }

    case "line": {
      const coordinates = points as [number, number][];
      return calculateLineMeasurements(coordinates);
    }

    case "polygon": {
      const coordinates = points as number[][][] | number[][];
      return calculatePolygonMeasurements(coordinates);
    }

    default:
      throw new Error(`Unsupported path type: ${pathType}`);
  }
};

// Helper function to calculate measurements from GeoJSON features
export const calculateMeasurementsFromGeoJSON = (
  feature: Feature<Polygon | LineString | Point>,
  pathType: "circle" | "rectangle" | "polygon" | "line"
): Measurements => {
  switch (feature.geometry.type) {
    case "Polygon": {
      if (pathType === "circle") {
        // For circles, we need to estimate the radius from the polygon
        const centroid = turf.centroid(feature);
        const center = centroid.geometry.coordinates as [number, number];

        // Get a point on the polygon boundary to estimate radius
        const coords = feature.geometry.coordinates[0];
        if (coords && coords.length > 0) {
          const boundaryPoint = coords[0] as [number, number];
          const radius = turf.distance(center, boundaryPoint, {
            units: "meters",
          });
          return calculateCircleMeasurements(center, radius);
        }
        throw new Error("Invalid circle polygon");
      } else if (pathType === "rectangle") {
        const bbox = turf.bbox(feature);
        const bounds: [[number, number], [number, number]] = [
          [bbox[0], bbox[1]],
          [bbox[2], bbox[3]],
        ];
        return calculateRectangleMeasurements(bounds);
      } else {
        return calculatePolygonMeasurements(feature.geometry.coordinates);
      }
    }

    case "LineString": {
      return calculateLineMeasurements(
        feature.geometry.coordinates as [number, number][]
      );
    }

    case "Point": {
      throw new Error("Cannot calculate measurements for a single point");
    }

    default:
      throw new Error(
        `Unsupported geometry type: ${(feature.geometry as any).type}`
      );
  }
};
