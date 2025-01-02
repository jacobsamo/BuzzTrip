import { sql } from "drizzle-orm";
import { relations } from "drizzle-orm/relations";
import {
  integer,
  real,
  type ReferenceConfig,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import { v4 as uuid } from "uuid";
import type { IconType } from "../types";
import { Bounds, Review } from "../types";

const onUpdateOptions: ReferenceConfig["actions"] = {
  onDelete: "cascade",
  onUpdate: "no action",
};

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
    .references(() => users.user_id)
    .notNull(),
});

export const permissionEnum = [
  "owner",
  "editor",
  "viewer",
  "commenter",
] as const;

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
  created_at: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
  icon: text("icon").$type<IconType>().notNull(),
  color: text("color"),
  location_id: text("location_id")
    .references(() => locations.location_id)
    .notNull(),
  map_id: text("map_id")
    .references(() => maps.map_id, onUpdateOptions)
    .notNull(),
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
  gm_place_id: text("gm_place_id"), // google maps place id
  // mb_place_id: text("mb_place_id"), // mapbox place id
  // fq_place_id: text("fq_place_id"), // foursquare place id
  // plus_code: text("plus_code"),
  icon: text("icon").$type<IconType>().notNull(),
  photos: text("photos", { mode: "json" }).$type<string[] | null>(),
  reviews: text("reviews", { mode: "json" }).$type<Review[] | null>(),
  rating: real("rating"),
  avg_price: integer("avg_price"),
  types: text("types", { mode: "json" }).$type<string[] | null>(),
  website: text("website"),
  // menu: text("menu"),
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
  map_id: text("map_id")
    .references(() => maps.map_id, onUpdateOptions)
    .notNull(),
  title: text("title").notNull(),
  description: text("description"),
  created_by: text("created_by")
    .notNull()
    .references(() => users.user_id),
  created_at: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
  icon: text("icon").$type<IconType>().notNull(),
  color: text("color"),
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
  user_id: text("user_id").references(() => users.user_id),
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
  stop_order: integer("stop_order").notNull(),
});

export const collectionLinksRelations = relations(
  collection_links,
  ({ one }) => ({
    collection: one(collections, {
      fields: [collection_links.collection_id],
      references: [collections.collection_id],
    }),
    marker: one(markers, {
      fields: [collection_links.marker_id],
      references: [markers.marker_id],
    }),
    user: one(users, {
      fields: [collection_links.user_id],
      references: [users.user_id],
    }),
  })
);

export const mapsRelations = relations(maps, ({ one, many }) => ({
  collection_links: many(collection_links),
  collections: many(collections),
  map_users: many(map_users),
  user: one(users, {
    fields: [maps.owner_id],
    references: [users.user_id],
  }),
  markers: many(markers),
}));

export const markersRelations = relations(markers, ({ one, many }) => ({
  collection_links: many(collection_links),
  map: one(maps, {
    fields: [markers.map_id],
    references: [maps.map_id],
  }),
  location: one(locations, {
    fields: [markers.location_id],
    references: [locations.location_id],
  }),
  user: one(users, {
    fields: [markers.created_by],
    references: [users.user_id],
  }),
  route_stops: many(route_stops),
}));

export const collectionsRelations = relations(collections, ({ one, many }) => ({
  collection_links: many(collection_links),
  user: one(users, {
    fields: [collections.created_by],
    references: [users.user_id],
  }),
  map: one(maps, {
    fields: [collections.map_id],
    references: [maps.map_id],
  }),
  markers: many(markers),
}));

export const usersRelations = relations(users, ({ many }) => ({
  collections: many(collections),
  map_users: many(map_users),
  maps: many(maps),
  markers: many(markers),
  routes: many(routes),
}));

export const mapUsersRelations = relations(map_users, ({ one }) => ({
  user: one(users, {
    fields: [map_users.user_id],
    references: [users.user_id],
  }),
  map: one(maps, {
    fields: [map_users.map_id],
    references: [maps.map_id],
  }),
}));

export const locationsRelations = relations(locations, ({ many }) => ({
  markers: many(markers),
}));

export const routeRelations = relations(routes, ({ one, many }) => ({
  user: one(users, {
    fields: [routes.user_id],
    references: [users.user_id],
  }),
  routeStops: many(route_stops),
}));

export const routeStopsRelations = relations(route_stops, ({ one }) => ({
  marker: one(markers, {
    fields: [route_stops.marker_id],
    references: [markers.marker_id],
  }),
  route: one(routes, {
    fields: [route_stops.route_id],
    references: [routes.route_id],
  }),
}));
