import { createDb } from "@buzztrip/db";
import { collections } from "@buzztrip/db/schemas";
import { collectionsEditSchema } from "@buzztrip/db/zod-schemas";
import { createRoute, z } from "@hono/zod-openapi";
import { captureException } from "@sentry/cloudflare";
import { eq } from "drizzle-orm";
import { ErrorSchema, MapParamsSchema } from "../../../common/schema";
import { app } from "../../../common/types";

export const EditCollectionSchema = collectionsEditSchema.openapi(
  "EditCollectionSchema"
);

export const CollectionParamsSchema = MapParamsSchema.extend({
  collectionId: z.string().openapi({
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

export const editCollectionRoute = app.openapi(
  createRoute({
    method: "put",
    path: "/map/{mapId}/collection/{collectionId}",
    summary: "Edit a collection",
    request: {
      params: CollectionParamsSchema,
      body: {
        content: { "application/json": { schema: EditCollectionSchema } },
      },
    },
    responses: {
      200: {
        content: {
          "application/json": {
            schema: CollectionReturnSchema,
          },
        },
        description: "Edit a collection",
      },
      400: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Returns an error",
      },
      401: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Returns an error if user is not authenticated",
      },
    },
  }),
  async (c) => {
    try {
      const { mapId, collectionId } = c.req.valid("param");
      const editCollection = c.req.valid("json");
      const db = createDb(
        c.env.TURSO_CONNECTION_URL,
        c.env.TURSO_AUTH_TOKEN,
        c.env.ENVIRONMENT === "production"
      );

      const [updatedCollection] = await db
        .update(collections)
        .set(editCollection)
        .where(eq(collections.collection_id, collectionId))
        .returning();

      if (!updatedCollection) {
        throw Error("Failed to update collection");
      }

      return c.json(
        {
          collection: updatedCollection,
        },
        200
      );
    } catch (error) {
      console.error(error);
      captureException(error);
      return c.json(
        {
          code: "failed_to_object",
          message: "Failed to update collection",
          requestId: c.get("requestId"),
        },
        400
      );
    }
  }
);
