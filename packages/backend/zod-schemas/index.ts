import { zid } from "convex-helpers/server/zod";
import { refinedUserSchema } from "./auth-schema";
import { mapsSchema, mapUserSchema, markersEditSchema } from "./maps-schema";
import { placesEditSchema } from "./places-schema";
import { boundsSchema } from "./shared-schemas";

export * from "./auth-schema";
export * from "./maps-schema";
export * from "./places-schema";
export * from "./shared-schemas";
export * from "./paths-schema";

export const combinedMarkersSchema = markersEditSchema.extend({
  place_id: zid("places").optional(),
  place: placesEditSchema.extend({
    bounds: boundsSchema.nullable(),
  }),
});

export const userMapsSchema = mapsSchema.merge(mapUserSchema);

export const combinedMapUser = mapUserSchema.extend({
  user: refinedUserSchema,
});
