import { createDb } from "@buzztrip/db";
import { labelsSchema } from "@buzztrip/db/zod-schemas";
import { createRoute } from "@hono/zod-openapi";
import { captureException } from "@sentry/cloudflare";
import { ErrorSchema, MapParamsSchema } from "../../../common/schema";
import { app } from "../../../common/types";

export const GetMapLabelsReturn = labelsSchema.array().nullable();

export const getMapLabelsRoute = app.openapi(
  createRoute({
    method: "get",
    path: "/map/{mapId}/labels",
    summary: "Get map labels",
    request: { params: MapParamsSchema },
    responses: {
      200: {
        content: { "application/json": { schema: GetMapLabelsReturn } },
        description: "Map found",
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
      const { mapId } = c.req.valid("param");
      const db = createDb(c.env.TURSO_CONNECTION_URL, c.env.TURSO_AUTH_TOKEN);
      const mapLabels = await db.query.labels.findMany({
        where: (maps, { eq }) => eq(maps.map_id, mapId),
      });

      return c.json(mapLabels, 200);
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
