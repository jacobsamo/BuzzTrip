import { zid } from "convex-helpers/server/zod4";
import * as z from "zod";
import { zodTable } from "./helpers";
import { iconSchema, mapBoundsSchema } from "./shared-schemas";

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

const mapTypeIdOptions = ["hybrid", "roadmap", "satellite", "terrain"] as const;

export const permissionEnumSchema = z.enum(permissionEnum);

export const travelTypeEnumSchema = z.enum(routeTravelTypeEnum);

export const mapTypeIdEnum = z.enum(mapTypeIdOptions);

// Define maps table
export const mapsTable = zodTable("maps", {
  title: z.string(),
  description: z.string().optional(),
  image: z.string().optional(),
  icon: iconSchema.nullish(),
  color: z.string().optional(),
  owner_id: zid("users"),
  location_name: z.string().optional(), // the location where the map is saved too e.g Brisbane, Australia, etc
  lat: z.optional(z.number()),
  lng: z.optional(z.number()),
  bounds: mapBoundsSchema.nullish(),
  visibility: z.enum(visibilityOptions),
  mapTypeId: mapTypeIdEnum.optional(),
});

export const mapsSchema = mapsTable.schema;
export const mapsEditSchema = mapsTable.insertSchema.extend({
  owner_id: zid("users").optional(),
});

// Define map_users table
export const mapUsersTable = zodTable("map_users", {
  map_id: zid("maps"),
  user_id: zid("users"),
  permission: permissionEnumSchema.default("editor"),
});

export const mapUserSchema = mapUsersTable.schema;
export const mapUserEditSchema = mapUsersTable.insertSchema;

export const shareMapUserSchema = mapUserSchema.pick({
  user_id: true,
  permission: true,
});

// Define labels table
const labelSchemaFields = {
  map_id: zid("maps"),
  title: z.string(),
  description: z.string(),
  icon: iconSchema.nullish(),
  color: z.string().optional(),
  created_by: zid("users"),
};

export const labelsTable = zodTable("labels", labelSchemaFields);

// Apply refinement to the exported schema
export const labelsSchema = labelsTable.schema.refine(
  (data) => !(data.icon === null && data.color === null),
  {
    message: "Either icon or color must be provided.",
    path: ["icon"],
  }
);

export const labelsEditSchema = labelsTable.insertSchema.refine(
  (data) => !(data.icon === null && data.color === null),
  {
    message: "Either icon or color must be provided.",
    path: ["icon"],
  }
);

// Define markers table
export const markersTable = zodTable("markers", {
  title: z.string(),
  note: z.string().optional(),
  lat: z.number(),
  lng: z.number(),
  created_by: zid("users"),
  icon: iconSchema,
  color: z.string(),
  place_id: zid("places"),
  map_id: zid("maps"),
});

export const markersSchema = markersTable.schema;
export const markersEditSchema = markersTable.insertSchema.extend({
  created_by: zid("users").optional(),
});

// Define collections table
export const collectionsTable = zodTable("collections", {
  map_id: zid("maps"),
  title: z.string(),
  description: z.string().optional(),
  created_by: zid("users"),
  icon: iconSchema,
  color: z.string().optional(),
});

export const collectionsSchema = collectionsTable.schema;
export const collectionsEditSchema = collectionsTable.insertSchema.extend({
  created_by: zid("users").optional(),
});

// Define collection_links table
export const collectionLinksTable = zodTable("collection_links", {
  collection_id: zid("collections"),
  marker_id: zid("markers"),
  map_id: zid("maps"),
  user_id: zid("users"),
});

export const collection_linksSchema = collectionLinksTable.schema;
export const collection_linksEditSchema = collectionLinksTable.insertSchema;

// Define routes table
export const routesTable = zodTable("routes", {
  map_id: zid("maps"),
  name: z.string(),
  description: z.string().optional(),
  travel_type: travelTypeEnumSchema,
  user_id: zid("users"),
});

export const routesSchema = routesTable.schema;
export const routesEditSchema = routesTable.insertSchema;

// Define route_stops table
export const routeStopsTable = zodTable("route_stops", {
  map_id: zid("maps"),
  route_id: zid("routes"),
  marker_id: zid("markers"),
  user_id: zid("users"),
  lat: z.number(),
  lng: z.number(),
  stop_order: z.number(),
});

export const route_stopsSchema = routeStopsTable.schema;
export const route_stopsEditSchema = routeStopsTable.insertSchema;
