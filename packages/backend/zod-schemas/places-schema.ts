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
    address: z.string(),
    gm_place_id: z.string(), // google maps place id
    mb_place_id: z.string(), // mapbox place id
    fq_place_id: z.string(), // foursquare place id
    plus_code: z.string(),
    icon: iconSchema,
    photos: z.array(z.string()).nullish(),
    rating: z.number(),
    avg_price: z.number(),
    types: z.array(z.string()).nullish(),
    website: z.string(),
    phone: z.string(),
    opening_times: z.array(z.string()).nullish(),
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
