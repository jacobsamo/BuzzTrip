import { relations } from "drizzle-orm/relations";
import { users } from "./auth";
import {
  collection_links,
  collections,
  labels,
  map_users,
  maps,
  markers,
  route_stops,
  routes,
} from "./maps";
import { places } from "./places";

// export tables
export * from "./maps";
export * from "./places";
export * from "./auth";

// Relations
export const mapsRelations = relations(maps, ({ one, many }) => ({
  collection_links: many(collection_links),
  collections: many(collections),
  map_users: many(map_users),
  user: one(users, {
    fields: [maps.owner_id],
    references: [users.user_id],
  }),
  markers: many(markers),
  labels: many(labels),
}));

export const labelsRelations = relations(labels, ({ one }) => ({
  map: one(maps, {
    fields: [labels.map_id],
    references: [maps.map_id],
  }),
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
}));

export const markersRelations = relations(markers, ({ one, many }) => ({
  collection_links: many(collection_links),
  map: one(maps, {
    fields: [markers.map_id],
    references: [maps.map_id],
  }),
  place: one(places, {
    fields: [markers.place_id],
    references: [places.place_id],
  }),
  user: one(users, {
    fields: [markers.created_by],
    references: [users.user_id],
  }),
  route_stops: many(route_stops),
}));

export const collectionLinksRelations = relations(
  collection_links,
  ({ one }) => ({
    map: one(maps, {
      fields: [collection_links.map_id],
      references: [maps.map_id],
    }),
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

export const placesRelations = relations(places, ({ many }) => ({
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
