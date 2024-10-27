import { collectionsEditSchema } from "@buzztrip/db/zod-schemas";
import { z } from "@hono/zod-openapi";
import { MapParamsSchema } from "../schema";

export const CollectionParamsSchema = MapParamsSchema.extend({
  collectionId: z
    .string()
    .min(36)
    .openapi({
      param: {
        name: "collectionId",
        in: "path",
        required: true,
      },
      example: "1f36c536-c8cf-4174-8ed4-3150c08212b5",
    }),
});

export const CollectionReturnSchema = z
  .object({
    collection: collectionsEditSchema,
  })
  .openapi("CollectionReturnSchema");

export const CreateCollectionSchema = collectionsEditSchema
  .omit({
    created_by: true,
  })
  .openapi("CreateCollectionSchema");

// Editing of a collection
export const EditCollectionSchema = collectionsEditSchema.openapi(
  "EditCollectionSchema"
);
