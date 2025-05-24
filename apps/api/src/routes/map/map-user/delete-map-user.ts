import { createDb } from "@buzztrip/db";
import { map_users } from "@buzztrip/db/schemas";
import { createRoute, z } from "@hono/zod-openapi";
import { captureException } from "@sentry/cloudflare";
import { and, eq } from "drizzle-orm";
import {
  ErrorSchema,
  MapParamsSchema,
  SuccessfulDeleteSchema,
} from "../../../common/schema";
import { app } from "../../../common/types";
import { MapUserParamsSchema } from "./schema";



export const deleteMapUserRoute = app.openapi(
  createRoute({
    method: "delete",
    path: "/map/{mapId}/users/{userId}",
    summary: "Delete a user from a map",
    request: { params: MapUserParamsSchema },
    responses: {
      200: {
        content: { "application/json": { schema: SuccessfulDeleteSchema } },
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
      const { mapId, userId } = c.req.valid("param");
      const db = createDb(c.env.TURSO_CONNECTION_URL, c.env.TURSO_AUTH_TOKEN);

      const [deletedMapUser] = await db
        .delete(map_users)
        .where(
          and(eq(map_users.map_id, mapId), eq(map_users.user_id, userId))
        )
        .returning({
          deletedId: map_users.map_user_id,
        });

      return c.json(
        {
          code: "success",
          message: "User removed successfully",
          deletedId: deletedMapUser.deletedId,
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
