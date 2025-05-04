import { createDb } from "@buzztrip/db";
import {
  createMarker,
  CreateMarkerSchema,
  CreateMarkersReturnSchema,
} from "@buzztrip/db/mutations";
import { createRoute } from "@hono/zod-openapi";
import { ErrorSchema, MapParamsSchema } from "../../../common/schema";
import { appRoute } from "../../../common/types";

export const createMarkerRoute = appRoute.openapi(
  createRoute({
    method: "post",
    path: "/map/{mapId}/marker/create",
    summary: "Create a new marker",
    request: {
      params: MapParamsSchema,
      body: {
        content: { "application/json": { schema: CreateMarkerSchema } },
      },
    },
    responses: {
      200: {
        content: {
          "application/json": {
            schema: CreateMarkersReturnSchema,
          },
        },
        description: "Create a new marker",
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
      const newMarker = c.req.valid("json");
      const db = createDb(c.env.TURSO_CONNECTION_URL, c.env.TURSO_AUTH_TOKEN);

      const { markers, collectionLinks } = await createMarker(db, {
        userId: newMarker.userId,
        mapId: mapId,
        input: newMarker,
      });

      return c.json(
        {
          markers,
          collectionLinks,
        },
        200
      );
    } catch (error) {
      console.error(error);
      c.get("sentry").captureException(error);
      return c.json(
        {
          code: "failed_to_object",
          message: "Failed to create marker",
          requestId: c.get("requestId"),
        },
        400
      );
    }
  }
);
