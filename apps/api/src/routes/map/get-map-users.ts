import { createDb } from "@buzztrip/db";
import { map_usersSchema, refinedUserSchema } from "@buzztrip/db/zod-schemas";
import { createRoute } from "@hono/zod-openapi";
import { captureException } from "@sentry/cloudflare";
import { ErrorSchema, MapParamsSchema } from "../../common/schema";
import { app } from "../../common/types";

export const GetMapUsersReturn = map_usersSchema
  .extend({
    user: refinedUserSchema,
  })
  .array()
  .nullable();

export const getMapUsers = app.openapi(
  createRoute({
    method: "get",
    path: "/map/{mapId}/users",
    summary: "Get a map",
    request: { params: MapParamsSchema },
    responses: {
      200: {
        content: { "application/json": { schema: GetMapUsersReturn } },
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
      const mapUsers = await db.query.map_users.findMany({
        where: (maps, { eq }) => eq(maps.map_id, mapId),
        with: {
          user: {
            columns: {
              id: true,
              email: true,
              username: true,
              first_name: true,
              last_name: true,
              name: true,
              image: true,
            },
          },
        },
      });

      return c.json(mapUsers, 200);
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
