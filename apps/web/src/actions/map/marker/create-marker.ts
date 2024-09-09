"use server";
import { authAction } from "@/actions/safe-action";
import { IconName } from "@/components/icon";
import { db } from "@/server/db";
import { collection_markers, markers } from "@/server/db/schema";
import { NewCollectionMarker, NewMarker } from "@/types";
import { markersEditSchema } from "@/types/scheams";
import { eq } from "drizzle-orm";
import { v4 as uuid } from "uuid";
import * as z from "zod";

const schema = z.object({
  marker: markersEditSchema,
  collectionIds: z.string().array().nullish(),
});

export const createMarker = authAction
  .schema(schema)
  .metadata({ name: "create-marker" })
  .action(async ({ parsedInput: params, ctx }) => {
    const id = uuid();
    const newMarker: NewMarker = {
      ...params.marker,
      marker_id: id,
      icon: params.marker.icon as IconName,
      created_by: ctx.user.id,
    };

    const marker = await db.insert(markers).values(newMarker).returning();

    if (params.collectionIds) {
      const collectionPromises = params.collectionIds.map(
        async (collectionId) => {
          const collectionMarker: NewCollectionMarker = {
            marker_id: id,
            collection_id: collectionId,
            map_id: params.marker.map_id,
          };

          const d1 = await db
            .insert(collection_markers)
            .values(collectionMarker);

          if (!d1) {
            throw new Error("Error creating new collection marker.", {
              cause: d1,
            });
          }

          return collectionMarker;
        }
      );

      await Promise.all(collectionPromises);
    }

    const collectionLinks = await db
      .select()
      .from(collection_markers)
      .where(eq(collection_markers.marker_id, id));

    return {
      marker,
      collectionLinks,
    };
  });
