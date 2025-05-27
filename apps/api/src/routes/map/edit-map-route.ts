import { formatDateForSql } from "@buzztrip/db/helpers";
import { createDb } from "@buzztrip/db";
import { maps } from "@buzztrip/db/schemas";
import { mapsEditSchema } from "@buzztrip/db/zod-schemas";
import { createRoute } from "@hono/zod-openapi";
import { captureException } from "@sentry/cloudflare";
import { eq } from "drizzle-orm";
import { ErrorSchema, MapParamsSchema, MapSchema } from "../../common/schema";
import { app } from "../../common/types";

const EditMapSchema = mapsEditSchema.openapi("EditMapSchema");

export const editMapRoute = app.openapi(
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
        .set({
          ...editMap,
          updated_at: formatDateForSql(new Date()),
        })
        .where(eq(maps.map_id, mapId))
        .returning();

      if (!updatedMap) {
        throw Error("Map not found");
      }

      return c.json(updatedMap, 200);
    } catch (error) {
      console.error(error);
      captureException(error, {
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
