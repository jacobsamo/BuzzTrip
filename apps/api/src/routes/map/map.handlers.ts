import { createDb } from "@buzztrip/db";
import { createMap, shareMap } from "@buzztrip/db/mutations/maps";
import { getAllMapData } from "@buzztrip/db/queries";
import { maps } from "@buzztrip/db/schema";
import { eq } from "drizzle-orm";
import { AppRouteHandler } from "../../common/types";
import {
  createMapRoute,
  editMapRoute,
  getMapDataRoute,
  getMapRoute,
  shareMapRoute,
} from "./map.routes";

export const getMapHandler: AppRouteHandler<typeof getMapRoute> = async (c) => {
  const { mapId } = c.req.valid("param");
  const db = createDb(c.env.TURSO_CONNECTION_URL, c.env.TURSO_AUTH_TOKEN);

  const map = await db.query.maps.findFirst({
    where: (maps, { eq }) => eq(maps.map_id, mapId),
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

  return c.json(map, 200);
};

export const getMapDataHandler: AppRouteHandler<
  typeof getMapDataRoute
> = async (c) => {
  const { mapId } = c.req.valid("param");
  const db = createDb(c.env.TURSO_CONNECTION_URL, c.env.TURSO_AUTH_TOKEN);

  const [foundCollections, collectionLinks, foundMarkers, sharedMap, [map]] =
    await getAllMapData(db, mapId);

  if (!map) {
    return c.json({
      code: "data_not_found",
      message: "Map not found",
      requestId: c.get("requestId"),
    }, 400);
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
};

export const createMapHandler: AppRouteHandler<typeof createMapRoute> = async (
  c
) => {
  const req = c.req.valid("json");
  try {
    const db = createDb(c.env.TURSO_CONNECTION_URL, c.env.TURSO_AUTH_TOKEN);
    const data = await createMap(db, {
      userId: req.userId,
      input: req,
    });

    return c.json(data, 200);
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

export const editMapHandler: AppRouteHandler<typeof editMapRoute> = async (
  c
) => {
  const { mapId } = c.req.valid("param");
  const editMap = c.req.valid("json");
  const db = createDb(c.env.TURSO_CONNECTION_URL, c.env.TURSO_AUTH_TOKEN);

  const [updatedMap] = await db
    .update(maps)
    .set(editMap)
    .where(eq(maps.map_id, mapId))
    .returning();

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

  return c.json(updatedMap, 200);
};

export const shareMapHandler: AppRouteHandler<typeof shareMapRoute> = async (
  c
) => {
  const { mapId } = c.req.valid("param");
  const mapUsers = c.req.valid("json");
  const db = createDb(c.env.TURSO_CONNECTION_URL, c.env.TURSO_AUTH_TOKEN);

  const newMapUsers = await shareMap(db, {
    mapId: mapId,
    users: mapUsers.users,
  });

  return c.json(newMapUsers, 200);
};
