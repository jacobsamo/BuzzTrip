import { AppRouteHandler } from "@/common/types";
import { createDb } from "@buzztrip/db";
import { collections } from "@buzztrip/db/schema";
import { getAuth } from "@hono/clerk-auth";
import { eq } from "drizzle-orm";
import { createCollection, editCollection } from "./collection.routes";

export const createCollectionHandler: AppRouteHandler<
  typeof createCollection
> = async (c) => {
  const { mapId } = c.req.valid("param");
  const newCollection = c.req.valid("json");
  const db = createDb(c.env.TURSO_CONNECTION_URL, c.env.TURSO_AUTH_TOKEN);
  const auth = getAuth(c);

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

  const [collection] = await db
    .insert(collections)
    .values({
      ...newCollection,
      map_id: mapId,
      created_by: auth.userId,
    })
    .returning();

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

  return c.json(
    {
      data: {
        collection,
      },
    },
    200
  );
};

export const editCollectionHandler: AppRouteHandler<
  typeof editCollection
> = async (c) => {
  const { mapId, collectionId } = c.req.valid("param");
  const editCollection = c.req.valid("json");
  const db = createDb(c.env.TURSO_CONNECTION_URL, c.env.TURSO_AUTH_TOKEN);
  const auth = getAuth(c);

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
      data: {
        collection: updatedCollection,
      },
    },
    200
  );
};
