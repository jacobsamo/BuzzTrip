import { defineTable } from "convex/server";
import { v } from "convex/values";
import { bounds } from "./shared";

export const placesSchema = {
  places: defineTable({
    place_id: v.id("place_id"),
    title: v.string(),
    description: v.optional(v.string()),
    lat: v.float64(),
    lng: v.float64(),
    bounds: bounds,
    address: v.string(),
    gm_place_id: v.string(), // google maps place id
    mb_place_id: v.string(), // mapbox place id
    fq_place_id: v.string(), // foursquare place id
    plus_code: v.string(),
    icon: v.string(),
    photos: v.array(v.string()),
    rating: v.float64(),
    avg_price: v.number(),
    types: v.array(v.string()),
    website: v.string(),
    phone: v.string(),
    opening_times: v.array(v.string()),
  })
    .index("gm_place_id_ixd", ["gm_place_id"])
    .index("mb_place_id_ixd", ["mb_place_id"])
    .index("fq_place_id_ixd", ["fq_place_id"])
    .index("places_lat_idx", ["lat"])
    .index("places_lng_idx", ["lng"])
    .index("places_address_idx", ["address"]),
  places_reviews: defineTable({
    place_review_id: v.id("place_review_id"),
    place_id: v.id("place_id"),
    author_name: v.string(),
    author_url: v.string(),
    profile_photo_url: v.string(),
    rating: v.float64(),
    description: v.string(),
  }),
  place_photos: defineTable({
    place_photo_id: v.id("place_photo_id"),
    place_id: v.id("place_id"),
    user_id: v.id("user_id"),
    photo_url: v.string(),
    width: v.number(),
    height: v.number(),
    caption: v.string(),
  }),
};
