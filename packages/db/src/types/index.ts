import * as z from "zod";
import {
  collection_links,
  collections,
  locations,
  map_users,
  maps,
  markers,
  route_stops,
  routes,
  users,
} from "../schema";
import {
  boundsSchema,
  combinedMarkersSchema,
  permissionEnumSchema,
  reviewsSchema,
  userMapsSchema,
} from "../zod-schemas";

export * from "./icons";

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

export type CollectionLink = typeof collection_links.$inferSelect;
export type NewCollectionLink = typeof collection_links.$inferInsert;

export type MapUser = typeof map_users.$inferSelect;
export type NewMapUser = typeof map_users.$inferInsert;

export type Route = typeof routes.$inferSelect;
export type NewRoute = typeof routes.$inferInsert;

export type RouteStop = typeof route_stops.$inferSelect;
export type NewRouteStop = typeof route_stops.$inferInsert;

// Generated Types from zod schemas
export type Bounds = z.infer<typeof boundsSchema>;
export type Review = z.infer<typeof reviewsSchema>;

export type UserMap = z.infer<typeof userMapsSchema>;

export type PermissionEnum = z.infer<typeof permissionEnumSchema>;

// alternative schema types
export type CombinedMarker = z.infer<typeof combinedMarkersSchema>;
