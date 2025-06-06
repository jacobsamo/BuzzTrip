import { zid } from "convex-helpers/server/zod";
import { mapsSchema, mapUserSchema, markersEditSchema, markersSchema } from "./maps-schema";
import { placesEditSchema, placesSchema } from "./places-schema";
import { boundsSchema } from "./shared-schemas";
import { z } from "zod";

export * from "./auth-schema";
export * from "./maps-schema";
export * from "./places-schema";
export * from "./shared-schemas";

export const combinedMarkersSchema = placesEditSchema.extend({
  ...markersEditSchema.shape,
  place_id: zid("places").optional(),
  bounds: boundsSchema.nullable(),
  note: z.string().optional(),
});

export const userMapsSchema = mapsSchema.merge(mapUserSchema);
