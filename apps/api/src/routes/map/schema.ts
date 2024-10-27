import {
  collection_markersSchema,
  collectionsSchema,
  combinedMarkersSchema,
  map_usersSchema,
  mapsSchema,
} from "@buzztrip/db/zod-schemas";
import { z } from "@hono/zod-openapi";

export const MapParamsSchema = z.object({
  mapId: z
    .string()
    .min(36)
    .openapi({
      param: {
        name: "mapId",
        in: "path",
        required: true,
      },
      example: "1f36c536-c8cf-4174-8ed4-3150c08212b5",
    }),
});

export const MapSchema = mapsSchema.openapi("MapsSchema");

export const MapDataSchema = z
  .object({
    markers: combinedMarkersSchema.array(),
    collections: collectionsSchema.array(),
    collection_markers: collection_markersSchema.array(),
    mapUsers: map_usersSchema.array(),
    map: mapsSchema,
  })
  .openapi("MapDataSchema");

// Creating a map
export const CreateMapSchema = z
  .object({
    title: z.string().openapi({ example: "My Map" }),
    description: z
      .string()
      .nullish()
      .openapi({ example: "An awesome trip across Australia" }),
    owner_id: z
      .string()
      .openapi({ example: "user_2lmIzCk7BhX5a5MwvgITlFjkoLH" }),
  })
  .openapi("CreateMapSchema");

export const CreateMapReturnSchema = z
  .object({
    map: mapsSchema.optional(),
    mapUser: map_usersSchema.optional(),
  })
  .openapi("CreateMapReturnSchema");

// Editing of a map
export const EditMapSchema = z
  .object({
    map_id: z.string().openapi({
      param: { name: "mapId", in: "path", required: true },
      example: "1f36c536-c8cf-4174-8ed4-3150c08212b5",
    }),
    title: z.string().optional().openapi({ example: "My Map" }),
    description: z
      .string()
      .nullish()
      .openapi({ example: "An awesome trip across Australia" }),
    owner_id: z
      .string()
      .openapi({ example: "user_2lmIzCk7BhX5a5MwvgITlFjkoLH" }),
    image: z
      .string()
      .optional()
      .openapi({ example: "https://example.com/image.png" }),
  })
  .openapi("EditMapSchema");
