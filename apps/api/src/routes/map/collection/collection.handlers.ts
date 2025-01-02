import { createDb } from "@buzztrip/db";
import { createCollection } from "@buzztrip/db/mutations";
import { collections } from "@buzztrip/db/schema";
import { eq } from "drizzle-orm";
import { AppRouteHandler } from "../../../common/types";
import {
  createCollectionRoute,
  editCollectionRoute,
} from "./collection.routes";

export const createCollectionHandler: AppRouteHandler<
  typeof createCollectionRoute
> = async (c) => {
  const { mapId } = c.req.valid("param");
  const newCollection = c.req.valid("json");
  const db = createDb(c.env.TURSO_CONNECTION_URL, c.env.TURSO_AUTH_TOKEN);

  const collection = await createCollection(db, {
    userId: newCollection.created_by,
    mapId: mapId,
    input: newCollection,
  });

  if (!collection) {
    return c.json(
      {
        code: "failed_to_create_object",
        message: "Failed to create collection",
        requestId: c.get("requestId"),
      },
      400
    );
  }

  return c.json(collection, 200);
};

export const editCollectionHandler: AppRouteHandler<
  typeof editCollectionRoute
> = async (c) => {
  const { mapId, collectionId } = c.req.valid("param");
  const editCollection = c.req.valid("json");
  const db = createDb(c.env.TURSO_CONNECTION_URL, c.env.TURSO_AUTH_TOKEN);

  const [updatedCollection] = await db
    .update(collections)
    .set(editCollection)
    .where(eq(collections.collection_id, collectionId))
    .returning();

  if (!updatedCollection) {
    return c.json(
      {
        code: "failed_to_update_object",
        message: "Failed to update collection",
        requestId: c.get("requestId"),
      },
      400
    );
  }

  return c.json(
    {
      collection: updatedCollection,
    },
    200
  );
};
