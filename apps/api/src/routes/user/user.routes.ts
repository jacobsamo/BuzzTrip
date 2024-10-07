import { ErrorSchema } from "@/common/schema";
import { createRoute } from "@hono/zod-openapi";
import { MapsParamsSchema, MapsSchema } from "./schema";

export const getUserMapsRoute = createRoute({
  method: "get",
  path: "/{userId}/maps",
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
});
