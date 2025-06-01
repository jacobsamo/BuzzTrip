import { defineTable } from "convex/server";
import { v } from "convex/values";
import { bounds } from "./shared";
// import type { IconType } from "../types";

type IconType = string;

export const permissionEnum = v.union(
  v.literal("owner"),
  v.literal("editor"),
  v.literal("viewer"),
  v.literal("commenter")
);

export const mapSchema = {
  title: v.string(),
  description: v.optional(v.string()),
  image: v.optional(v.string()),
  icon: v.optional(v.string()),
  color: v.optional(v.string()),
  owner_id: v.id("user_id"),
  location_name: v.optional(v.string()), // the location where the map is saved too e.g Brisbane, Australia, etc
  lat: v.optional(v.float64()),
  lng: v.optional(v.float64()),
  bounds: v.optional(bounds),
  visibility: v.union(
    v.literal("private"),
    v.literal("public"),
    v.literal("unlisted")
  ),
};

export const mapUserSchema = {
    map_id: v.id("maps"),
    user_id: v.id("users"),
    permission: permissionEnum,
  }

export const mapsSchema = {
  maps: defineTable(mapSchema).index("by_visibility", ["visibility"]),
  map_users: defineTable(mapUserSchema)
    .index("by_map_id", ["map_id"])
    .index("by_user_id", ["user_id"]),
  labels: defineTable({
    map_id: v.id("maps"),
    title: v.string(),
    description: v.string(),
    icon: v.string(),
    color: v.string(),
  }).index("by_map_id", ["map_id"]),
  markers: defineTable({
    title: v.string(),
    note: v.string(),
    lat: v.float64(),
    lng: v.float64(),
    created_by: v.string(),
    icon: v.string(),
    color: v.string(),
    place_id: v.id("places"),
    map_id: v.id("maps"),
  })
    .index("by_map_id", ["map_id"])
    .index("by_place_id", ["place_id"]),
  collections: defineTable({
    map_id: v.id("maps"),
    title: v.string(),
    description: v.string(),
    created_by: v.string(),
    icon: v.string(),
    color: v.string(),
  }).index("by_map_id", ["map_id"]),
  collection_links: defineTable({
    collection_id: v.id("collection_id"),
    marker_id: v.id("marker_id"),
    map_id: v.id("maps"),
    user_id: v.id("users"),
  })
    .index("by_map_id", ["map_id"])
    .index("by_collection_id", ["collection_id"]),
  routes: defineTable({
    map_id: v.id("maps"),
    name: v.string(),
    description: v.string(),
    travel_type: v.union(
      v.literal("driving"),
      v.literal("walking"),
      v.literal("transit"),
      v.literal("bicycling")
    ),
    user_id: v.id("users"),
  }).index("by_map_id", ["map_id"]),
  route_stops: defineTable({
    map_id: v.id("maps"),
    route_id: v.id("route_id"),
    marker_id: v.id("marker_id"),
    user_id: v.id("users"),
    lat: v.float64(),
    lng: v.float64(),
    stop_order: v.number(),
  }).index("by_map_id", ["map_id"]),
};
