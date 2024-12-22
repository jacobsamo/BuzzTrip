import { createRoute } from "@hono/zod-openapi";
import { ClerkWebhookReturn } from "./schema";
import { ErrorSchema } from "../../../common/schema";

export const clerkWebhookRoute = createRoute({
  method: "post",
  path: "/webhook/auth",
  summary: "Create a new map",
  request: {},
  responses: {
    200: {
      content: {
        "application/json": {
          schema: ClerkWebhookReturn,
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
});
