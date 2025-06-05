import { zid } from "convex-helpers/server/zod";
import { mapsSchema, mapUserSchema, markersSchema } from "./maps-schema";
import { placesSchema } from "./places-schema";
import { boundsSchema } from "./shared-schemas";

export * from "./auth-schema";
export * from "./maps-schema";
export * from "./places-schema";
export * from "./shared-schemas";

export const combinedMarkersSchema = placesSchema.extend({
  ...markersSchema.shape,
  created_by: zid("users"),
  place_id: zid("places").optional(),
  bounds: boundsSchema.nullable(),
});

export const userMapsSchema = mapsSchema.merge(mapUserSchema);
