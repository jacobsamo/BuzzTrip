import { AppRouteHandler } from "@/common/types";
import { createDb } from "@buzztrip/db";
import { getMarkersView } from "@buzztrip/db/queries";
import { collection_markers, locations, markers } from "@buzztrip/db/schema";
import { NewCollectionMarker, NewLocation } from "@buzztrip/db/types";
import { getAuth } from "@hono/clerk-auth";
import { and, eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { createMarker, editMarker } from "./marker.routes";

export const createMarkerHandler: AppRouteHandler<typeof createMarker> = async (
  c
) => {
  const { mapId } = c.req.valid("param");
  const newMarker = c.req.valid("json");
  const db = createDb(c.env.TURSO_CONNECTION_URL, c.env.TURSO_AUTH_TOKEN);
  const auth = getAuth(c);
  const id = uuidv4();

  if (!auth || !auth.userId) {
    return c.json(
      {
        code: "unauthorized",
        message: "Unauthorized",
        requestId: c.get("requestId"),
      },
      401
    );
  }

  const newMarkerData = await db.transaction(async (tx) => {
    let locationId = uuidv4();
    const [location] = await tx
      .select()
      .from(locations)
      .where(
        and(
          eq(locations.lat, newMarker.marker.lat),
          eq(locations.lng, newMarker.marker.lng)
        )
      );

    if (location) {
      locationId = location.location_id;
    } else {
      const newLocation: NewLocation = {
        ...newMarker.marker,
        location_id: locationId,
        icon: newMarker.marker.icon as IconName,
      };
      await tx.insert(locations).values(newLocation);
    }

    await tx.insert(markers).values({
      ...newMarker.marker,
      marker_id: id,
      map_id: mapId,
      created_by: auth.userId,
      location_id: locationId,
    });
  });

  if (newMarker.collectionIds) {
    await Promise.all(
      newMarker.collectionIds.map(async (collectionId) => {
        const collectionMarker: NewCollectionMarker = {
          marker_id: id,
          collection_id: collectionId,
          map_id: newMarker.marker.map_id,
          user_id: auth.userId,
        };
        const result = await db
          .insert(collection_markers)
          .values(collectionMarker);

        if (!result) {
          throw new Error("Error creating new collection marker.", {
            cause: result,
          });
        }
      })
    );
  }

  // Fetch new markers and collection links
  const [newMarkers, collectionLinks] = await Promise.all([
    getMarkersView(db, mapId),
    db
      .select()
      .from(collection_markers)
      .where(eq(collection_markers.marker_id, id)),
  ]);

  return c.json(
    {
      markers: newMarkers,
      collectionLinks,
    },
    200
  );
};

export const editMarkerHandler: AppRouteHandler<typeof editMarker> = async (
  c
) => {
  const { mapId, markerId } = c.req.valid("param");
  const editMarker = c.req.valid("json");
  const db = createDb(c.env.TURSO_CONNECTION_URL, c.env.TURSO_AUTH_TOKEN);
  const auth = getAuth(c);

  let collectionLinksCreated: NewCollectionMarker[] | null = null;
  let collectionLinksDeleted: string[] | null = null;

  if (!auth || !auth.userId) {
    return c.json(
      {
        code: "unauthorized",
        message: "Unauthorized",
        requestId: c.get("requestId"),
      },
      401
    );
  }

  if (editMarker.collectionIds_to_add) {
    await Promise.all(
      editMarker.collectionIds_to_add.map(async (collectionId) => {
        const collectionMarker: NewCollectionMarker = {
          marker_id: editMarker.marker_id,
          collection_id: collectionId,
          map_id: editMarker.marker.map_id,
          user_id: auth.userId,
        };

        const result = await db
          .insert(collection_markers)
          .values(collectionMarker)
          .returning();

        if (result) {
          collectionLinksCreated = collectionLinksCreated ?? [];
          collectionLinksCreated.push(...result);
        }
      })
    );
  }

  if (editMarker.collectionIds_to_remove) {
    await Promise.all(
      editMarker.collectionIds_to_remove.map(async (collectionId) => {
        const result = await db
          .delete(collection_markers)
          .where(
            and(
              eq(collection_markers.marker_id, markerId),
              eq(collection_markers.collection_id, collectionId)
            )
          );

        collectionLinksDeleted = collectionLinksDeleted ?? [];
        collectionLinksDeleted.push(collectionId);
      })
    );
  }

  await db
    .update(markers)
    .set(editMarker.marker)
    .where(eq(markers.marker_id, markerId));

  return c.json(
    {
      collectionLinksDeleted: collectionLinksDeleted,
      collectionLinksCreated: collectionLinksCreated,
      marker: editMarker.marker,
    },
    200
  );
};
