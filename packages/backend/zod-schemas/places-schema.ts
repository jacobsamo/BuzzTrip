import { zid } from "convex-helpers/server/zod";
import * as z from "zod";
import { bounds, defaultFields, iconSchema } from "./shared-schemas";

export const placesSchema = z.object({
  ...defaultFields,
  title: z.string(),
  description: z.string().optional(),
  lat: z.number(),
  lng: z.number(),
  bounds: bounds,
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
});

export const placesReviewSchema = z.object({
  ...defaultFields,
  place_id: zid("places"),
  user_id: zid("user"),
  author_name: z.string(),
  author_url: z.string().nullable(),
  profile_photo_url: z.string(),
  rating: z.number().nullable(),
  description: z.string(),
});

export const placePhotoSchema = z.object({
  ...defaultFields,
  place_id: zid("places"),
  user_id: zid("user"),
  photo_url: z.string(),
  width: z.number(),
  height: z.number(),
  caption: z.string(),
});
