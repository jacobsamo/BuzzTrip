import { createDb } from "@buzztrip/db";
import {
  shareMap,
  ShareMapReturnSchema,
  ShareMapSchema,
} from "@buzztrip/db/mutations";
import { createRoute } from "@hono/zod-openapi";
import { ErrorSchema, MapParamsSchema } from "../../common/schema";
import { app } from "../../common/types";
import { captureException } from "@sentry/cloudflare";

export const shareMapRoute = app.openapi(
  createRoute({
    method: "post",
    path: "/map/{mapId}/share",
    summary: "Share a map with other users",
    request: {
      params: MapParamsSchema,
      body: {
        content: {
          "application/json": {
            schema: ShareMapSchema,
          },
        },
      },
    },
    responses: {
      200: {
        content: {
          "application/json": {
            schema: ShareMapReturnSchema,
          },
        },
        description: "Share a map",
      },
      400: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "Returns an error",
      },
    },
  }),
  async (c) => {
    try {
      const { mapId } = c.req.valid("param");
      const mapUsers = c.req.valid("json");
      const db = createDb(c.env.TURSO_CONNECTION_URL, c.env.TURSO_AUTH_TOKEN);

      const newMapUsers = await shareMap(db, {
        mapId: mapId,
        users: mapUsers.users,
      });

      return c.json(newMapUsers, 200);
    } catch (error) {
      console.error(error);
      captureException(error);
      return c.json(
        {
          code: "failed_to_object",
          message: "Failed to share map",
          requestId: c.get("requestId"),
        },
        400
      );
    }
  }
);
