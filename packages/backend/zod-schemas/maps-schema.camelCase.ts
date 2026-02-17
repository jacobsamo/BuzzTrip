/**
 * CAMEL CASE VERSION OF MAPS SCHEMA
 *
 * Replace maps-schema.ts with this file AFTER running the migration.
 * Rename this file to maps-schema.ts after migration is complete.
 */

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
  "private",
  "public",
  "unlisted",
] as const;

const mapTypeIdOptions = ["hybrid", "roadmap", "satellite", "terrain"] as const;

export const permissionEnumSchema = z.enum(permissionEnum);

export const travelTypeEnumSchema = z.enum(routeTravelTypeEnum);

export const mapTypeIdEnum = z.enum(mapTypeIdOptions);

// Define maps table - CAMEL CASE
export const mapsTable = zodTable("maps", {
  title: z.string(),
  description: z.string().optional(),
  image: z.string().optional(),
  icon: iconSchema.nullish(),
  color: z.string().optional(),
  ownerId: zid("users"), // was: owner_id
  locationName: z.string().optional(), // was: location_name
  lat: z.optional(z.number()),
  lng: z.optional(z.number()),
  bounds: mapBoundsSchema.nullish(),
  visibility: z.enum(visibilityOptions),
  mapTypeId: mapTypeIdEnum.optional(),
});

export const mapsSchema = mapsTable.schema;
export const mapsEditSchema = mapsTable.insertSchema.extend({
  ownerId: zid("users").optional(),
});

// Define mapUsers table - CAMEL CASE
export const mapUsersTable = zodTable("mapUsers", {
  mapId: zid("maps"), // was: map_id
  userId: zid("users"), // was: user_id
  permission: permissionEnumSchema.default("editor"),
});

export const mapUserSchema = mapUsersTable.schema;
export const mapUserEditSchema = mapUsersTable.insertSchema;

export const shareMapUserSchema = mapUserSchema.pick({
  userId: true,
  permission: true,
});

// Define labels table - CAMEL CASE
const labelSchemaFields = {
  mapId: zid("maps"), // was: map_id
  title: z.string(),
  description: z.string(),
  icon: iconSchema.nullish(),
  color: z.string().optional(),
  createdBy: zid("users"), // was: created_by
};

export const labelsTable = zodTable("labels", labelSchemaFields);

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

// Define markers table - CAMEL CASE
export const markersTable = zodTable("markers", {
  title: z.string(),
  note: z.string().optional(),
  lat: z.number(),
  lng: z.number(),
  createdBy: zid("users"), // was: created_by
  icon: iconSchema,
  color: z.string(),
  placeId: zid("places"), // was: place_id
  mapId: zid("maps"), // was: map_id
});

export const markersSchema = markersTable.schema;
export const markersEditSchema = markersTable.insertSchema.extend({
  createdBy: zid("users").optional(),
});

// Define collections table - CAMEL CASE
export const collectionsTable = zodTable("collections", {
  mapId: zid("maps"), // was: map_id
  title: z.string(),
  description: z.string().optional(),
  createdBy: zid("users"), // was: created_by
  icon: iconSchema,
  color: z.string().optional(),
});

export const collectionsSchema = collectionsTable.schema;
export const collectionsEditSchema = collectionsTable.insertSchema.extend({
  createdBy: zid("users").optional(),
});

// Define collectionLinks table - CAMEL CASE
export const collectionLinksTable = zodTable("collectionLinks", {
  collectionId: zid("collections"), // was: collection_id
  markerId: zid("markers"), // was: marker_id
  mapId: zid("maps"), // was: map_id
  userId: zid("users"), // was: user_id
});

export const collectionLinksSchema = collectionLinksTable.schema;
export const collectionLinksEditSchema = collectionLinksTable.insertSchema;

// Define routes table - CAMEL CASE
export const routesTable = zodTable("routes", {
  mapId: zid("maps"), // was: map_id
  name: z.string(),
  description: z.string().optional(),
  travelType: travelTypeEnumSchema, // was: travel_type
  userId: zid("users"), // was: user_id
});

export const routesSchema = routesTable.schema;
export const routesEditSchema = routesTable.insertSchema;

// Define routeStops table - CAMEL CASE
export const routeStopsTable = zodTable("routeStops", {
  mapId: zid("maps"), // was: map_id
  routeId: zid("routes"), // was: route_id
  markerId: zid("markers"), // was: marker_id
  userId: zid("users"), // was: user_id
  lat: z.number(),
  lng: z.number(),
  stopOrder: z.number(), // was: stop_order
});

export const routeStopsSchema = routeStopsTable.schema;
export const routeStopsEditSchema = routeStopsTable.insertSchema;
