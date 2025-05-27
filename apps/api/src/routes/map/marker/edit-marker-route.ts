import { createDb } from "@buzztrip/db";
import { formatDateForSql } from "@buzztrip/db/helpers";
import { collection_links, markers } from "@buzztrip/db/schemas";
import { NewCollectionLink } from "@buzztrip/db/types";
import {
  collection_linksSchema,
  combinedMarkersSchema,
} from "@buzztrip/db/zod-schemas";
import { createRoute, z } from "@hono/zod-openapi";
import { captureException } from "@sentry/cloudflare";
import { and, eq } from "drizzle-orm";
import { ErrorSchema, MapParamsSchema } from "../../../common/schema";
import { app } from "../../../common/types";

export const MarkerParamsSchema = MapParamsSchema.extend({
  markerId: z.string().openapi({
    param: {
      name: "markerId",
      in: "path",
      required: true,
    },
    example: "1f36c536-c8cf-4174-8ed4-3150c08212b5",
  }),
});

export const EditMarkerSchema = z
  .object({
    marker_id: z.string(),
    marker: combinedMarkersSchema,
    collectionIds_to_add: z.string().array().optional(),
    collectionIds_to_remove: z.string().array().optional(),
    userId: z.string(),
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

export const editMarkerRoute = app.openapi(
  createRoute({
    method: "put",
    path: "/map/{mapId}/marker/{markerId}",
    summary: "Edit a marker",
    request: {
      params: MarkerParamsSchema,
      body: {
        content: { "application/json": { schema: EditMarkerSchema } },
      },
    },
    responses: {
      200: {
        content: {
          "application/json": {
            schema: EditMarkerReturnSchema,
          },
        },
        description: "Edit a marker",
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
      const { mapId, markerId } = c.req.valid("param");
      const editMarker = c.req.valid("json");
      const db = createDb(
        c.env.TURSO_CONNECTION_URL,
        c.env.TURSO_AUTH_TOKEN,
        c.env.ENVIRONMENT === "production"
      );

      let collectionLinksCreated: NewCollectionLink[] | null = null;
      let collectionLinksDeleted: string[] | null = null;

      if (editMarker.collectionIds_to_add) {
        await Promise.all(
          editMarker.collectionIds_to_add.map(async (collectionId) => {
            const collectionLink: NewCollectionLink = {
              marker_id: editMarker.marker_id,
              collection_id: collectionId,
              map_id: editMarker.marker.map_id,
              user_id: editMarker.userId,
            };

            const result = await db
              .insert(collection_links)
              .values(collectionLink)
              .returning();

            if (result) {
              collectionLinksCreated = collectionLinksCreated ?? [];
              collectionLinksCreated.push(...result);
            }
          })
        );
      }

      if (editMarker.collectionIds_to_remove) {
        await Promise.all(
          editMarker.collectionIds_to_remove.map(async (collectionId) => {
            await db
              .delete(collection_links)
              .where(
                and(
                  eq(collection_links.marker_id, markerId),
                  eq(collection_links.collection_id, collectionId)
                )
              );

            collectionLinksDeleted = collectionLinksDeleted ?? [];
            collectionLinksDeleted.push(collectionId);
          })
        );
      }

      await db
        .update(markers)
        .set({
          ...editMarker.marker,
          updated_at: formatDateForSql(new Date()),
        })
        .where(eq(markers.marker_id, markerId));

      return c.json(
        {
          collectionLinksDeleted: collectionLinksDeleted,
          collectionLinksCreated: collectionLinksCreated,
          marker: editMarker.marker,
        },
        200
      );
    } catch (error) {
      console.error(error);
      captureException(error);
      return c.json(
        {
          code: "failed_to_object",
          message: "Failed to edit marker",
          requestId: c.get("requestId"),
        },
        400
      );
    }
  }
);
