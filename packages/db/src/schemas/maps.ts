import { sql } from "drizzle-orm";
import {
  blob,
  integer,
  real,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import { v4 as uuid } from "uuid";
import type { IconType } from "../types";
import { Bounds } from "../types";
import { users } from "./auth";
import { onUpdateOptions } from "./helpers";
import { places } from "./places";

// enums
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

export const maps = sqliteTable("maps", {
  map_id: text("map_id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => uuid()),
  title: text("title").notNull(),
  description: text("description"),
  image: text("image"),
  icon: text("icon").$type<IconType>(),
  color: text("color"),
  owner_id: text("owner_id")
    .references(() => users.user_id)
    .notNull(),
  lat: real("lat"),
  lng: real("lng"),
  bounds: blob("bounds", { mode: "json" }).$type<Bounds | null>(),
  created_at: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updated_at: text("updated_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});

export const map_users = sqliteTable("map_users", {
  map_user_id: text("map_user_id")
    .primaryKey()
    .notNull()
    .$default(() => uuid()),
  map_id: text("map_id")
    .references(() => maps.map_id, onUpdateOptions)
    .notNull(),
  user_id: text("user_id")
    .references(() => users.user_id)
    .notNull(),
  permission: text("permission", {
    enum: permissionEnum,
  })
    .default("editor")
    .notNull(),
  // created_at: text("created_at")
  //   .default(sql`(CURRENT_TIMESTAMP)`)
  //   .notNull(),
  // updated_at: text("updated_at")
  //   .default(sql`(CURRENT_TIMESTAMP)`)
  //   .notNull(),
});

export const labels = sqliteTable("labels", {
  label_id: text("label_id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => uuid()),
  map_id: text("map_id")
    .references(() => maps.map_id, onUpdateOptions)
    .notNull(),
  title: text("title").notNull(),
  description: text("description"),
  icon: text("icon").$type<IconType>(),
  color: text("color"),
  created_at: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updated_at: text("updated_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});

export const markers = sqliteTable("markers", {
  marker_id: text("marker_id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => uuid()),
  title: text("title").notNull(),
  note: text("note"),
  lat: real("lat").notNull(),
  lng: real("lng").notNull(),
  created_by: text("created_by")
    .notNull()
    .references(() => users.user_id),
  icon: text("icon").$type<IconType>().notNull(),
  color: text("color"),
  place_id: text("place_id")
    .references(() => places.place_id)
    .notNull(),
  map_id: text("map_id")
    .references(() => maps.map_id, onUpdateOptions)
    .notNull(),
  created_at: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updated_at: text("updated_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});

export const collections = sqliteTable("collections", {
  collection_id: text("collection_id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => uuid()),
  map_id: text("map_id")
    .references(() => maps.map_id, onUpdateOptions)
    .notNull(),
  title: text("title").notNull(),
  description: text("description"),
  created_by: text("created_by")
    .notNull()
    .references(() => users.user_id),
  icon: text("icon").$type<IconType>().notNull(),
  color: text("color"),
  created_at: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updated_at: text("updated_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});

export const collection_links = sqliteTable("collection_links", {
  link_id: text("link_id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => uuid()),
  collection_id: text("collection_id").references(
    () => collections.collection_id
  ),
  marker_id: text("marker_id")
    .references(() => markers.marker_id, onUpdateOptions)
    .notNull(),
  map_id: text("map_id")
    .references(() => maps.map_id, onUpdateOptions)
    .notNull(),
  user_id: text("user_id").references(() => users.user_id),
  created_at: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});

export const routes = sqliteTable("routes", {
  route_id: text("route_id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => uuid()),
  map_id: text("map_user_id")
    .notNull()
    .references(() => maps.map_id, onUpdateOptions)
    .notNull(),
  name: text("name").notNull(),
  description: text("description"),
  travel_type: text("travel_type", {
    enum: routeTravelTypeEnum,
  })
    .default("driving")
    .notNull(),
  user_id: text("user_id").references(() => users.user_id),
  created_at: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});

export const route_stops = sqliteTable("route_stops", {
  route_stop_id: text("route_stop_id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => uuid()),
  map_id: text("map_user_id")
    .notNull()
    .references(() => maps.map_id, onUpdateOptions)
    .notNull(),
  route_id: text("route_id")
    .references(() => routes.route_id, onUpdateOptions)
    .notNull(),
  marker_id: text("marker_id").references(() => markers.marker_id),
  lat: real("lat").notNull(),
  lng: real("lng").notNull(),
  stop_order: integer("stop_order").notNull(),
  created_at: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});
