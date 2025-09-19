import { zid } from "convex-helpers/server/zod";
import * as z from "zod";
import { defaultSchema, insertSchema } from "./shared-schemas";

// --- Constants ---
const pathTypes = ["text", "circle", "rectangle", "polygon", "line"] as const;
export const pathTypeEnum = z.enum(pathTypes);

/**
 * We are reimplementing a strict postion schema.
 * A postion is a set of cordinates which can either be `[x, y]` or `[x, y, z]`
 * ```ts
 * type Position = [x: number, y: number] | [x: number, y: number, z: number]
 * ```
 */
export const strictPosition = z.union([
  z.tuple([z.number(), z.number()]),
  z.tuple([z.number(), z.number(), z.number()]),
]);

// --- Measurements ---
export const baseMeasurements = z.object({
  perimeter: z.number(),
  area: z.number().optional(),
});

export const circleMeasurements = baseMeasurements.extend({
  radius: z.number(),
  diameter: z.number(),
});

export const rectangleMeasurements = baseMeasurements.extend({
  width: z.number(),
  height: z.number(),
});

export const lineMeasurements = baseMeasurements;

export const polygonMeasurements = baseMeasurements;

export const measurementsSchema = z.union([
  circleMeasurements,
  rectangleMeasurements,
  polygonMeasurements,
  lineMeasurements,
]);

// --- Styles ---
export const stylesSchema = z.object({
  strokeColor: z.string(),
  strokeOpacity: z.number().optional(),
  strokeWidth: z.number().optional(),
  fillColor: z.string().optional(),
  fillOpacity: z.number().optional(),
});

/**
 * Depending on the shape we can have different lots of points
 * 1. a single point this is just a position
 * 2 a line this is a position[]
 * 3. a polygon this can be a position[][]
 */
const pointsSchema = z.union([
  strictPosition,
  strictPosition.array(),
  strictPosition.array().array(),
]);

// --- Main Schema ---
export const pathsSchema = defaultSchema(
  z.object({
    mapId: zid("maps"),
    pathType: pathTypeEnum,
    title: z.string(),
    note: z.string().optional(),
    points: pointsSchema,
    measurements: measurementsSchema.optional(),
    styles: stylesSchema.optional(),
    createdBy: zid("users"),
    updatedAt: z.string().datetime().optional(), // allow optional for updates
  })
);

// --- Edit Schema ---
export const pathsEditSchema = insertSchema(pathsSchema).extend({
  createdBy: zid("users").optional(),
});
// Position | Position[] | Position[][]
