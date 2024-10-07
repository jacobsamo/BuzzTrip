import { ErrorSchema } from "@/common/schema";
import { createRoute } from "@hono/zod-openapi";
import {
  CreateMapReturnSchema,
  CreateMapSchema,
  EditMapSchema,
  MapDataSchema,
  MapParamsSchema,
  MapSchema,
} from "./schema";

export const getMap = createRoute({
  method: "get",
  path: "/map/{mapId}",
  summary: "Get get the map",
  request: {
    params: MapParamsSchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: MapSchema,
        },
      },
      description: "Retrieve rates",
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

export const getMapDataRoute = createRoute({
  method: "get",
  path: "/map/{mapId}/data",
  summary: "Get get the map data",
  request: {
    params: MapParamsSchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: MapDataSchema,
        },
      },
      description: "Get the map data",
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

export const createMap = createRoute({
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
  },
});

export const editMap = createRoute({
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
  },
});
