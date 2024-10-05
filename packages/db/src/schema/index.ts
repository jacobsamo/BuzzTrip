import { IconName } from "@buzztrip/components/icon";
import { Bounds, Review } from "../types";
import { eq, sql } from "drizzle-orm";
import {
  integer,
  real,
  text,
  sqliteTable,
  sqliteView,
} from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm/relations";
import { v4 as uuid } from "uuid";

export const users = sqliteTable("users", {
  user_id: text("user_id").primaryKey().notNull(),
  first_name: text("first_name"),
  last_name: text("last_name"),
  username: text("username").unique(),
  email: text("email").notNull().unique(),
  created_at: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
  updated_at: text("updated_at").default(sql`(CURRENT_TIMESTAMP)`),
});

export const maps = sqliteTable("maps", {
  map_id: text("map_id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => uuid()),
  title: text("title").notNull(),
  description: text("description"),
  image: text("image"),
  owner_id: text("owner_id")
    .notNull()
    .references(() => users.user_id),
});

export const markers = sqliteTable("markers", {
  marker_id: text("marker_id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => uuid()),
  collection_id: text("collection_id").references(
    () => collections.collection_id
  ),
  title: text("title").notNull(),
  note: text("note"),
  lat: real("lat").notNull(),
  lng: real("lng").notNull(),
  created_by: text("created_by")
    .notNull()
    .references(() => users.user_id),
  created_at: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
  icon: text("icon").$type<IconName>().notNull(),
  color: text("color"),
  location_id: text("location_id").references(() => locations.location_id),
  map_id: text("map_id").references(() => maps.map_id),
});

export const locations = sqliteTable("locations", {
  location_id: text("location_id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => uuid()),
  title: text("title").notNull(),
  description: text("description"),
  lat: real("lat").notNull(),
  lng: real("lng").notNull(),
  bounds: text("bounds", { mode: "json" }).notNull().$type<Bounds | null>(),
  address: text("address"),
  gm_place_id: text("gm_place_id"),
  icon: text("icon").$type<IconName>().notNull(),
  photos: text("photos", { mode: "json" }).$type<string[] | null>(),
  reviews: text("reviews", { mode: "json" }).$type<Review[] | null>(),
  rating: real("rating"),
  avg_price: integer("avg_price"),
  types: text("types", { mode: "json" }).$type<string[] | null>(),
  website: text("website"),
  phone: text("phone"),
  opening_times: text("opening_times", { mode: "json" }).$type<
    string[] | null
  >(),
  created_at: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
  updated_at: text("updated_at").default(sql`(CURRENT_TIMESTAMP)`),
});

export const collections = sqliteTable("collections", {
  collection_id: text("collection_id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => uuid()),
  map_id: text("map_id").references(() => maps.map_id),
  title: text("title").notNull(),
  description: text("description"),
  created_by: text("created_by")
    .notNull()
    .references(() => users.user_id),
  created_at: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
  icon: text("icon").$type<IconName>().notNull(),
  color: text("color"),
});

export const collection_markers = sqliteTable("collection_markers", {
  link_id: text("link_id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => uuid()),
  collection_id: text("collection_id").references(
    () => collections.collection_id
  ),
  marker_id: text("marker_id").references(() => markers.marker_id),
  map_id: text("map_id").references(() => maps.map_id),
  user_id: text("user_id").references(() => users.user_id),
});

export const map_users = sqliteTable("map_users", {
  map_id: text("map_id")
    .references(() => maps.map_id)
    .$defaultFn(() => uuid()),
  user_id: text("user_id").references(() => users.user_id),
  permission: text("permission", {
    enum: ["owner", "editor", "viewer", "commentor"],
  })
    .default("editor")
    .notNull(),
});

export const route = sqliteTable("route", {
  route_id: text("route_id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => uuid()),
  name: text("name").notNull(),
  description: text("description"),
  user_id: text("user_id").references(() => users.user_id),
});

export const route_stops = sqliteTable("route_stops", {
  route_stop_id: text("route_stop_id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => uuid()),
  route_id: text("route_id").references(() => route.route_id),
  marker_id: text("marker_id").references(() => markers.marker_id),
  stop_order: integer("stop_order").notNull(),
});

// views
// export const markersView = sqliteView("markers_view").as((qb) =>
//   qb
//     .select()
//     .from(markers)
//     .leftJoin(locations, eq(markers.location_id, locations.location_id))
// );

// export const collectionMarkersRelations = relations(
//   collection_markers,
//   ({ one }) => ({
//     collection: one(collections, {
//       fields: [collection_markers.collection_id],
//       references: [collections.collection_id],
//     }),
//     marker: one(markers, {
//       fields: [collection_markers.marker_id],
//       references: [markers.marker_id],
//     }),
//     user: one(users, {
//       fields: [collection_markers.user_id],
//       references: [users.user_id],
//     }),
//   })
// );

// export const mapsRelations = relations(maps, ({ one, many }) => ({
//   collection_markers: many(collection_markers),
//   collections: many(collections),
//   map_users: many(map_users),
//   user: one(users, {
//     fields: [maps.owner_id],
//     references: [users.user_id],
//   }),
//   markers: many(markers),
// }));

// export const markersRelations = relations(markers, ({ one, many }) => ({
//   collection_markers: many(collection_markers),
//   map: one(maps, {
//     fields: [markers.map_id],
//     references: [maps.map_id],
//   }),
//   location: one(locations, {
//     fields: [markers.location_id],
//     references: [locations.location_id],
//   }),
//   user: one(users, {
//     fields: [markers.created_by],
//     references: [users.user_id],
//   }),
//   collection: one(collections, {
//     fields: [markers.collection_id],
//     references: [collections.collection_id],
//   }),
//   route_stops: many(route_stops),
// }));

// export const collectionsRelations = relations(collections, ({ one, many }) => ({
//   collection_markers: many(collection_markers),
//   user: one(users, {
//     fields: [collections.created_by],
//     references: [users.user_id],
//   }),
//   map: one(maps, {
//     fields: [collections.map_id],
//     references: [maps.map_id],
//   }),
//   markers: many(markers),
// }));

// export const usersRelations = relations(users, ({ many }) => ({
//   collections: many(collections),
//   map_users: many(map_users),
//   maps: many(maps),
//   markers: many(markers),
//   routes: many(route),
// }));

// export const mapUsersRelations = relations(map_users, ({ one }) => ({
//   user: one(users, {
//     fields: [map_users.user_id],
//     references: [users.user_id],
//   }),
//   map: one(maps, {
//     fields: [map_users.map_id],
//     references: [maps.map_id],
//   }),
// }));

// export const locationsRelations = relations(locations, ({ many }) => ({
//   markers: many(markers),
// }));

// export const routeRelations = relations(route, ({ one, many }) => ({
//   user: one(users, {
//     fields: [route.user_id],
//     references: [users.user_id],
//   }),
//   routeStops: many(route_stops),
// }));

// export const routeStopsRelations = relations(route_stops, ({ one }) => ({
//   marker: one(markers, {
//     fields: [route_stops.marker_id],
//     references: [markers.marker_id],
//   }),
//   route: one(route, {
//     fields: [route_stops.route_id],
//     references: [route.route_id],
//   }),
// }));
