import { createRoute } from "@hono/zod-openapi";
import { ErrorSchema } from "../../common/schema";
import {
  FileFormParamsSchema,
  FileJSONParamsSchema,
  FileReturnSchema,
} from "./schema";

export const uploadFileRoute = createRoute({
  method: "post",
  path: "/files/upload",
  summary: "Upload a file to R2 storage",
  description:
    "Upload a file using either multipart/form-data or JSON with base64 encoded content",
  request: {
    body: {
      content: {
        "application/json": {
          schema: FileJSONParamsSchema,
        },
        "multipart/form-data": {
          schema: FileFormParamsSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: FileReturnSchema,
        },
      },
      description: "File uploaded successfully",
    },
    400: {
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
      description: "Returns an error if the upload fails",
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
