import { zid } from "convex-helpers/server/zod4";
import { z } from "zod";
import type { CombinedMarker, IconType } from "../../types";
import { combinedMarkersSchema, markersEditSchema } from "../../zod-schemas";
import { Id } from "../_generated/dataModel";
import { authedMutation, authedQuery, logMapEvent } from "../helpers";
import { createPlace } from "../places";

export const getMarkersView = authedQuery({
  args: {
    mapId: zid("maps"),
    markerId: z.optional(zid("markers")),
  },
  returns: combinedMarkersSchema.array().nullable(),
  handler: async (ctx, { mapId, markerId }) => {
    // Build the initial query on the markers table
    let markersQuery = ctx.db
      .query("markers")
      .withIndex("by_map_id", (q) => q.eq("mapId", mapId));

    // If markerId is provided, add an additional filter
    if (markerId) {
      markersQuery = markersQuery.filter((q) => q.eq(q.field("_id"), markerId));
    }

    // Execute the query to get the markers
    const markers = await markersQuery.collect();

    // For each marker, fetch the associated place and combine the data
    const combinedMarkers = await Promise.all(
      markers
        .filter((m) => !m.isArchived)
        .map(async (marker) => {
          const place = await ctx.db.get(marker.placeId);
          if (!place || place.isArchived) return;

          const newMarker: CombinedMarker = {
            ...marker,
            lat: place?.lat ?? marker.lat,
            lng: place?.lng ?? marker.lng,
            placeId: place?._id ?? marker.placeId,

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
      placeId: zid("places").optional(),
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
      createdBy: ctx.user._id,
      icon: args.marker.icon as IconType,
      color: args.marker.color,
      placeId: place?._id ?? (placeId as Id<"places">),
      mapId: args.mapId,
      updatedAt: args.marker.updatedAt,
      isArchived: false,
    });

    if (args.collectionIds) {
      for (const collectionId of args.collectionIds) {
        await ctx.db.insert("collection_links", {
          markerId: newMarkerId,
          collectionId: collectionId as Id<"collections">,
          mapId: args.mapId,
          userId: ctx.user._id,
          isArchived: false,
        });
      }
    }

    await logMapEvent(
      ctx,
      args.mapId,
      "marker.create",
      {
        markerId: newMarkerId,
        title: args.marker.title,
        placeId: place?._id ?? placeId,
        collectionIds: args.collectionIds,
      },
      ctx.user._id
    );

    return newMarkerId;
  },
});

export const editMarker = authedMutation({
  args: {
    markerId: zid("markers"),
    mapId: zid("maps"),
    marker: markersEditSchema
      .omit({ _id: true, _creationTime: true })
      .partial(),
    collectionIdsToAdd: zid("collections").array().nullish(),
    collectionIdsToRemove: zid("collections").array().nullish(),
  },
  handler: async (ctx, args) => {
    let collectionLinkCreatedIds: string[] | null = null;
    if (args.collectionIdsToAdd) {
      for (const collectionId of args.collectionIdsToAdd) {
        await ctx.db.insert("collection_links", {
          markerId: args.markerId,
          collectionId: collectionId as Id<"collections">,
          mapId: args.mapId,
          userId: ctx.user._id,
          isArchived: false,
        });
        collectionLinkCreatedIds = collectionLinkCreatedIds ?? [];
        collectionLinkCreatedIds.push(collectionId);
      }
    }

    let collectionLinksDeleted: string[] = [];
    if (args.collectionIdsToRemove) {
      for (const collectionId of args.collectionIdsToRemove) {
        const collectionLink = await ctx.db
          .query("collection_links")
          .withIndex("by_collection_id", (q) =>
            q.eq("collectionId", collectionId)
          )
          .first();
        if (!collectionLink) continue;
        await ctx.db.patch(collectionLink._id, { isArchived: true });
        collectionLinksDeleted = collectionLinksDeleted ?? [];
        collectionLinksDeleted.push(collectionId);
      }
    }

    await ctx.db.patch(args.markerId, {
      ...args.marker,
      ...(args.marker.icon ? { icon: args.marker.icon as IconType } : {}),
      updatedAt: new Date().toISOString(),
    });

    await logMapEvent(
      ctx,
      args.mapId,
      "marker.update",
      {
        markerId: args.markerId,
        updatedFields: Object.keys(args.marker),
        collectionLinksAdded: collectionLinkCreatedIds,
        collectionLinksRemoved: collectionLinksDeleted,
      },
      ctx.user._id
    );

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
    const marker = await ctx.db.get(args.markerId);
    if (!marker) throw new Error("Marker not found");

    await ctx.db.patch(args.markerId, {
      isArchived: true,
      updatedAt: new Date().toISOString(),
    });

    await logMapEvent(
      ctx,
      marker.mapId,
      "marker.delete",
      {
        markerId: args.markerId,
        title: marker.title,
      },
      ctx.user._id
    );
  },
});
