import { createDb } from "@buzztrip/db";
import { createMap, CreateMapSchema } from "@buzztrip/db/mutations";
import { map_usersSchema, mapsSchema } from "@buzztrip/db/zod-schemas";
import { createRoute, z } from "@hono/zod-openapi";
import { ErrorSchema } from "../../common/schema";
import { app } from "../../common/types";

const CreateMapReturnSchema = z
  .object({
    map: mapsSchema.optional(),
    mapUser: map_usersSchema.optional(),
  })
  .openapi("CreateMapReturnSchema");

export const createMapRoute = app.openapi(
  createRoute({
    method: "post",
    path: "/map/create",
    summary: "Create a new map",
    request: {
      body: {
        content: { "application/json": { schema: CreateMapSchema } },
      },
    },
    responses: {
      200: {
        content: {
          "application/json": {
            schema: CreateMapReturnSchema,
          },
        },
        description: "Create a new map",
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
      const req = c.req.valid("json");

      const db = createDb(c.env.TURSO_CONNECTION_URL, c.env.TURSO_AUTH_TOKEN);
      const data = await createMap(db, {
        userId: req.map.owner_id,
        input: req,
      });

      return c.json(data, 200);
    } catch (error) {
      console.error(error);
      c.get("sentry").captureException(error, {
        data: c.req.json(),
      });

      return c.json(
        {
          code: "failed_to_object",
          message: "Failed to create map",
          requestId: c.get("requestId"),
        },
        400
      );
    }
  }
);
