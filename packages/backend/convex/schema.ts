import { defineSchema } from "convex/server";
import { mapEventTable, mapViewsTable } from "../zod-schemas/analytics-schema";
import { betaUsersTable, usersTable } from "../zod-schemas/auth-schema";
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
} from "../zod-schemas/maps-schema";
import { pathsTable } from "../zod-schemas/paths-schema";
import {
  placePhotosTable,
  placesReviewsTable,
  placesTable,
} from "../zod-schemas/places-schema";

export default defineSchema({
  // maps
  maps: mapsTable.table().index("by_visibility", ["visibility"]),
  mapViews: mapViewsTable
    .table()
    .index("by_map_id", ["mapId"])
    .index("by_user_id", ["userId"]),
  map_users: mapUsersTable
    .table()
    .index("by_map_id", ["map_id"])
    .index("by_user_id", ["user_id"]),
  labels: labelsTable.table().index("by_map_id", ["map_id"]),
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
    .index("by_map_id", ["map_id"])
    .index("by_place_id", ["place_id"]),
  paths: pathsTable.table().index("byMapId", ["mapId"]),
  collections: collectionsTable.table().index("by_map_id", ["map_id"]),
  collection_links: collectionLinksTable
    .table()
    .index("by_map_id", ["map_id"])
    .index("by_collection_id", ["collection_id"]),
  routes: routesTable.table().index("by_map_id", ["map_id"]),
  route_stops: routeStopsTable.table().index("by_map_id", ["map_id"]),
  // places
  places: placesTable
    .table()
    .index("gm_place_id_ixd", ["gm_place_id"])
    .index("mb_place_id_ixd", ["mb_place_id"])
    .index("fq_place_id_ixd", ["fq_place_id"])
    .index("places_lat_idx", ["lat"])
    .index("places_lng_idx", ["lng"])
    .index("by_place_lat_lng", ["lat", "lng"])
    .index("places_address_idx", ["address"]),
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
  // Beta program - consolidated table
  beta_users: betaUsersTable
    .table()
    .index("by_email", ["email"])
    .index("by_token", ["token"])
    .index("by_user_id", ["userId"]),
});
