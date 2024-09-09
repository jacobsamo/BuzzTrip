import {
  collection_markers,
  collections,
  map_users,
  maps,
  markers,
  route,
  route_stops,
  users,
  locations,
  markersView
} from "@/server/db/schema";
import { boundsSchema, combinedMarkersSchema, reviewsSchema } from "./scheams";
import * as z from "zod";

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Map = typeof maps.$inferSelect;
export type NewMap = typeof maps.$inferInsert;

export type Marker = typeof markers.$inferSelect;
export type NewMarker = typeof markers.$inferInsert;

export type Location = typeof locations.$inferSelect;
export type NewLocation = typeof locations.$inferInsert;

export type Collection = typeof collections.$inferSelect;
export type NewCollection = typeof collections.$inferInsert;

export type CollectionMarker = typeof collection_markers.$inferSelect;
export type NewCollectionMarker = typeof collection_markers.$inferInsert;

export type MapUser = typeof map_users.$inferSelect;
export type NewMapUser = typeof map_users.$inferInsert;

export type Route = typeof route.$inferSelect;
export type NewRoute = typeof route.$inferInsert;

export type RouteStop = typeof route_stops.$inferSelect;
export type NewRouteStop = typeof route_stops.$inferInsert;


// Generated Types from zod schemas
export type Bounds = z.infer<typeof boundsSchema>;
export type Review = z.infer<typeof reviewsSchema>;

export type CombinedMarker = z.infer<typeof combinedMarkersSchema>;