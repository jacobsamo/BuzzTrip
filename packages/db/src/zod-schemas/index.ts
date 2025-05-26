import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import * as z from "zod";
import {
  collection_links,
  collections,
  labels,
  map_users,
  maps,
  markers,
  permissionEnum,
  places,
  route_stops,
  routes,
  routeTravelTypeEnum,
  users,
} from "../schemas";
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

export const mapBoundsSchema = bounds.extend({
  offset: z.number().optional(),
});

// Table generated schemas with drizzle-zod
export const usersSchema = createSelectSchema(users);
export const usersEditSchema = createInsertSchema(users);

export const refinedUserSchema = usersSchema.pick({
  id: true,
  email: true,
  username: true,
  first_name: true,
  last_name: true,
  name: true,
  image: true,
});

export const mapsSchema = createSelectSchema(maps).extend({
  icon: iconSchema.nullable(),
  bounds: bounds.nullable(),
});
export const mapsEditSchema = createInsertSchema(maps).extend({
  icon: iconSchema.nullable(),
  bounds: bounds.nullable(),
});

export const labelsSchema = createSelectSchema(labels)
  .extend({
    icon: iconSchema.nullable(),
  })
  .refine((data) => !(data.icon === null && data.color === null), {
    message: "Either icon or color must be provided.",
    path: ["icon"],
  });

export const labelsEditSchema = createInsertSchema(labels)
  .extend({
    icon: iconSchema.nullable(),
  })
  .refine((data) => !(data.icon === null && data.color === null), {
    message: "Either icon or color must be provided.",
    path: ["icon"],
  });

export const markersSchema = createSelectSchema(markers).extend({
  icon: iconSchema,
});
export const markersEditSchema = createInsertSchema(markers).extend({
  icon: iconSchema,
  created_by: z.string().optional(),
});

export const collectionsSchema = createSelectSchema(collections).extend({
  icon: iconSchema,
});
export const collectionsEditSchema = createInsertSchema(collections).extend({
  icon: iconSchema,
});

export const collection_linksSchema = createSelectSchema(collection_links);
export const collection_linksEditSchema = createInsertSchema(collection_links);

export const map_usersSchema = createSelectSchema(map_users);
export const map_usersEditSchema = createInsertSchema(map_users);

export const permissionEnumSchema = z.enum(permissionEnum);

export const travelTypeEnumSchema = z.enum(routeTravelTypeEnum);

export const routesSchema = createSelectSchema(routes);
export const routesEditSchema = createInsertSchema(routes);

export const route_stopsSchema = createSelectSchema(route_stops);
export const route_stopsEditSchema = createInsertSchema(route_stops);

export const placesSchema = createSelectSchema(places).extend({
  icon: iconSchema,
  bounds: boundsSchema,
  photos: z.array(z.string()).nullish(),
  types: z.array(z.string()).nullish(),
  reviews: z.array(reviewsSchema).nullish(),
  opening_times: z.array(z.string()).nullish(),
});

export const placesEditSchema = createInsertSchema(places).extend({
  icon: iconSchema,
  bounds: boundsSchema,
  photos: z.array(z.string()).nullish(),
  types: z.array(z.string()).nullish(),
  reviews: z.array(reviewsSchema).nullish(),
  opening_times: z.array(z.string()).nullish(),
});

// alternative schemas

export const combinedMarkersSchema = placesEditSchema.extend({
  ...markersEditSchema.shape,
  created_by: z.string().optional(),
  place_id: z.string().optional(),
  bounds: boundsSchema.nullable(),
});

export const userMapsSchema = mapsSchema.merge(map_usersSchema);
