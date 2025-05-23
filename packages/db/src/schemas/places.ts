import { sql } from "drizzle-orm";
import {
  index,
  integer,
  real,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import { generateId } from "../helpers";
import type { IconType } from "../types";
import { Bounds, Review } from "../types";

export const places = sqliteTable(
  "places",
  {
    place_id: text("place_id")
      .primaryKey()
      .notNull()
      .$defaultFn(() => generateId("place")),
    title: text("title").notNull(),
    description: text("description"),
    lat: real("lat").notNull(),
    lng: real("lng").notNull(),
    bounds: text("bounds", { mode: "json" }).notNull().$type<Bounds | null>(),
    address: text("address"),
    gm_place_id: text("gm_place_id"), // google maps place id
    mb_place_id: text("mb_place_id"), // mapbox place id
    fq_place_id: text("fq_place_id"), // foursquare place id
    plus_code: text("plus_code"),
    icon: text("icon").$type<IconType>().notNull(),
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
    created_at: text("created_at")
      .default(sql`(CURRENT_TIMESTAMP)`)
      .notNull(),
    updated_at: text("updated_at")
      .default(sql`(CURRENT_TIMESTAMP)`)
      .notNull(),
  },
  (table) => [
    index("gm_place_id_ixd").on(table.gm_place_id),
    index("mb_place_id_ixd").on(table.mb_place_id),
    index("fq_place_id_ixd").on(table.fq_place_id),
    index("places_lat_idx").on(table.lat),
    index("places_lng_idx").on(table.lng),
    index("places_address_idx").on(table.address),
  ]
);
