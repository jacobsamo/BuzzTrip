import { zid } from "convex-helpers/server/zod";
import * as z from "zod";
import { defaultFields, iconSchema, mapBoundsSchema } from "./shared-schemas";

export const permissionEnum = [
  "owner",
  "editor",
  "viewer",
  "commenter",
] as const;

export const routeTravelTypeEnum = [
  "driving",
  "walking",
  "transit",
  "bicycling",
] as const;

const visibilityOptions = [
  "private", //Only the owner + shared people can access
  "public", //Publicly viewable + indexed/searchable
  "unlisted", //Viewable with link, but not discoverable
] as const;

export const mapSchema = z.object({
  ...defaultFields,
  title: z.string(),
  description: z.string().optional(),
  image: z.string().optional(),
  icon: iconSchema.nullish(),
  color: z.string().optional(),
  owner_id: zid("user"),
  location_name: z.string().optional(), // the location where the map is saved too e.g Brisbane, Australia, etc
  lat: z.optional(z.number()),
  lng: z.optional(z.number()),
  bounds: mapBoundsSchema.nullish(),
  visibility: z.enum(visibilityOptions),
  updatedAt: z.string().datetime().optional(),
});

export const mapUserSchema = z.object({
  ...defaultFields,
  map_id: zid("maps"),
  user_id: zid("user"),
  permission: z.enum(permissionEnum).default("editor"),
});

export const labelsSchema = z
  .object({
    ...defaultFields,
    map_id: zid("maps"),
    title: z.string(),
    description: z.string(),
    icon: iconSchema.nullish(),
    color: z.string().optional(),
    updatedAt: z.string().datetime().optional(),
  })
  .refine((data) => !(data.icon === null && data.color === null), {
    message: "Either icon or color must be provided.",
    path: ["icon"],
  });

export const markersSchema = z.object({
  ...defaultFields,
  title: z.string(),
  note: z.string().optional(),
  lat: z.number(),
  lng: z.number(),
  created_by: zid("user"),
  icon: iconSchema.nullish(),
  color: z.string(),
  place_id: zid("places"),
  map_id: zid("maps"),
  updatedAt: z.string().datetime().optional(),
});

export const collectionsSchema = z.object({
  ...defaultFields,
  map_id: zid("maps"),
  title: z.string(),
  description: z.string().optional(),
  created_by: zid("user"),
  icon: iconSchema.nullish(),
  color: z.string().optional(),
  updatedAt: z.string().datetime().optional(),
});
export const collection_linksSchema = z.object({
  ...defaultFields,
  collection_id: zid("collection_id"),
  marker_id: zid("marker_id"),
  map_id: zid("maps"),
  user_id: zid("user"),
});

export const routesSchema = z.object({
  ...defaultFields,
  map_id: zid("maps"),
  name: z.string(),
  description: z.string().optional(),
  travel_type: z.enum(routeTravelTypeEnum),
  user_id: zid("user"),
  updatedAt: z.string().datetime().optional(),
});
export const route_stopsSchema = z.object({
  ...defaultFields,
  map_id: zid("maps"),
  route_id: zid("route_id"),
  marker_id: zid("marker_id"),
  user_id: zid("user"),
  lat: z.number(),
  lng: z.number(),
  stop_order: z.number(),
  updatedAt: z.string().datetime().optional(),
});
