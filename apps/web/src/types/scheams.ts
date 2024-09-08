import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import {
  collection_markers,
  collections,
  map_users,
  maps,
  markers,
  route,
  route_stops,
  users,
  locations,
  markersView
} from "@/server/db/schema";
import * as z from "zod";

// Table generated schemas with drizzle-zod
export const usersEditSchema = createInsertSchema(users);
export const mapsEditSchema = createInsertSchema(maps);
export const markersEditSchema = createInsertSchema(markers);
export const collectionsEditSchema = createInsertSchema(collections);
export const collection_markersEditSchema =
  createInsertSchema(collection_markers);
export const map_usersEditSchema = createInsertSchema(map_users);
export const routeEditSchema = createInsertSchema(route);
export const route_stopsEditSchema = createInsertSchema(route_stops);

export const locationsEditSchema = createInsertSchema(locations);

// Custom schemas
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

