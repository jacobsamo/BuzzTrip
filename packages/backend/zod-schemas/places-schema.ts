import { zid } from "convex-helpers/server/zod";
import * as z from "zod";
import {
  boundsSchema,
  defaultSchema,
  iconSchema,
  insertSchema,
} from "./shared-schemas";

export const placesSchema = defaultSchema(
  z.object({
    title: z.string(),
    description: z.string().optional(),
    lat: z.number(),
    lng: z.number(),
    bounds: boundsSchema,
    address: z.string().optional(),
    gm_place_id: z.string().optional(), // google maps place id
    mb_place_id: z.string().optional(), // mapbox place id
    fq_place_id: z.string().optional(), // foursquare place id
    plus_code: z.string().optional(), // we can generate this / fetch it
    what3words: z.string().optional(), // we can generate this / fetch it
    icon: iconSchema, // a icon derivtated from the POI type (if provided)
    photos: z.array(z.string()).nullish(), // this will be converted later into the photos list
    rating: z.number(),
    types: z.array(z.string()).nullish(),
    website: z.string().optional(),
    phone: z.string().optional(),
  })
);

export const placesEditSchema = insertSchema(placesSchema);

export const placesReviewSchema = defaultSchema(
  z.object({
    place_id: zid("places"),
    user_id: zid("users"),
    author_name: z.string(),
    author_url: z.string().nullable(),
    profile_photo_url: z.string(),
    rating: z.number().nullable(),
    description: z.string(),
  })
);

export const placesReviewEditSchema = insertSchema(placesReviewSchema);

export const placePhotoSchema = defaultSchema(
  z.object({
    place_id: zid("places"),
    user_id: zid("users"),
    photo_url: z.string(),
    width: z.number(),
    height: z.number(),
    caption: z.string(),
  })
);

export const placePhotoEditSchema = insertSchema(placePhotoSchema);
