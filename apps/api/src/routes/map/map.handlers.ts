import { AppRouteHandler } from "@/common/types";
import { createDb } from "@buzztrip/db";
import { getMarkersView } from "@buzztrip/db/queries";
import {
    collection_markers,
    collections,
    map_users,
    maps,
} from "@buzztrip/db/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { createMap, editMap, getMap, getMapDataRoute } from "./map.routes";

export const getMapHandler: AppRouteHandler<typeof getMap> = async (c) => {
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
};

export const getMapDataHandler: AppRouteHandler<
  typeof getMapDataRoute
> = async (c) => {
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
};

export const createMapHandler: AppRouteHandler<typeof createMap> = async (
  c
) => {
  const req = c.req.valid("json");
  try {
    const db = createDb(c.env.TURSO_CONNECTION_URL, c.env.TURSO_AUTH_TOKEN);

    const createMap = await db.transaction(async (trx) => {
      const mapId = uuidv4();
      const [map] = await trx
        .insert(maps)
        .values({
          title: req.title,
          description: req.description,
          owner_id: req.owner_id,
          map_id: mapId,
        })
        .returning();

      const [mapUser] = await trx
        .insert(map_users)
        .values({
          map_id: mapId,
          user_id: req.owner_id,
          permission: "owner",
        })
        .returning();

      return {
        map,
        mapUser,
      };
    });

    if (!!createMap.map || !!createMap.mapUser) {
      throw new Error("Error creating map");
    }

    return c.json(
      {
        data: createMap,
      },
      200
    );
  } catch (error) {
    return c.json(
      {
        code: "failed_to_object",
        message: "Failed to create map",
        requestId: c.get("requestId"),
      },
      400
    );
  }
};

export const editMapHandler: AppRouteHandler<typeof editMap> = async (c) => {
  const { mapId } = c.req.valid("param");
  const editMap = c.req.valid("json");
  const db = createDb(c.env.TURSO_CONNECTION_URL, c.env.TURSO_AUTH_TOKEN);

  const updatedMap = await db
    .update(maps)
    .set(editMap)
    .where(eq(maps.map_id, mapId));

  if (!updatedMap) {
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
      data: updatedMap,
    },
    200
  );
};