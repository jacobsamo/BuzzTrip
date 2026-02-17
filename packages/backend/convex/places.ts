import OpenLocationCode from "open-location-code-typescript";
import type { IconType, NewPlace } from "../types";
import { MutationCtx } from "./_generated/server";
import { geospatial } from "./helpers";

export const createPlace = async (ctx: MutationCtx, place: NewPlace) => {
  let plusCode: string | undefined = undefined;
  try {
    plusCode = OpenLocationCode.encode(place.lat, place.lng);
  } catch (error) {
    console.error(
      `Failed to generate plus code: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }

  const newPlaceId = await ctx.db.insert("places", {
    title: place.title,
    description: place.description,
    lat: place.lat,
    lng: place.lng,
    bounds: place.bounds,
    address: place.address,
    gmPlaceId: place.gmPlaceId,
    mbPlaceId: place.mbPlaceId,
    fqPlaceId: place.fqPlaceId,
    plusCode: plusCode,
    icon: place.icon as IconType,
    photos: place.photos,
    rating: place.rating,
    types: place.types,
    website: place.website,
    phone: place.phone,
    isArchived: false,
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
      plusCode: plusCode ?? null,
      what3words: null,
    }
  );
  return newPlaceId;
};
