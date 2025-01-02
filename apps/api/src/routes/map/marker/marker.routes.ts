import { ErrorSchema } from "../../../common/schema";
import { createRoute } from "@hono/zod-openapi";
import { MapParamsSchema } from "../schema";
import {
  EditMarkerReturnSchema,
  EditMarkerSchema,
  MarkerParamsSchema,
} from "./schema";
import {
  CreateMarkerSchema,
  CreateMarkersReturnSchema,
} from "@buzztrip/db/mutations";

export const createMarkerRoute = createRoute({
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
});

export const editMarkerRoute = createRoute({
  method: "put",
  path: "/map/{mapId}/marker/{markerId}",
  summary: "Edit a marker",
  request: {
    params: MarkerParamsSchema,
    body: {
      content: { "application/json": { schema: EditMarkerSchema } },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: EditMarkerReturnSchema,
        },
      },
      description: "Edit a marker",
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
