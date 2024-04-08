import * as z from "zod";

export const reviewSchema = z.object({
  author_name: z.string(),
  author_url: z.string().nullable(),
  profile_photo_url: z.string(),
  rating: z.number().nullable(),
  description: z.string(),
});

export const locationSchema = z.object({
  place_id: z.string().nullable(),
  title: z.string(),
  description: z.string().nullable(),
  address: z.string().nullable(),
  lat: z.number(),
  lng: z.number(),
  icon: z.string().nullable(),
  photos: z.string().array().nullable(),
  reviews: reviewSchema.array().nullable(),
  rating: z.number().nullable(),
  avg_price: z.number().nullable(),
  types: z.string().array().nullable(),
  website: z.string().nullable(),
  phone: z.string().nullable(),
  opening_times: z.string().array().nullable(),
});

export const markerEditSchema = z.object({
  uid: z.string(),
  title: z.string(),
  color: z.string().nullable(),
  description: z.string().nullable(),
  collection_id: z.string(),
});

export const markerSchema = locationSchema.extend({
  ...markerEditSchema.shape,
  map_id: z.string(),
  created_by: z.string(),
});

export const collectionSchema = z.object({
  color: z.string().nullable(),
  description: z.string().nullable(),
  icon: z.string().nullable(),
  map_id: z.string(),
  title: z.string(),
});

const permissionLevel = z.enum(["viewer", "editor", "admin", "owner"]);

export const sharedMapSchema = z.object({
  map_id: z.string(),
  permission: permissionLevel,
  user_id: z.string(),
});
