/**
 * CAMEL CASE VERSION OF SCHEMA
 *
 * Replace schema.ts with this file AFTER running the migration.
 * Rename this file to schema.ts after migration is complete.
 *
 * NOTE: Table names in Convex cannot be changed via migration.
 * You'll need to create new tables and migrate data if you want to rename tables.
 * This schema keeps the original table names but updates field names and index references.
 */

import { defineSchema } from "convex/server";
import { mapEventTable, mapViewsTable } from "../zod-schemas/analytics-schema";
import { betaUsersTable, usersTable } from "../zod-schemas/auth-schema.camelCase";
import { dataLayerTable } from "../zod-schemas/data-layers-schema";
import {
  collectionLinksTable,
  collectionsTable,
  labelsTable,
  mapsTable,
  mapUsersTable,
  markersTable,
  routesTable,
  routeStopsTable,
} from "../zod-schemas/maps-schema.camelCase";
import { pathsTable } from "../zod-schemas/paths-schema";
import {
  placePhotosTable,
  placesReviewsTable,
  placesTable,
} from "../zod-schemas/places-schema.camelCase";

export default defineSchema({
  // maps
  maps: mapsTable.table().index("by_visibility", ["visibility"]),
  mapViews: mapViewsTable
    .table()
    .index("by_map_id", ["mapId"])
    .index("by_user_id", ["userId"]),

  // Note: Table names can't be changed via migration
  // Keeping "map_users" but fields are now camelCase
  map_users: mapUsersTable
    .table()
    .index("by_map_id", ["mapId"]) // was: map_id
    .index("by_user_id", ["userId"]), // was: user_id

  labels: labelsTable.table().index("by_map_id", ["mapId"]), // was: map_id

  mapEvents: mapEventTable
    .table()
    .index("by_map_id", ["mapId"])
    .index("by_user_id", ["userId"]),

  // Map data
  dataLayers: dataLayerTable
    .table()
    .index("by_map_id", ["mapId"])
    .index("by_created_by", ["createdBy"]),

  markers: markersTable
    .table()
    .index("by_map_id", ["mapId"]) // was: map_id
    .index("by_place_id", ["placeId"]), // was: place_id

  paths: pathsTable.table().index("byMapId", ["mapId"]),

  collections: collectionsTable.table().index("by_map_id", ["mapId"]), // was: map_id

  // Note: Table names can't be changed via migration
  collection_links: collectionLinksTable
    .table()
    .index("by_map_id", ["mapId"]) // was: map_id
    .index("by_collection_id", ["collectionId"]), // was: collection_id

  routes: routesTable.table().index("by_map_id", ["mapId"]), // was: map_id

  // Note: Table names can't be changed via migration
  route_stops: routeStopsTable.table().index("by_map_id", ["mapId"]), // was: map_id

  // places
  places: placesTable
    .table()
    .index("gm_place_id_idx", ["gmPlaceId"]) // was: gm_place_id
    .index("mb_place_id_idx", ["mbPlaceId"]) // was: mb_place_id
    .index("fq_place_id_idx", ["fqPlaceId"]) // was: fq_place_id
    .index("places_lat_idx", ["lat"])
    .index("places_lng_idx", ["lng"])
    .index("by_place_lat_lng", ["lat", "lng"])
    .index("places_address_idx", ["address"]),

  // Note: Table names can't be changed via migration
  places_reviews: placesReviewsTable.table(),
  place_photos: placePhotosTable.table(),

  users: usersTable
    .table()
    .index("by_email", ["email"])
    .index("by_clerk_id", ["clerkUserId"])
    .index("by_isBetaUser", ["isBetaUser"])
    .searchIndex("search_user", {
      searchField: "name",
      filterFields: ["email", "username"],
    }),

  // Note: Table names can't be changed via migration
  beta_users: betaUsersTable
    .table()
    .index("by_email", ["email"])
    .index("by_token", ["token"])
    .index("by_user_id", ["userId"]),
});
