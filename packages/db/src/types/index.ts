import * as z from "zod";
import {
  collection_links,
  collections,
  map_users,
  maps,
  markers,
  places,
  route_stops,
  routes,
  users,
} from "../schemas";
import {
  boundsSchema,
  combinedMarkersSchema,
  labelsEditSchema,
  labelsSchema,
  permissionEnumSchema,
  refinedUserSchema,
  reviewsSchema,
  travelTypeEnumSchema,
  userMapsSchema,
} from "../zod-schemas";

export * from "./icons";

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type RefinedUser = z.infer<typeof refinedUserSchema>;

export type Map = typeof maps.$inferSelect;
export type NewMap = typeof maps.$inferInsert;

export type Label = z.infer<typeof labelsSchema>;
export type NewLabel = z.infer<typeof labelsEditSchema>;

export type Marker = typeof markers.$inferSelect;
export type NewMarker = typeof markers.$inferInsert;

export type Place = typeof places.$inferSelect;
export type NewPlace = typeof places.$inferInsert;

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

export type TravelTypeEnum = z.infer<typeof travelTypeEnumSchema>;

// alternative schema types
export type CombinedMarker = z.infer<typeof combinedMarkersSchema>;
