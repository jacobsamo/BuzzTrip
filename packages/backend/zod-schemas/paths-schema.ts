import { zid } from "convex-helpers/server/zod";
import * as z from "zod";
import { defaultSchema, insertSchema } from "./shared-schemas";

// --- Constants ---
const pathTypes = ["circle", "rectangle", "polygon", "line"] as const;
export const pathTypeEnum = z.enum(pathTypes);

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
    measurements: measurementsSchema,
    styles: stylesSchema.optional(),
    createdBy: zid("users"),
    updatedAt: z.string().datetime().optional(), // allow optional for updates
  })
);

// --- Edit Schema ---
export const pathsEditSchema = insertSchema(pathsSchema).extend({
  createdBy: zid("users").optional(),
});;
// Position | Position[] | Position[][]
