import * as z from "zod";

export const reviewsSchema = z.object({
  author_name: z.string(),
  author_url: z.string().nullable(),
  profile_photo_url: z.string(),
  rating: z.number().nullable(),
  description: z.string(),
});

export const bounds = z.object({
  east: z.number(),
  north: z.number(),
  south: z.number(),
  west: z.number(),
});

export const latlng = z.object({
  lat: z.number(),
  lng: z.number(),
});

export const boundsSchema = z.union([bounds, latlng]).nullish();

export const locationsSchema = z.object({
  address: z.string().nullable(),
  avg_price: z.number().nullable(),
  bounds: boundsSchema,
  created_at: z.string(),
  description: z.string().nullable(),
  gm_place_id: z.string().nullable(),
  icon: z.string().nullable(),
  lat: z.number(),
  lng: z.number(),
  opening_times: z.string().array().nullable(),
  phone: z.string().nullable(),
  photos: z.string().array().nullable(),
  rating: z.number().nullable(),
  reviews: reviewsSchema.array().nullable(),
  title: z.string(),
  types: z.string().array().nullable(),
  uid: z.string(),
  updated_at: z.string(),
  website: z.string().nullable(),
});

export const locationsEditSchema = locationsSchema.extend({
  address: z.string().nullish(),
  avg_price: z.number().nullish(),
  bounds: boundsSchema,
  created_at: z.string().optional(),
  description: z.string().nullish(),
  gm_place_id: z.string().nullish(),
  icon: z.string().nullish(),
  lat: z.number(),
  lng: z.number(),
  opening_times: z.string().array().nullish(),
  phone: z.string().nullish(),
  photos: z.string().array().nullish(),
  rating: z.number().nullish(),
  reviews: reviewsSchema.array().nullish(),
  title: z.string(),
  types: z.string().array().nullish(),
  uid: z.string().optional(),
  updated_at: z.string().optional(),
  website: z.string().nullish(),
});

export const markersSchema = locationsSchema.extend({
  collection_id: z.string(),
  color: z.string().nullish(),
  created_at: z.string().optional(),
  created_by: z.string(),
  icon: z.string().nullish(),
  location_id: z.string().nullish(),
  map_id: z.string(),
  note: z.string().nullish(),
  title: z.string().nullish(),
  uid: z.string().optional(),
});

export const markersEditSchema = z.object({
  collection_id: z.string(),
  color: z.string().nullish(),
  created_at: z.string().optional(),
  created_by: z.string(),
  icon: z.string().nullish(),
  lat: z.number().nullish(),
  lng: z.number().nullish(),
  location_id: z.string().nullish(),
  map_id: z.string(),
  note: z.string().nullish(),
  title: z.string().nullish(),
  uid: z.string().optional(),
});

export const mapSchema = z.object({
  created_at: z.string(),
  created_by: z.string(),
  description: z.string().nullable(),
  image: z.string().nullable(),
  title: z.string(),
  uid: z.string(),
});

export const collectionSchema = z.object({
  color: z.string().nullable(),
  description: z.string().nullable(),
  icon: z.string().nullable(),
  map_id: z.string(),
  title: z.string(),
});

export const permissionLevel = z.enum(["viewer", "editor", "admin", "owner"]);

export const sharedMapSchema = z.object({
  map_id: z.string(),
  permission: permissionLevel,
  user_id: z.string(),
});
