import { createDb } from "@buzztrip/db";
import { labels } from "@buzztrip/db/schemas";
import { createRoute } from "@hono/zod-openapi";
import { captureException } from "@sentry/cloudflare";
import { and, eq } from "drizzle-orm";
import { ErrorSchema, SuccessfulDeleteSchema } from "../../../common/schema";
import { app } from "../../../common/types";
import { LabelParamsSchema } from "./schema";

export const deleteLabelRoute = app.openapi(
  createRoute({
    method: "delete",
    path: "/map/{mapId}/labels/{labelId}",
    summary: "Delete a label from a map",
    request: { params: LabelParamsSchema },
    responses: {
      200: {
        content: { "application/json": { schema: SuccessfulDeleteSchema } },
        description: "Label deleted successfully",
      },
      400: {
        content: { "application/json": { schema: ErrorSchema } },
        description: "Error",
      },
      401: {
        content: { "application/json": { schema: ErrorSchema } },
        description: "Unauthorized",
      },
    },
  }),
  async (c) => {
    try {
      const { mapId, labelId } = c.req.valid("param");
      const db = createDb(c.env.TURSO_CONNECTION_URL, c.env.TURSO_AUTH_TOKEN);

      const [deleteLabel] = await db
        .delete(labels)
        .where(and(eq(labels.map_id, mapId), eq(labels.label_id, labelId)))
        .returning({
          deletedId: labels.label_id,
        });

      return c.json(
        {
          code: "success",
          message: "Label deleted successfully",
          deletedId: deleteLabel.deletedId,
          requestId: c.get("requestId"),
        },
        200
      );
    } catch (error) {
      console.error(error);
      captureException(error);
      return c.json(
        {
          code: "data_not_found",
          message: "Map not found",
          requestId: c.get("requestId"),
        },
        400
      );
    }
  }
);
