import { createDb } from "@buzztrip/db";
import { getAllMapData } from "@buzztrip/db/queries";
import {
  collection_linksSchema,
  collectionsSchema,
  combinedMarkersSchema,
  map_usersSchema,
  mapsSchema,
} from "@buzztrip/db/zod-schemas";
import { createRoute, z } from "@hono/zod-openapi";
import { ErrorSchema, MapParamsSchema } from "../../common/schema";
import { appRoute } from "../../common/types";


const MapDataSchema = z
  .object({
    markers: combinedMarkersSchema.array(),
    collections: collectionsSchema.array(),
    collection_links: collection_linksSchema.array(),
    mapUsers: map_usersSchema.array(),
    map: mapsSchema,
  })
  .openapi("MapDataSchema");

export const getMapDataRoute = appRoute.openapi(
  createRoute({
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
      const db = createDb(c.env.TURSO_CONNECTION_URL, c.env.TURSO_AUTH_TOKEN);

      const [
        foundCollections,
        collectionLinks,
        foundMarkers,
        sharedMap,
        [map],
      ] = await getAllMapData(db, mapId);

      if (!map) {
        return c.json(
          {
            code: "data_not_found",
            message: "Map not found",
            requestId: c.get("requestId"),
          },
          400
        );
      }

      return c.json(
        {
          markers: foundMarkers.map((marker) => ({
            ...marker,
            lat: marker.lat as number,
            lng: marker.lng as number,
            bounds: marker.bounds ?? null,
          })),
          collections: foundCollections,
          collection_links: collectionLinks,
          mapUsers: sharedMap,
          map: map,
        },
        200
      );
    } catch (error) {
      console.error(error);
      c.get("sentry").captureException(error);
      return c.json(
        {
          code: "data_not_found",
          message: "Map not found",
          requestId: c.get("requestId"),
        },
        400
      );
    }
  }
);
