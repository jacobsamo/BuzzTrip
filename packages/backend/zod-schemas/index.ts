import { zid } from "convex-helpers/server/zod";
import { mapsSchema, mapUserSchema, markersEditSchema, markersSchema } from "./maps-schema";
import { placesEditSchema, placesSchema } from "./places-schema";
import { boundsSchema } from "./shared-schemas";
import { z } from "zod";
import { refinedUserSchema } from "./auth-schema";

export * from "./auth-schema";
export * from "./maps-schema";
export * from "./places-schema";
export * from "./shared-schemas";

export const combinedMarkersSchema = markersEditSchema.extend({
  place: placesEditSchema.extend({
    bounds: boundsSchema.nullable(),
  }),
})

export const userMapsSchema = mapsSchema.merge(mapUserSchema);


export const combinedMapUser = mapUserSchema.extend({
  user: refinedUserSchema
})