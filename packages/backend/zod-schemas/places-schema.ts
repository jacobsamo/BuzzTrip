import { zid } from "convex-helpers/server/zod4";
import * as z from "zod";
import { zodTable } from "./helpers";
import { boundsSchema, iconSchema } from "./shared-schemas";

// Define places table
export const placesTable = zodTable("places", {
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
});

export const placesSchema = placesTable.schema;
export const placesEditSchema = placesTable.insertSchema;

// Define places_reviews table
export const placesReviewsTable = zodTable("places_reviews", {
  placeId: zid("places"),
  userId: zid("users"),
  authorName: z.string(),
  authorUrl: z.string().nullable(),
  profilePhotoUrl: z.string(),
  rating: z.number().nullable(),
  description: z.string(),
});

export const placesReviewSchema = placesReviewsTable.schema;
export const placesReviewEditSchema = placesReviewsTable.insertSchema;

// Define place_photos table
export const placePhotosTable = zodTable("place_photos", {
  placeId: zid("places"),
  userId: zid("users"),
  photoUrl: z.string(),
  width: z.number(),
  height: z.number(),
  caption: z.string(),
});

export const placePhotoSchema = placePhotosTable.schema;
export const placePhotoEditSchema = placePhotosTable.insertSchema;
