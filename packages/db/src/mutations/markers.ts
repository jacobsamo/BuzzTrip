import { getMarkersView } from "@buzztrip/db/queries";
import { collection_links, locations, markers } from "@buzztrip/db/schema";
import type { CollectionLink, IconType } from "@buzztrip/db/types";
import { NewCollectionLink, NewLocation } from "@buzztrip/db/types";
import { and, eq } from "drizzle-orm";
import { v4 as uuid } from "uuid";
import { z } from "zod";
import { Database } from "..";
import { collection_linksSchema, combinedMarkersSchema } from "../zod-schemas";

// =========== Create marker ============

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

      const [lo] = await tx
        .insert(locations)
        .values(newLocation)
        .returning({ locationId: locations.location_id });

      if (!lo) {
        tx.rollback();
        throw Error("Failed to create location", {
          cause: lo,
        });
      }

      locationId = lo.locationId;
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

// =========== Edit marker ============

export const EditMarkerSchema = z.object({
  marker_id: z.string(),
  marker: combinedMarkersSchema,
  collectionIds_to_add: z.string().array().nullable(),
  collectionIds_to_remove: z.string().array().nullable(),
});

export const EditMarkerReturnSchema = z.object({
  collectionLinksCreated: collection_linksSchema.array().nullable(),
  collectionLinksDeleted: z.string().array().nullable(),
  marker: combinedMarkersSchema,
});

export type EditMarkerParams = {
  userId: string;
  mapId: string;
  input: z.infer<typeof EditMarkerSchema>;
};

export const editMarker = async (
  db: Database,
  { userId, mapId, input }: EditMarkerParams
): Promise<z.infer<typeof EditMarkerReturnSchema>> => {
  let collectionLinksCreated: CollectionLink[] | null = null;
  if (input.collectionIds_to_add) {
    collectionLinksCreated = await db
      .insert(collection_links)
      .values(
        input.collectionIds_to_add.map((collectionId) => {
          return {
            marker_id: input.marker_id,
            collection_id: collectionId,
            map_id: mapId,
            user_id: userId,
          };
        })
      )
      .returning();
  }

  let collectionLinksDeleted: string[] = [];
  if (input.collectionIds_to_remove) {
    await Promise.all(
      input.collectionIds_to_remove.map(async (collectionId) => {
        const result = await db
          .delete(collection_links)
          .where(
            and(
              eq(collection_links.marker_id, input.marker_id),
              eq(collection_links.collection_id, collectionId)
            )
          );

        collectionLinksDeleted = collectionLinksDeleted ?? [];
        collectionLinksDeleted.push(collectionId);
      })
    );
  }

  const result = await db
    .update(markers)
    .set(input.marker)
    .where(eq(markers.marker_id, input.marker_id));

  return {
    collectionLinksDeleted: collectionLinksDeleted,
    collectionLinksCreated: collectionLinksCreated,
    marker: input.marker,
  };
};

// =========== Delete marker ============
export const DeleteMarkerSchema = z.object({
  markerId: z.string(),
});

export const DeleteMarkerReturnSchema = DeleteMarkerSchema;

export type DeleteMarkerParams = {
  mapId: string;
  markerId: string;
};

export const deleteMarker = async (
  db: Database,
  { mapId, markerId }: DeleteMarkerParams
): Promise<z.infer<typeof DeleteMarkerReturnSchema>> => {
  const [deletedMarker] = await db
    .delete(markers)
    .where(eq(markers.marker_id, markerId))
    .returning({ deletedId: markers.marker_id });

  if (!deletedMarker) {
    throw new Error("Error deleting marker.", {
      cause: deletedMarker,
    });
  }

  return { markerId: deletedMarker.deletedId };
};
