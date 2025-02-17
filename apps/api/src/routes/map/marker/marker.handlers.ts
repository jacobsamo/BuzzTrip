import { AppRouteHandler } from "../../../common/types";
import { createDb } from "@buzztrip/db";
import { createMarker } from "@buzztrip/db/mutations";
import { collection_links, markers } from "@buzztrip/db/schema";
import { NewCollectionLink } from "@buzztrip/db/types";
import { and, eq } from "drizzle-orm";
import { createMarkerRoute, editMarkerRoute } from "./marker.routes";

export const createMarkerHandler: AppRouteHandler<
  typeof createMarkerRoute
> = async (c) => {
  try {
    const { mapId } = c.req.valid("param");
    const newMarker = c.req.valid("json");
    const db = createDb(c.env.TURSO_CONNECTION_URL, c.env.TURSO_AUTH_TOKEN);

    const { markers, collectionLinks } = await createMarker(db, {
      userId: newMarker.userId,
      mapId: mapId,
      input: newMarker,
    });

    return c.json(
      {
        markers,
        collectionLinks,
      },
      200
    );
  } catch (error) {
    console.error(error);
    c.get("sentry").captureException(error);
    return c.json(
      {
        code: "failed_to_object",
        message: "Failed to create marker",
        requestId: c.get("requestId"),
      },
      400
    );
  }
};

export const editMarkerHandler: AppRouteHandler<
  typeof editMarkerRoute
> = async (c) => {
  try {
    const { mapId, markerId } = c.req.valid("param");
    const editMarker = c.req.valid("json");
    const db = createDb(c.env.TURSO_CONNECTION_URL, c.env.TURSO_AUTH_TOKEN);

    let collectionLinksCreated: NewCollectionLink[] | null = null;
    let collectionLinksDeleted: string[] | null = null;

    if (editMarker.collectionIds_to_add) {
      await Promise.all(
        editMarker.collectionIds_to_add.map(async (collectionId) => {
          const collectionLink: NewCollectionLink = {
            marker_id: editMarker.marker_id,
            collection_id: collectionId,
            map_id: editMarker.marker.map_id,
            user_id: editMarker.userId,
          };

          const result = await db
            .insert(collection_links)
            .values(collectionLink)
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
          await db
            .delete(collection_links)
            .where(
              and(
                eq(collection_links.marker_id, markerId),
                eq(collection_links.collection_id, collectionId)
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
  } catch (error) {
    console.error(error);
    c.get("sentry").captureException(error);
    return c.json(
      {
        code: "failed_to_object",
        message: "Failed to edit marker",
        requestId: c.get("requestId"),
      },
      400
    );
  }
};
