import { createDb } from "@buzztrip/db";
import { getUserMaps } from "@buzztrip/db/queries";
import { userMapsSchema } from "@buzztrip/db/zod-schemas";
import { createRoute, z } from "@hono/zod-openapi";
import { ErrorSchema } from "../../common/schema";
import { app } from "../../common/types";
import { captureException } from "@sentry/cloudflare";

const MapsParamsSchema = z.object({
  userId: z.string().openapi({
    param: {
      name: "userId",
      in: "path",
      required: true,
    },
    example: "user_2lmIzCk7BhX5a5MwvgITlFjkoLH",
  }),
});

const MapsSchema = userMapsSchema.array().openapi("MapsSchema");

export const getUserMapsRoute = app.openapi(
  createRoute({
    method: "get",
    path: "/users/{userId}/maps",
    summary: "Get all maps that a user has created or been shared",
    request: {
      params: MapsParamsSchema,
    },
    responses: {
      200: {
        content: {
          "application/json": {
            schema: MapsSchema,
          },
        },
        description: "Gets all maps that a user has created or been shared",
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
      const { userId } = c.req.valid("param");
      const db = createDb(c.env.TURSO_CONNECTION_URL, c.env.TURSO_AUTH_TOKEN);
      const usersMaps = await getUserMaps(db, userId);

      return c.json(usersMaps, 200);
    } catch (error) {
      console.error(error);
      captureException(error);
      return c.json(
        {
          code: "failed_request",
          message: "Failed to get user maps",
          requestId: c.get("requestId"),
        },
        400
      );
    }
  }
);
