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
    plus_code: z.string().optional(),
    icon: iconSchema,
    photos: z.array(z.string()).nullish(),
    rating: z.number(),
    avg_price: z.number().optional(),
    types: z.array(z.string()).nullish(),
    website: z.string().optional(),
    phone: z.string().optional(),
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
