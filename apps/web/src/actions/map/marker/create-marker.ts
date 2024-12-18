"use server";
import { authAction } from "@/actions/safe-action";
import type { IconType } from "@buzztrip/db/types";
import { db } from "@/server/db";
import { getMarkersView } from "@buzztrip/db/queries";
import { collection_links, locations, markers } from "@buzztrip/db/schema";
import { NewCollectionLink, NewLocation, NewMarker } from "@buzztrip/db/types";
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

    // Wrap in a transaction as we don't want to create a marker without a location

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

      // if location exists set the location id
      if (location) {
        locationId = location.location_id;
      } else {
        // otherwise create a new location
        const newLocation: NewLocation = {
          ...params.marker,
          location_id: locationId,
          icon: params.marker.icon as IconType,
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
        ...params.marker,
        marker_id: id,
        icon: params.marker.icon as IconType,
        created_by: ctx.user.id,
        location_id: locationId,
      });
    });

    // Create collection marker links if collectionIds exist
    let collectionsLinks: NewCollectionLink[] = [];
    // if (params.collectionIds) {
    //   await Promise.all(
    //     params.collectionIds.map(async (collectionId) => {
    //       const collectionLink: NewCollectionLink = {
    //         marker_id: id,
    //         collection_id: collectionId,
    //         map_id: params.marker.map_id,
    //         user_id: ctx.user.id,
    //       };
    //       const result = await db
    //         .insert(collection_links)
    //         .values(collectionLink);
    //       if (!result) {
    //         throw new Error("Error creating new collection marker.", {
    //           cause: result,
    //         });
    //       }
    //     })
    //   );
    // }
    if (params.collectionIds) {
      params.collectionIds.map(async (collectionId) => {
        collectionsLinks.push({
          marker_id: id,
          collection_id: collectionId,
          map_id: params.marker.map_id,
          user_id: ctx.user.id,
        });
      });
    }
    
    await db.insert(collection_links).values(collectionsLinks);

    // Fetch new markers and collection links
    const [newMarkers, collectionLinks] = await Promise.all([
      getMarkersView(db, params.marker.map_id!),
      db
        .select()
        .from(collection_links)
        .where(eq(collection_links.marker_id, id)),
    ]);

    return {
      markers: newMarkers,
      collectionLinks,
    };
  });
