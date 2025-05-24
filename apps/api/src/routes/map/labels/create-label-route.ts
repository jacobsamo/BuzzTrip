import { createDb } from "@buzztrip/db";
import { labels } from "@buzztrip/db/schemas";
import { labelsEditSchema, labelsSchema } from "@buzztrip/db/zod-schemas";
import { createRoute, z } from "@hono/zod-openapi";
import { captureException } from "@sentry/cloudflare";
import { ErrorSchema, MapParamsSchema } from "../../../common/schema";
import { app } from "../../../common/types";

export const CreateLabelSchema = labelsEditSchema.array();

export const CreateLabelReturnSchema = z.object({
  labels: labelsSchema.array(),
});

export const createLabelRoute = app.openapi(
  createRoute({
    method: "post",
    path: "/map/{mapId}/labels",
    summary: "Create a label for a map",
    request: {
      params: MapParamsSchema,
      body: {
        content: { "application/json": { schema: CreateLabelSchema } },
      },
    },
    responses: {
      200: {
        content: {
          "application/json": {
            schema: CreateLabelReturnSchema,
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
      404: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Returns an error if map not found",
      },
    },
  }),
  async (c) => {
    try {
      const { mapId } = c.req.valid("param");
      const newLabels = c.req.valid("json");
      const db = createDb(c.env.TURSO_CONNECTION_URL, c.env.TURSO_AUTH_TOKEN);

      const createdLabels = await db
        .insert(labels)
        .values(newLabels.map((label) => ({ ...label, map_id: mapId })))
        .returning();

      if (!createdLabels) {
        throw Error("Failed to create label");
      }

      return c.json(
        {
          labels: createdLabels,
        },
        200
      );
    } catch (error) {
      console.error(error);
      captureException(error);
      return c.json(
        {
          code: "failed_to_object",
          message: "Failed to create label",
          requestId: c.get("requestId"),
        },
        400
      );
    }
  }
);
