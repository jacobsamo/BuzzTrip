import { zid } from "convex-helpers/server/zod";
import { z } from "zod";
import type { CombinedMarker, IconType } from "../../types";
import { combinedMarkersSchema, markersEditSchema } from "../../zod-schemas";
import { Id } from "../_generated/dataModel";
import { authedMutation, authedQuery } from "../helpers";
import { createPlace } from "../places";

export const getMarkersView = authedQuery({
  args: {
    map_id: zid("maps"),
    markerId: z.optional(zid("markers")),
  },
  returns: combinedMarkersSchema.array().nullable(),
  handler: async (ctx, { map_id, markerId }) => {
    // Build the initial query on the markers table
    let markersQuery = ctx.db
      .query("markers")
      .withIndex("by_map_id", (q) => q.eq("map_id", map_id));

    // If markerId is provided, add an additional filter
    if (markerId) {
      markersQuery = markersQuery.filter((q) => q.eq(q.field("_id"), markerId));
    }

    // Execute the query to get the markers
    const markers = await markersQuery.collect();

    // For each marker, fetch the associated place and combine the data
    const combinedMarkers = await Promise.all(
      markers.map(async (marker) => {
        const place = await ctx.db.get(marker.place_id);
        if (!place) return;

        const newMarker: CombinedMarker = {
          ...marker,
          lat: place?.lat ?? marker.lat,
          lng: place?.lng ?? marker.lng,
          place_id: place?._id ?? marker.place_id,

          icon: marker.icon as IconType,
          place: {
            ...place,
            bounds: place?.bounds ?? null,
          },
        };

        return newMarker;
      })
    );

    return combinedMarkers.filter((m): m is CombinedMarker => !!m);
  },
});

// mutations
export const createMarker = authedMutation({
  args: {
    mapId: zid("maps"),
    marker: combinedMarkersSchema.extend({
      place_id: zid("places").optional(),
    }),
    collectionIds: z.string().array().nullish(),
  },
  handler: async (ctx, args) => {
    let placeId: string;
    const place = await ctx.db
      .query("places")
      .withIndex("by_place_lat_lng", (q) =>
        q.eq("lat", args.marker.lat).eq("lng", args.marker.lng)
      )
      .first();

    if (!place) {
      placeId = await createPlace(ctx, {
        ...args.marker.place,
        bounds: args.marker.place.bounds ?? {
          lat: args.marker.place.lat,
          lng: args.marker.place.lng,
        },
        icon: args.marker.place.icon as IconType,
      });
    } else {
      placeId = place._id;
    }

    const newMarkerId = await ctx.db.insert("markers", {
      title: args.marker.title,
      note: args.marker.note,
      lat: args.marker.lat,
      lng: args.marker.lng,
      created_by: ctx.user._id,
      icon: args.marker.icon as IconType,
      color: args.marker.color,
      place_id: place?._id ?? (placeId as Id<"places">),
      map_id: args.mapId,
      updatedAt: args.marker.updatedAt,
    });

    if (args.collectionIds) {
      for (const collectionId of args.collectionIds) {
        await ctx.db.insert("collection_links", {
          marker_id: newMarkerId,
          collection_id: collectionId as Id<"collections">,
          map_id: args.mapId,
          user_id: ctx.user._id,
        });
      }
    }

    return newMarkerId;
  },
});

export const editMarker = authedMutation({
  args: {
    marker_id: zid("markers"),
    mapId: zid("maps"),
    marker: markersEditSchema
      .omit({ _id: true, _creationTime: true })
      .partial(),
    collectionIds_to_add: zid("collections").array().nullish(),
    collectionIds_to_remove: zid("collections").array().nullish(),
  },
  handler: async (ctx, args) => {
    let collectionLinkCreatedIds: string[] | null = null;
    if (args.collectionIds_to_add) {
      for (const collectionId of args.collectionIds_to_add) {
        await ctx.db.insert("collection_links", {
          marker_id: args.marker_id,
          collection_id: collectionId as Id<"collections">,
          map_id: args.mapId,
          user_id: ctx.user._id,
        });
        collectionLinkCreatedIds = collectionLinkCreatedIds ?? [];
        collectionLinkCreatedIds.push(collectionId);
      }
    }

    let collectionLinksDeleted: string[] = [];
    if (args.collectionIds_to_remove) {
      for (const collectionId of args.collectionIds_to_remove) {
        const collectionLink = await ctx.db
          .query("collection_links")
          .withIndex("by_collection_id", (q) =>
            q.eq("collection_id", collectionId)
          )
          .first();
        if (!collectionLink) continue;
        await ctx.db.delete(collectionLink._id);
        collectionLinksDeleted = collectionLinksDeleted ?? [];
        collectionLinksDeleted.push(collectionId);
      }
    }

    await ctx.db.patch(args.marker_id, {
      ...args.marker,
      ...(args.marker.icon ? { icon: args.marker.icon as IconType } : {}),
      updatedAt: new Date().toISOString(),
    });

    return {
      collectionLinksDeleted: collectionLinksDeleted,
      collectionLinksCreated: collectionLinkCreatedIds,
    };
  },
});

export const deleteMarker = authedMutation({
  args: {
    markerId: zid("markers"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.markerId);
  },
});
