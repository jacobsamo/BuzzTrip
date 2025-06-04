import { zid } from "convex-helpers/server/zod";
import * as z from "zod";
import {
  defaultSchema,
  iconSchema,
  insertSchema,
  mapBoundsSchema,
} from "./shared-schemas";

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

export const permissionEnumSchema = z.enum(permissionEnum);

export const travelTypeEnumSchema = z.enum(routeTravelTypeEnum);

export const mapsSchema = defaultSchema(
  z.object({
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
  })
);

export const mapsEditSchema = insertSchema(mapsSchema);

export const mapUserSchema = defaultSchema(
  z.object({
    map_id: zid("maps"),
    user_id: zid("user"),
    permission: permissionEnumSchema.default("editor"),
  })
);

export const shareMapUserSchema = mapUserSchema.pick({
  user_id: true,
  permission: true,
});

export const mapUserEditSchema = insertSchema(mapUserSchema);

const labelSchema = z.object({
  map_id: zid("maps"),
  title: z.string(),
  description: z.string(),
  icon: iconSchema.nullish(),
  color: z.string().optional(),
  created_by: zid("user"),
  updatedAt: z.string().datetime().optional(),
});

export const labelsSchema = defaultSchema(labelSchema).refine(
  (data) => !(data.icon === null && data.color === null),
  {
    message: "Either icon or color must be provided.",
    path: ["icon"],
  }
);
export const labelsEditSchema = insertSchema(labelSchema).refine(
  (data) => !(data.icon === null && data.color === null),
  {
    message: "Either icon or color must be provided.",
    path: ["icon"],
  }
);

export const markersSchema = defaultSchema(
  z.object({
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
  })
);

export const markersEditSchema = insertSchema(markersSchema);

export const collectionsSchema = defaultSchema(
  z.object({
    map_id: zid("maps"),
    title: z.string(),
    description: z.string().optional(),
    created_by: zid("user"),
    icon: iconSchema.nullish(),
    color: z.string().optional(),
    updatedAt: z.string().datetime().optional(),
  })
);

export const collectionsEditSchema = insertSchema(collectionsSchema);

export const collection_linksSchema = defaultSchema(
  z.object({
    collection_id: zid("collections"),
    marker_id: zid("markers"),
    map_id: zid("maps"),
    user_id: zid("user"),
  })
);
export const collection_linksEditSchema = insertSchema(collection_linksSchema);

export const routesSchema = defaultSchema(
  z.object({
    map_id: zid("maps"),
    name: z.string(),
    description: z.string().optional(),
    travel_type: travelTypeEnumSchema,
    user_id: zid("user"),
    updatedAt: z.string().datetime().optional(),
  })
);

export const routesEditSchema = insertSchema(routesSchema);

export const route_stopsSchema = defaultSchema(
  z.object({
    map_id: zid("maps"),
    route_id: zid("routes"),
    marker_id: zid("markers"),
    user_id: zid("user"),
    lat: z.number(),
    lng: z.number(),
    stop_order: z.number(),
    updatedAt: z.string().datetime().optional(),
  })
);
export const route_stopsEditSchema = insertSchema(route_stopsSchema);
