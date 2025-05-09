import { createDb } from "@buzztrip/db";
import { maps } from "@buzztrip/db/schemas";
import { createRoute, z } from "@hono/zod-openapi";
import { eq } from "drizzle-orm";
import { ErrorSchema, MapParamsSchema, MapSchema } from "../../common/schema";
import { appRoute } from "../../common/types";

const EditMapSchema = z
  .object({
    map_id: z.string().openapi({
      param: { name: "mapId", in: "path", required: true },
      example: "1f36c536-c8cf-4174-8ed4-3150c08212b5",
    }),
    title: z.string().optional().openapi({ example: "My Map" }),
    description: z
      .string()
      .nullish()
      .openapi({ example: "An awesome trip across Australia" }),
    owner_id: z
      .string()
      .openapi({ example: "user_2lmIzCk7BhX5a5MwvgITlFjkoLH" }),
    image: z
      .string()
      .optional()
      .openapi({ example: "https://example.com/image.png" }),
  })
  .openapi("EditMapSchema");

export const editMapRoute = appRoute.openapi(
  createRoute({
    method: "put",
    path: "/map/{mapId}",
    summary: "Edit a map",
    request: {
      params: MapParamsSchema,
      body: {
        content: { "application/json": { schema: EditMapSchema } },
      },
    },
    responses: {
      200: {
        content: {
          "application/json": {
            schema: MapSchema,
          },
        },
        description: "Edit a map",
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
      const { mapId } = c.req.valid("param");
      const editMap = c.req.valid("json");
      const db = createDb(c.env.TURSO_CONNECTION_URL, c.env.TURSO_AUTH_TOKEN);

      const [updatedMap] = await db
        .update(maps)
        .set(editMap)
        .where(eq(maps.map_id, mapId))
        .returning();

      if (!updatedMap) {
        throw Error("Map not found");
      }

      return c.json(updatedMap, 200);
    } catch (error) {
      console.error(error);
      c.get("sentry").captureException(error, {
        data: c.req.json(),
      });
      return c.json(
        {
          code: "failed_to_object",
          message: "Failed to edit map",
          requestId: c.get("requestId"),
        },
        400
      );
    }
  }
);
