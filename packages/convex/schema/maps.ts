import { defineTable } from "convex/server";
import { v } from "convex/values";
import { bounds } from "./shared";
// import type { IconType } from "../types";

type IconType = string;

const visibilityOptions = [
  "private", //Only the owner + shared people can access
  "public", //Publicly viewable + indexed/searchable
  "unlisted", //Viewable with link, but not discoverable
] as const;

export const mapsSchema = {
  maps: defineTable({
    map_id: v.id("map_id"),
    title: v.string(),
    description: v.optional(v.string()),
    image: v.string(),
    icon: v.string(),
    color: v.string(),
    owner_id: v.id("user_id"),
    location_name: v.string(), // the location where the map is saved too e.g Brisbane, Australia, etc
    lat: v.float64(),
    lng: v.float64(),
    bounds: v.optional(bounds),
    visibility: v.union(
      v.literal("private"),
      v.literal("public"),
      v.literal("unlisted")
    ),
  }),
  map_users: defineTable({
    map_user_id: v.id("map_user_id"),
    map_id: v.id("map_id"),
    user_id: v.id("user_id"),
    permission: v.union(
      v.literal("owner"),
      v.literal("editor"),
      v.literal("viewer"),
      v.literal("commenter")
    ),
  }),
  labels: defineTable({
    label_id: v.id("label_id"),
    map_id: v.id("map_id"),
    title: v.string(),
    description: v.string(),
    icon: v.string(),
    color: v.string(),
  }),
  markers: defineTable({
    marker_id: v.id("marker_id"),
    title: v.string(),
    note: v.string(),
    lat: v.float64(),
    lng: v.float64(),
    created_by: v.string(),
    icon: v.string(),
    color: v.string(),
    place_id: v.string(),
    map_id: v.id("map_id"),
  }),
  collections: defineTable({
    collection_id: v.id("collection_id"),
    map_id: v.id("map_id"),
    title: v.string(),
    description: v.string(),
    created_by: v.string(),
    icon: v.string(),
    color: v.string(),
  }),
  collection_links: defineTable({
    link_id: v.id("link_id"),
    collection_id: v.id("collection_id"),
    marker_id: v.id("marker_id"),
    map_id: v.id("map_id"),
    user_id: v.id("user_id"),
  }),
  routes: defineTable({
    route_id: v.id("route_id"),
    map_id: v.id("map_id"),
    name: v.string(),
    description: v.string(),
    travel_type: v.union(
      v.literal("driving"),
      v.literal("walking"),
      v.literal("transit"),
      v.literal("bicycling")
    ),
    user_id: v.id("user_id"),
  }),
  route_stops: defineTable({
    route_stop_id: v.id("route_stop_id"),
    map_id: v.id("map_id"),
    route_id: v.id("route_id"),
    marker_id: v.id("marker_id"),
    user_id: v.id("user_id"),
    lat: v.float64(),
    lng: v.float64(),
    stop_order: v.number(),
  }),
};
