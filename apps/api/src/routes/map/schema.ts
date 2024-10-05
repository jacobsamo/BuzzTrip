import { z } from "@hono/zod-openapi";
import {
  collectionsSchema,
  collection_markersSchema,
  mapsSchema,
  markersSchema,
  userMapsSchema,
  combinedMarkersSchema,
  map_usersSchema,
} from "@buzztrip/db/zod-schemas";

export const MapParamsSchema = z.object({
  mapId: z
    .string()
    .min(36)
    .openapi({
      param: {
        name: "userId",
        in: "path",
        required: true,
      },
      example: "1f36c536-c8cf-4174-8ed4-3150c08212b5",
    }),
});

export const MapSchema = z
  .object({
    data: mapsSchema,
  })
  .openapi("MapsSchema");

export const MapDataSchema = z.object({
  data: z.object({
    markers: combinedMarkersSchema.array(),
    collections: collectionsSchema.array(),
    collection_markers: collection_markersSchema.array(),
    mapUsers: map_usersSchema.array(),
    map: mapsSchema,
  }),
});
