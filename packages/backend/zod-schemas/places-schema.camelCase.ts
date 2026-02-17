/**
 * CAMEL CASE VERSION OF PLACES SCHEMA
 *
 * Replace places-schema.ts with this file AFTER running the migration.
 * Rename this file to places-schema.ts after migration is complete.
 */

import { zid } from "convex-helpers/server/zod4";
import * as z from "zod";
import { zodTable } from "./helpers";
import { boundsSchema, iconSchema } from "./shared-schemas";

// Define places table - CAMEL CASE
export const placesTable = zodTable("places", {
  title: z.string(),
  description: z.string().optional(),
  lat: z.number(),
  lng: z.number(),
  bounds: boundsSchema,
  address: z.string().optional(),
  gmPlaceId: z.string().optional(), // was: gm_place_id - google maps place id
  mbPlaceId: z.string().optional(), // was: mb_place_id - mapbox place id
  fqPlaceId: z.string().optional(), // was: fq_place_id - foursquare place id
  plusCode: z.string().optional(), // was: plus_code
  what3words: z.string().optional(),
  icon: iconSchema,
  photos: z.array(z.string()).nullish(),
  rating: z.number(),
  types: z.array(z.string()).nullish(),
  website: z.string().optional(),
  phone: z.string().optional(),
});

export const placesSchema = placesTable.schema;
export const placesEditSchema = placesTable.insertSchema;

// Define placesReviews table - CAMEL CASE (table name)
export const placesReviewsTable = zodTable("placesReviews", {
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

// Define placePhotos table - CAMEL CASE (table name)
export const placePhotosTable = zodTable("placePhotos", {
  placeId: zid("places"),
  userId: zid("users"),
  photoUrl: z.string(),
  width: z.number(),
  height: z.number(),
  caption: z.string(),
});

export const placePhotoSchema = placePhotosTable.schema;
export const placePhotoEditSchema = placePhotosTable.insertSchema;
