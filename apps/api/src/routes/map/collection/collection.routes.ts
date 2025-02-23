import { ErrorSchema } from "../../../common/schema";
import { createRoute } from "@hono/zod-openapi";
import { MapParamsSchema } from "../schema";
import {
  CollectionParamsSchema,
  CollectionReturnSchema,
  EditCollectionSchema,
} from "./schema";
import {
  CreateCollectionReturnSchema,
  CreateCollectionSchema,
} from "@buzztrip/db/mutations";

export const createCollectionRoute = createRoute({
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
});

export const editCollectionRoute = createRoute({
  method: "put",
  path: "/map/{mapId}/collection/{collectionId}",
  summary: "Edit a collection",
  request: {
    params: CollectionParamsSchema,
    body: {
      content: { "application/json": { schema: EditCollectionSchema } },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: CollectionReturnSchema,
        },
      },
      description: "Edit a collection",
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
