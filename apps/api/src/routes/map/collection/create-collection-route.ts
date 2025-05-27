import { createDb } from "@buzztrip/db";
import {
  createCollection,
  CreateCollectionReturnSchema,
  CreateCollectionSchema,
} from "@buzztrip/db/mutations";
import { createRoute } from "@hono/zod-openapi";
import { captureException } from "@sentry/cloudflare";
import { ErrorSchema, MapParamsSchema } from "../../../common/schema";
import { app } from "../../../common/types";

export const createCollectionRoute = app.openapi(
  createRoute({
    method: "post",
    path: "/map/{mapId}/collection/create",
    summary: "Create a new collection",
    request: {
      params: MapParamsSchema,
      body: {
        content: { "application/json": { schema: CreateCollectionSchema } },
      },
    },
    responses: {
      200: {
        content: {
          "application/json": {
            schema: CreateCollectionReturnSchema,
          },
        },
        description: "Create a new collection",
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
      const newCollection = c.req.valid("json");
      const db = createDb(
        c.env.TURSO_CONNECTION_URL,
        c.env.TURSO_AUTH_TOKEN,
        c.env.ENVIRONMENT === "production"
      );

      const collection = await createCollection(db, {
        userId: newCollection.created_by,
        mapId: mapId,
        input: newCollection,
      });

      if (!collection) {
        return c.json(
          {
            code: "failed_to_create_object",
            message: "Failed to create collection",
            requestId: c.get("requestId"),
          },
          400
        );
      }

      return c.json(collection, 200);
    } catch (error) {
      console.error(error);
      captureException(error);
      return c.json(
        {
          code: "failed_to_object",
          message: "Failed to create collection",
          requestId: c.get("requestId"),
        },
        400
      );
    }
  }
);
