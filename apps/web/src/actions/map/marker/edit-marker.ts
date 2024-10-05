"use server";
import { authAction } from "@/actions/safe-action";
import { IconName } from "@buzztrip/components/icon";
import { db } from "@buzztrip/db";
import { getMarkersView } from "@buzztrip/db/queries";
import { collection_markers, locations, markers } from "@buzztrip/db/schema";
import {
  NewCollectionMarker,
  NewLocation,
  NewMarker,
} from "@buzztrip/db/types";
import { combinedMarkersSchema } from "@buzztrip/db/zod-schemas";
import { and, eq } from "drizzle-orm";
import { v4 as uuid } from "uuid";
import * as z from "zod";

const schema = z.object({
  marker_id: z.string(),
  marker: combinedMarkersSchema,
  collectionIds_to_add: z.array(z.string()).optional(),
  collectionIds_to_remove: z.array(z.string()).optional(),
});

export const updateMarker = authAction
  .schema(schema)
  .metadata({ name: "update-marker" })
  .action(async ({ parsedInput: params, ctx }) => {
    let collectionLinksCreated: NewCollectionMarker[] | null = null;
    let collectionLinksDeleted: string[] | null = null;

    if (params.collectionIds_to_add) {
      await Promise.all(
        params.collectionIds_to_add.map(async (collectionId) => {
          const collectionMarker: NewCollectionMarker = {
            marker_id: params.marker_id,
            collection_id: collectionId,
            map_id: params.marker.map_id,
            user_id: ctx.user.id,
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

    if (params.collectionIds_to_remove) {
      await Promise.all(
        params.collectionIds_to_remove.map(async (collectionId) => {
          const result = await db
            .delete(collection_markers)
            .where(
              and(
                eq(collection_markers.marker_id, params.marker_id),
                eq(collection_markers.collection_id, collectionId)
              )
            );

          collectionLinksDeleted = collectionLinksDeleted ?? [];
          collectionLinksDeleted.push(collectionId);
        })
      );
    }

    const result = await db
      .update(markers)
      .set(params.marker)
      .where(eq(markers.marker_id, params.marker_id));

    return {
      collectionLinksDeleted: collectionLinksDeleted,
      collectionLinksCreated: collectionLinksCreated,
      marker: params.marker,
    };
  });
