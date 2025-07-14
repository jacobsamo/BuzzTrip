import { zodToConvex } from "convex-helpers/server/zod";
import { defineSchema, defineTable } from "convex/server";
import {
  userSchema,
} from "../zod-schemas/auth-schema";
import {
  placePhotoSchema,
  placesSchema as places,
  placesReviewSchema,
} from "../zod-schemas/places-schema";

import {
  collection_linksSchema,
  collectionsSchema,
  labelsSchema,
  mapsSchema,
  mapUserSchema,
  markersSchema,
  route_stopsSchema,
  routesSchema,
} from "../zod-schemas/maps-schema";

export default defineSchema({
  // maps
  maps: defineTable(zodToConvex(mapsSchema)).index("by_visibility", [
    "visibility",
  ]),
  map_users: defineTable(zodToConvex(mapUserSchema))
    .index("by_map_id", ["map_id"])
    .index("by_user_id", ["user_id"]),
  labels: defineTable(zodToConvex(labelsSchema)).index("by_map_id", ["map_id"]),
  markers: defineTable(zodToConvex(markersSchema))
    .index("by_map_id", ["map_id"])
    .index("by_place_id", ["place_id"]),
  collections: defineTable(zodToConvex(collectionsSchema)).index("by_map_id", [
    "map_id",
  ]),
  collection_links: defineTable(zodToConvex(collection_linksSchema))
    .index("by_map_id", ["map_id"])
    .index("by_collection_id", ["collection_id"]),
  routes: defineTable(zodToConvex(routesSchema)).index("by_map_id", ["map_id"]),
  route_stops: defineTable(zodToConvex(route_stopsSchema)).index("by_map_id", [
    "map_id",
  ]),
  // places
  places: defineTable(zodToConvex(places))
    .index("gm_place_id_ixd", ["gm_place_id"])
    .index("mb_place_id_ixd", ["mb_place_id"])
    .index("fq_place_id_ixd", ["fq_place_id"])
    .index("places_lat_idx", ["lat"])
    .index("places_lng_idx", ["lng"])
    .index("by_place_lat_lng", ["lat", "lng"])
    .index("places_address_idx", ["address"]),
  places_reviews: defineTable(zodToConvex(placesReviewSchema)),
  place_photos: defineTable(zodToConvex(placePhotoSchema)),
  users: defineTable(zodToConvex(userSchema))
    .index("by_email", ["email"])
    .index("by_clerk_id", ["clerkUserId"])
    .searchIndex("search_user", {
      searchField: "name",
      filterFields: ["email", "username"],
    }),
});
