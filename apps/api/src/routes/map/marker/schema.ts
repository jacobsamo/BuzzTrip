import {
  collection_linksSchema,
  combinedMarkersSchema,
} from "@buzztrip/db/zod-schemas";
import { z } from "@hono/zod-openapi";
import { MapParamsSchema } from "../schema";

export const MarkerParamsSchema = MapParamsSchema.extend({
  markerId: z
    .string()
    .min(36)
    .openapi({
      param: {
        name: "markerId",
        in: "path",
        required: true,
      },
      example: "1f36c536-c8cf-4174-8ed4-3150c08212b5",
    }),
});

export const CreateMarkerSchema = z
  .object({
    marker: combinedMarkersSchema,
    collectionIds: z.string().array().nullish(),
  })
  .openapi("CreateMarkerSchema");

export const CreateMarkersReturnSchema = z
  .object({
    markers: combinedMarkersSchema.array(),
    collectionLinks: collection_linksSchema.array().nullable(),
  })
  .openapi("CreateMarkersReturnSchema");

// Edit a marker
export const EditMarkerSchema = z
  .object({
    marker_id: z.string(),
    marker: combinedMarkersSchema,
    collectionIds_to_add: z.string().array().optional(),
    collectionIds_to_remove: z.string().array().optional(),
  })
  .openapi("EditMarkerSchema");

export const EditMarkerReturnSchema = z
  .object({
    collectionLinksDeleted: z
      .string()
      .array()
      .nullable()
      .openapi({ description: "An array of collection ids that were deleted" }),
    collectionLinksCreated: collection_linksSchema.array().nullable(),
    marker: combinedMarkersSchema,
  })
  .openapi("EditMarkerReturnSchema");
