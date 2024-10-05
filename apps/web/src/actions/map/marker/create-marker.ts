"use server";
import { authAction } from "@/actions/safe-action";
import { IconName } from "@buzztrip/components/icon";
import { db } from "@/server/db";
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
  marker: combinedMarkersSchema,
  collectionIds: z.string().array().nullish(),
});

export const createMarker = authAction
  .schema(schema)
  .metadata({ name: "create-marker" })
  .action(async ({ parsedInput: params, ctx }) => {
    const id = uuid();

    // Check for existing location or create a new one
    await db.transaction(async (tx) => {
      let locationId = uuid();
      const [location] = await tx
        .select()
        .from(locations)
        .where(
          and(
            eq(locations.lat, params.marker.lat),
            eq(locations.lng, params.marker.lng)
          )
        );

      if (location) {
        locationId = location.location_id;
      } else {
        const newLocation: NewLocation = {
          ...params.marker,
          location_id: locationId,
          icon: params.marker.icon as IconName,
        };
        await tx.insert(locations).values(newLocation);
      }

      await tx.insert(markers).values({
        ...params.marker,
        marker_id: id,
        icon: params.marker.icon as IconName,
        created_by: ctx.user.id,
        location_id: locationId,
      });
    });

    // Create the new marker

    // Create collection marker links if collectionIds exist
    if (params.collectionIds) {
      await Promise.all(
        params.collectionIds.map(async (collectionId) => {
          const collectionMarker: NewCollectionMarker = {
            marker_id: id,
            collection_id: collectionId,
            map_id: params.marker.map_id,
            user_id: ctx.user.id,
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
      getMarkersView(params.marker.map_id!),
      db
        .select()
        .from(collection_markers)
        .where(eq(collection_markers.marker_id, id)),
    ]);

    return {
      markers: newMarkers,
      collectionLinks,
    };
  });
