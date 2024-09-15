"use server";
import { authAction } from "@/actions/safe-action";
import { IconName } from "@/components/icon";
import { db } from "@/server/db";
import { getMarkersView } from "@/server/db/quieries";
import { collection_markers, locations, markers } from "@/server/db/schema";
import { NewCollectionMarker, NewLocation, NewMarker } from "@/types";
import { combinedMarkersSchema } from "@/types/scheams";
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
    let locationId = uuid();

    // Check for existing location or create a new one
    const location = await db
      .select()
      .from(locations)
      .where(
        and(
          eq(locations.lat, params.marker.lat),
          eq(locations.lng, params.marker.lng)
        )
      );

    if (location.length) {
      locationId = location[0]?.location_id ?? locationId;
    } else {
      const newLocation: NewLocation = {
        ...params.marker,
        location_id: locationId,
        icon: params.marker.icon as IconName,
      };
      await db.insert(locations).values(newLocation);
    }

    // Create the new marker
    const newMarker: NewMarker = {
      ...params.marker,
      marker_id: id,
      icon: params.marker.icon as IconName,
      created_by: ctx.user.id,
      location_id: locationId,
    };

    await db.insert(markers).values(newMarker);

    // Create collection marker links if collectionIds exist
    if (params.collectionIds) {
      await Promise.all(params.collectionIds.map(async (collectionId) => {
        const collectionMarker: NewCollectionMarker = {
          marker_id: id,
          collection_id: collectionId,
          map_id: params.marker.map_id,
          user_id: ctx.user.id,
        };
        const result = await db.insert(collection_markers).values(collectionMarker);
        if (!result) {
          throw new Error("Error creating new collection marker.", { cause: result });
        }
      }));
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
