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
} from "@/server/db/schema";
import * as z from "zod";
import { readOnlyIconsArray } from "@/components/icon/icons";

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
const iconSchema = z.enum(readOnlyIconsArray);

export const boundsSchema = z.union([bounds, latlng]);

// Table generated schemas with drizzle-zod
export const usersEditSchema = createInsertSchema(users).extend({
  icon: iconSchema,
});
export const mapsEditSchema = createInsertSchema(maps).extend({
  map_id: z.string().optional(),
  icon: iconSchema,
});
export const markersEditSchema = createInsertSchema(markers).extend({
  icon: iconSchema,
  created_by: z.string().optional(),
});
export const collectionsEditSchema = createInsertSchema(collections).extend({
  icon: iconSchema,
});
export const collection_markersEditSchema =
  createInsertSchema(collection_markers);
export const map_usersEditSchema = createInsertSchema(map_users);
export const routeEditSchema = createInsertSchema(route);
export const route_stopsEditSchema = createInsertSchema(route_stops);

export const locationsEditSchema = createInsertSchema(locations).extend({
  icon: iconSchema,
  bounds: boundsSchema,
  photos: z.array(z.string()).nullish(),
  types: z.array(z.string()).nullish(),
  reviews: z.array(reviewsSchema).nullish(),
  opening_times: z.array(z.string()).nullish(),
});
export const locationsSchema = createSelectSchema(locations).extend({
  icon: iconSchema,
  bounds: boundsSchema,
  photos: z.array(z.string()).nullish(),
  types: z.array(z.string()).nullish(),
  reviews: z.array(reviewsSchema).nullish(),
  opening_times: z.array(z.string()).nullish(),
});

export const combinedMarkersSchema = locationsEditSchema.extend({
  ...markersEditSchema.shape,
});
