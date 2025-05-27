import { createDb } from "@buzztrip/db";
import { map_users } from "@buzztrip/db/schemas";
import { map_usersEditSchema, map_usersSchema } from "@buzztrip/db/zod-schemas";
import { createRoute, z } from "@hono/zod-openapi";
import { captureException } from "@sentry/cloudflare";
import { and, eq } from "drizzle-orm";
import { ErrorSchema } from "../../../common/schema";
import { app } from "../../../common/types";
import { MapUserParamsSchema } from "./schema";

export const EditMapUserSchema =
  map_usersEditSchema.openapi("EditMapUserSchema");

export const EditMapUserReturnSchema = z
  .object({
    mapUser: map_usersSchema,
  })
  .openapi("EditMapUserReturnSchema");

export const updateMapUserRoute = app.openapi(
  createRoute({
    method: "put",
    path: "/map/{mapId}/users/{userId}",
    summary: "Update a map user",
    request: {
      params: MapUserParamsSchema,
      body: {
        content: { "application/json": { schema: EditMapUserSchema } },
      },
    },
    responses: {
      200: {
        content: {
          "application/json": {
            schema: EditMapUserReturnSchema,
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
      const { mapId, userId } = c.req.valid("param");
      const newLabel = c.req.valid("json");
      const db = createDb(c.env.TURSO_CONNECTION_URL, c.env.TURSO_AUTH_TOKEN);

      const [updatedMapUser] = await db
        .update(map_users)
        .set(newLabel)
        .where(and(eq(map_users.map_id, mapId), eq(map_users.user_id, userId)))
        .returning();

      if (!updatedMapUser) {
        throw Error("Failed to update collection");
      }

      return c.json(
        {
          mapUser: updatedMapUser,
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
