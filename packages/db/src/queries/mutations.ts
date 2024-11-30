import { getMarkersView } from "@buzztrip/db/queries";
import { collection_links, locations, markers } from "@buzztrip/db/schema";
import type { IconType } from "@buzztrip/db/types";
import { NewCollectionLink, NewLocation } from "@buzztrip/db/types";
import { and, eq } from "drizzle-orm";
import { v4 as uuid } from "uuid";
import { z } from "zod";
import { Database } from "..";
import { collection_linksSchema, combinedMarkersSchema } from "../zod-schemas";

export const CreateMarkerSchema = z.object({
  marker: combinedMarkersSchema,
  collectionIds: z.string().array().nullish(),
});

export const CreateMarkersReturnSchema = z.object({
  markers: combinedMarkersSchema.array(),
  collectionLinks: collection_linksSchema.array().nullable(),
});

export type CreateMarkerParams = {
  userId: string;
  mapId: string;
  input: z.infer<typeof CreateMarkerSchema>;
};

/**
 * Creates a marker and links it to a location, along with adding it to any collections passed from the id
 * @param db - Database client
 * @param mapId - the map id
 * @param userId - the user id of the user creating the marker
 * @param params - the params for creating the marker (marker, collectionIds)
 * @returns
 */
export const createMarker = async (
  db: Database,
  { userId, mapId, input }: CreateMarkerParams
): Promise<z.infer<typeof CreateMarkersReturnSchema>> => {
  const id = uuid();
  // Wrap in a transaction as we don't want to create a marker without a location
  await db.transaction(async (tx) => {
    let locationId = uuid();
    const [location] = await tx
      .select()
      .from(locations)
      .where(
        and(
          eq(locations.lat, input.marker.lat),
          eq(locations.lng, input.marker.lng)
        )
      );

    // if location exists set the location id
    if (location) {
      locationId = location.location_id;
    } else {
      // otherwise create a new location
      const newLocation: NewLocation = {
        ...input.marker,
        location_id: locationId,
        icon: input.marker.icon as IconType,
      };

      const lo = await tx
        .insert(locations)
        .values(newLocation)
        .returning({ locationId: locations.location_id });

      if (!lo[0]) {
        tx.rollback();
        throw Error("Failed to create location", {
          cause: lo,
        });
      }

      locationId = lo[0].locationId;
    }

    await tx.insert(markers).values({
      ...input.marker,
      marker_id: id,
      map_id: mapId,
      icon: input.marker.icon as IconType,
      created_by: userId,
      location_id: locationId,
    });
  });

  // Create collection marker links if collectionIds exist
  let collectionsLinks: NewCollectionLink[] = [];
  if (input.collectionIds) {
    input.collectionIds.forEach((collectionId) => {
      collectionsLinks.push({
        marker_id: id,
        collection_id: collectionId,
        map_id: mapId,
        user_id: userId,
      });
    });
  }

  await db.insert(collection_links).values(collectionsLinks);

  // Fetch new markers and collection links
  const [newMarkers, collectionLinks] = await Promise.all([
    getMarkersView(db, input.marker.map_id!),
    db
      .select()
      .from(collection_links)
      .where(eq(collection_links.marker_id, id)),
  ]);

  return {
    markers: newMarkers,
    collectionLinks,
  };
};
