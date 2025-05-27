import { createDb } from "@buzztrip/db";
import { createRoute } from "@hono/zod-openapi";
import { ErrorSchema, MapParamsSchema, MapSchema } from "../../common/schema";
import { app } from "../../common/types";
import { captureException } from "@sentry/cloudflare";



export const getMapRoute = app.openapi(
  createRoute({
    method: "get",
    path: "/map/{mapId}",
    summary: "Get a map",
    request: { params: MapParamsSchema },
    responses: {
      200: {
        content: { "application/json": { schema: MapSchema } },
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
      const map = await db.query.maps.findFirst({
        where: (maps, { eq }) => eq(maps.map_id, mapId),
      });

      if (!map)
        return c.json(
          {
            code: "data_not_found",
            message: "Map not found",
            requestId: c.get("requestId"),
          },
          400
        );

      return c.json(map, 200);
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
