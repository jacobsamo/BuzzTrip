import { createDb } from "@buzztrip/db";
import { labels } from "@buzztrip/db/schemas";
import { labelsEditSchema, labelsSchema } from "@buzztrip/db/zod-schemas";
import { createRoute, z } from "@hono/zod-openapi";
import { captureException } from "@sentry/cloudflare";
import { and, eq } from "drizzle-orm";
import { ErrorSchema } from "../../../common/schema";
import { app } from "../../../common/types";
import { LabelParamsSchema } from "./schema";

export const EditLabelSchema = labelsEditSchema.openapi(
  "LabelCollectionSchema"
);

export const LabelReturnSchema = z
  .object({
    label: labelsSchema,
  })
  .openapi("labelReturnSchema");

export const updateLabelRoute = app.openapi(
  createRoute({
    method: "put",
    path: "/map/{mapId}/labels/{labelId}",
    summary: "Edit a collection",
    request: {
      params: LabelParamsSchema,
      body: {
        content: { "application/json": { schema: EditLabelSchema } },
      },
    },
    responses: {
      200: {
        content: {
          "application/json": {
            schema: LabelReturnSchema,
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
      const { mapId, labelId } = c.req.valid("param");
      const newLabel = c.req.valid("json");
      const db = createDb(c.env.TURSO_CONNECTION_URL, c.env.TURSO_AUTH_TOKEN);

      // TODO: Add authorization check here
      // Verify user owns the map or has permission to edit
      // Example: await verifyMapAccess(userId, mapId, db);

      console.log("newLabel", {
        newLabel,
        mapId,
        labelId,
      });
      const [updatedLabel] = await db
        .update(labels)
        .set(newLabel)
        .where(and(eq(labels.label_id, labelId), eq(labels.map_id, mapId)))
        .returning();

      if (!updatedLabel) {
        throw Error("Failed to update collection");
      }

      return c.json(
        {
          label: updatedLabel,
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
