import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import {
  collection_links,
  collections,
  map_users,
  maps,
  markers,
  routes,
  route_stops,
  users,
  locations,
  permissionEnum,
} from "../schema";
import * as z from "zod";
import { iconsList } from "../types";

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
const iconSchema = z.enum(iconsList);

export const boundsSchema = z.union([bounds, latlng]);

// Table generated schemas with drizzle-zod
export const usersSchema = createSelectSchema(users);
export const usersEditSchema = createInsertSchema(users).extend({
  icon: iconSchema,
});

export const mapsSchema = createSelectSchema(maps);
export const mapsEditSchema = mapsSchema.extend({
  map_id: z.string().optional(),
});

export const markersSchema = createSelectSchema(markers);
export const markersEditSchema = createInsertSchema(markers).extend({
  icon: iconSchema,
  created_by: z.string().optional(),
});

export const collectionsSchema = createSelectSchema(collections);
export const collectionsEditSchema = createInsertSchema(collections).extend({
  icon: iconSchema,
});

export const collection_linksSchema = createSelectSchema(collection_links);
export const collection_linksEditSchema = createInsertSchema(collection_links);

export const map_usersSchema = createSelectSchema(map_users);
export const map_usersEditSchema = createInsertSchema(map_users);

export const permissionEnumSchema = z.enum(permissionEnum);

export const routesSchema = createSelectSchema(routes);
export const routesEditSchema = createInsertSchema(routes);

export const route_stopsSchema = createSelectSchema(route_stops);
export const route_stopsEditSchema = createInsertSchema(route_stops);

export const locationsSchema = createSelectSchema(locations).extend({
  icon: iconSchema,
  bounds: boundsSchema,
  photos: z.array(z.string()).nullish(),
  types: z.array(z.string()).nullish(),
  reviews: z.array(reviewsSchema).nullish(),
  opening_times: z.array(z.string()).nullish(),
});
export const locationsEditSchema = createInsertSchema(locations).extend({
  icon: iconSchema,
  bounds: boundsSchema,
  photos: z.array(z.string()).nullish(),
  types: z.array(z.string()).nullish(),
  reviews: z.array(reviewsSchema).nullish(),
  opening_times: z.array(z.string()).nullish(),
});

// alternative schemas

export const combinedMarkersSchema = locationsEditSchema.extend({
  ...markersEditSchema.shape,
  created_by: z.string().optional(),
  location_id: z.string().optional(),
  bounds: boundsSchema.nullable(),
});

export const userMapsSchema = mapsSchema.merge(map_usersSchema);
