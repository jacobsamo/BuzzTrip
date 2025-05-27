import { createDb } from "@buzztrip/db";
import { getUser, updateUser } from "@buzztrip/db/queries";
import { usersSchema } from "@buzztrip/db/zod-schemas";
import { createRoute, z } from "@hono/zod-openapi";
import { ErrorSchema } from "../../common/schema";
import { app } from "../../common/types";
import { captureException } from "@sentry/cloudflare";

const UpdateUserSchema = usersSchema.partial();

const UpdateUserReturnSchema = usersSchema;

export const updateUserRoute = app.openapi(
  createRoute({
    method: "put",
    path: "/users/{userId}",
    summary: "Update user information",
    request: {
      params: z.object({
        userId: z.string().openapi({
          param: {
            name: "userId",
            in: "path",
            required: true,
          },
          example: "user_2lmIzCk7BhX5a5MwvgITlFjkoLH",
        }),
      }),
      body: {
        content: {
          "application/json": {
            schema: UpdateUserSchema,
          },
        },
      },
    },
    responses: {
      200: {
        content: {
          "application/json": {
            schema: UpdateUserReturnSchema,
          },
        },
        description: "User updated successfully",
      },
      404: {
        content: {
          "application/json": {
            schema: ErrorSchema,
          },
        },
        description: "User not found",
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
      const updateData = await c.req.valid("json");
      const db = createDb(c.env.TURSO_CONNECTION_URL, c.env.TURSO_AUTH_TOKEN, c.env.ENVIRONMENT === "production");

      const user = await getUser(db, userId);

      if (!user) {
        return c.json(
          {
            code: "user_not_found",
            message: "User not found",
            requestId: c.get("requestId"),
          },
          404
        );
      }

      const updatedUser = await updateUser(db, userId, updateData);

      if (!updatedUser) {
        return c.json(
          {
            code: "update_failed",
            message: "Failed to update user",
            requestId: c.get("requestId"),
          },
          400
        );
      }

      return c.json(updatedUser, 200);
    } catch (error) {
      console.error(error);
      captureException(error);
      return c.json(
        {
          code: "failed_request",
          message: "Failed to update user",
          requestId: c.get("requestId"),
        },
        400
      );
    }
  }
);
