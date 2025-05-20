import { createDb } from "@buzztrip/db";
import { searchUsers } from "@buzztrip/db/queries";
import { refinedUserSchema } from "@buzztrip/db/zod-schemas";
import { createRoute, z } from "@hono/zod-openapi";
import { ErrorSchema } from "../../common/schema";
import { app } from "../../common/types";
import { captureException } from "@sentry/cloudflare";

const SearchUsersSchema = z.object({
  q: z.string(),
});

const SearchUserReturnSchema = z.object({
  users: refinedUserSchema.array().nullable(),
});

export const searchUserRoute = app.openapi(
  createRoute({
    method: "get",
    path: "/users/search",
    summary: "Search for a user",
    request: {
      query: SearchUsersSchema,
    },
    responses: {
      200: {
        content: {
          "application/json": {
            schema: SearchUserReturnSchema,
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
      const query = c.req.query("q");
      const db = createDb(c.env.TURSO_CONNECTION_URL, c.env.TURSO_AUTH_TOKEN);

      if (!query) {
        return c.json({ users: null }, 200);
      }

      const users = await searchUsers(db, query);

      return c.json(
        {
          users: users.map((user) => {
            return {
              id: user.id,
              email: user.email,
              username: user.username,
              first_name: user.first_name,
              last_name: user.last_name,
              name: user.name,
              image: user.image,
            };
          }),
        },
        200
      );
    } catch (error) {
      console.error(error);
      captureException(error);
      return c.json(
        {
          code: "failed_request",
          message: "Failed to search user",
          requestId: c.get("requestId"),
        },
        400
      );
    }
  }
);
