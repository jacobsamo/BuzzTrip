import { zid } from "convex-helpers/server/zod";
import { z } from "zod";
import type { CombinedMarker, IconType, NewPlace } from "../../types";
import { combinedMarkersSchema } from "../../zod-schemas";
import { Id } from "../_generated/dataModel";
import { MutationCtx } from "../_generated/server";
import { authedMutation, authedQuery, geospatial } from "../helpers";

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
          ...place,
          ...marker,
          lat: place?.lat ?? marker.lat,
          lng: place?.lng ?? marker.lng,
          place_id: place?._id ?? marker.place_id,
          bounds: place?.bounds ?? null,
          icon: marker.icon as IconType,
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
    marker: combinedMarkersSchema,
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
        ...args.marker,
        bounds: args.marker.bounds ?? {
          lat: args.marker.lat,
          lng: args.marker.lng,
        },
        icon: args.marker.icon as IconType,
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

const createPlace = async (ctx: MutationCtx, place: NewPlace) => {
  const newPlaceId = await ctx.db.insert("places", {
    title: place.title,
    description: place.description,
    lat: place.lat,
    lng: place.lng,
    bounds: place.bounds,
    address: place.address,
    gm_place_id: place.gm_place_id,
    mb_place_id: place.mb_place_id,
    fq_place_id: place.fq_place_id,
    plus_code: place.plus_code,
    icon: place.icon as IconType,
    photos: place.photos,
    rating: place.rating,
    avg_price: place.avg_price,
    types: place.types,
    website: place.website,
    phone: place.phone,
    opening_times: place.opening_times,
  });

  await geospatial.insert(
    ctx,
    newPlaceId,
    {
      latitude: place.lat,
      longitude: place.lng,
    },
    {
      placeTypes: place.types ?? null,
    }
  );
  return newPlaceId;
};

export const editMarker = authedMutation({
  args: {
    marker_id: zid("markers"),
    mapId: zid("maps"),
    marker: combinedMarkersSchema,
    collectionIds_to_add: zid("collections").array().nullable(),
    collectionIds_to_remove: zid("collection_links").array().nullable(),
  },
  handler: async (ctx, args) => {
    let collectionLinkCreatedIds: string[] | null = null;
    if (args.collectionIds_to_add) {
      for (const collectionId of args.collectionIds_to_add) {
        await ctx.db.insert("collection_links", {
          marker_id: args.marker_id,
          collection_id: collectionId,
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
        await ctx.db.delete(collectionId);
        collectionLinksDeleted = collectionLinksDeleted ?? [];
        collectionLinksDeleted.push(collectionId);
      }
    }

    await ctx.db.replace(args.marker_id, {
      ...args.marker,
      _id: args.marker_id,
      map_id: args.mapId,
      icon: args.marker.icon as IconType,
      created_by: ctx.user._id,
      place_id: args.marker.place_id as Id<"places">,
      updatedAt: new Date().toISOString(),
    });

    return {
      collectionLinksDeleted: collectionLinksDeleted,
      collectionLinksCreated: collectionLinkCreatedIds,
    };
  },
});
