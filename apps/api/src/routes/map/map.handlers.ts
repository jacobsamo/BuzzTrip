import { createDb } from "@buzztrip/db";
import { createMap, shareMap } from "@buzztrip/db/mutations/maps";
import { getAllMapData } from "@buzztrip/db/queries";
import { maps } from "@buzztrip/db/schemas";
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
  try {
    const { mapId } = c.req.valid("param");
    const db = createDb(c.env.TURSO_CONNECTION_URL, c.env.TURSO_AUTH_TOKEN);

    const map = await db.query.maps.findFirst({
      where: (maps, { eq }) => eq(maps.map_id, mapId),
    });

    if (!map) {
      throw Error("Map not found");
    }

    return c.json(map, 200);
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
};

export const getMapDataHandler: AppRouteHandler<
  typeof getMapDataRoute
> = async (c) => {
  try {
    const { mapId } = c.req.valid("param");
    const db = createDb(c.env.TURSO_CONNECTION_URL, c.env.TURSO_AUTH_TOKEN);

    const [foundCollections, collectionLinks, foundMarkers, sharedMap, [map]] =
      await getAllMapData(db, mapId);

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
};

export const createMapHandler: AppRouteHandler<typeof createMapRoute> = async (
  c
) => {
  try {
    const req = c.req.valid("json");

    const db = createDb(c.env.TURSO_CONNECTION_URL, c.env.TURSO_AUTH_TOKEN);
    const data = await createMap(db, {
      userId: req.userId,
      input: req,
    });

    return c.json(data, 200);
  } catch (error) {
    console.error(error);
    c.get("sentry").captureException(error);
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
  try {
    const { mapId } = c.req.valid("param");
    const editMap = c.req.valid("json");
    const db = createDb(c.env.TURSO_CONNECTION_URL, c.env.TURSO_AUTH_TOKEN);

    const [updatedMap] = await db
      .update(maps)
      .set(editMap)
      .where(eq(maps.map_id, mapId))
      .returning();

    if (!updatedMap) {
      throw Error("Map not found");
    }

    return c.json(updatedMap, 200);
  } catch (error) {
    console.error(error);
    c.get("sentry").captureException(error, {
      data: c.req.json(),
    });
    return c.json(
      {
        code: "failed_to_object",
        message: "Failed to edit map",
        requestId: c.get("requestId"),
      },
      400
    );
  }
};

export const shareMapHandler: AppRouteHandler<typeof shareMapRoute> = async (
  c
) => {
  try {
    const { mapId } = c.req.valid("param");
    const mapUsers = c.req.valid("json");
    const db = createDb(c.env.TURSO_CONNECTION_URL, c.env.TURSO_AUTH_TOKEN);

    const newMapUsers = await shareMap(db, {
      mapId: mapId,
      users: mapUsers.users,
    });

    return c.json(newMapUsers, 200);
  } catch (error) {
    console.error(error);
    c.get("sentry").captureException(error);
    return c.json(
      {
        code: "failed_to_object",
        message: "Failed to share map",
        requestId: c.get("requestId"),
      },
      400
    );
  }
};
