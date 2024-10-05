import { Hono } from "hono";
import { Bindings } from "@/common/bindings";
import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { MapDataSchema, MapParamsSchema, MapSchema } from "./schema";
import { ErrorSchema } from "@/common/schema";
import { createDb } from "@buzztrip/db";
import { maps } from "@buzztrip/db/schema";
import { eq } from "drizzle-orm";
import {
  collections,
  collection_markers,
  map_users,
} from "@buzztrip/db/schema";
import { getMarkersView } from "@buzztrip/db/queries";

const app = new OpenAPIHono<{ Bindings: Bindings }>();

const indexRoute = createRoute({
  method: "get",
  path: "/{mapId}",
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

const getMapDataRoute = createRoute({
  method: "get",
  path: "/{mapId}/data",
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

app.openapi(indexRoute, async (c) => {
  const { mapId } = c.req.valid("param");
  const db = createDb(c.env.TURSO_CONNECTION_URL, c.env.TURSO_AUTH_TOKEN);

  const map = await db.query.maps.findFirst({
    where: eq(maps.map_id, mapId),
  });

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
      data: map,
    },
    200
  );
});

app.openapi(getMapDataRoute, async (c) => {
  const { mapId } = c.req.valid("param");
  const db = createDb(c.env.TURSO_CONNECTION_URL, c.env.TURSO_AUTH_TOKEN);

  const [foundCollections, collectionMarkers, foundMarkers, sharedMap, map] =
    await Promise.all([
      db.select().from(collections).where(eq(collections.map_id, mapId)),
      db
        .select()
        .from(collection_markers)
        .where(eq(collection_markers.map_id, mapId)),
      getMarkersView(db, mapId),
      db.select().from(map_users).where(eq(map_users.map_id, mapId)),
      db.select().from(maps).where(eq(maps.map_id, mapId)),
    ]);

  return c.json(
    {
      data: {
        markers: foundMarkers.map((marker) => ({
          ...marker,
          lat: marker.lat as number,
          lng: marker.lng as number,
          bounds: marker.bounds ?? null,
        })),
        collections: foundCollections,
        collection_markers: collectionMarkers,
        mapUsers: sharedMap,
        map: map[0]!,
      },
    },
    200
  );
});

export default app;
