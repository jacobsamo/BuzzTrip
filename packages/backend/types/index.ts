import { z } from "zod";
import {
  boundsSchema,
  collection_linksEditSchema,
  collection_linksSchema,
  collectionsEditSchema,
  collectionsSchema,
  combinedMapUser,
  combinedMarkersSchema,
  labelsEditSchema,
  labelsSchema,
  mapsEditSchema,
  mapsSchema,
  mapTypeIdEnum,
  mapUserEditSchema,
  mapUserSchema,
  markersEditSchema,
  markersSchema,
  pathsEditSchema,
  pathsSchema,
  permissionEnumSchema,
  placesEditSchema,
  placesSchema,
  refinedUserSchema,
  reviewsSchema,
  route_stopsEditSchema,
  route_stopsSchema,
  routesEditSchema,
  routesSchema,
  shareMapUserSchema,
  travelTypeEnumSchema,
  userMapsSchema,
  userSchema,
} from "../zod-schemas";

export * from "./icons";

export type User = z.infer<typeof userSchema>;
// export type NewUser = typeof users.$inferInsert>

export type UserMap = z.infer<typeof userMapsSchema>;

export type CombinedMapUser = z.infer<typeof combinedMapUser>;

export type RefinedUser = z.infer<typeof refinedUserSchema>;

export type Map = z.infer<typeof mapsSchema>;
export type NewMap = z.infer<typeof mapsEditSchema>;

export type ShareMapUser = z.infer<typeof shareMapUserSchema>;

export type Label = z.infer<typeof labelsSchema>;
export type NewLabel = z.infer<typeof labelsEditSchema>;

export type Marker = z.infer<typeof markersSchema>;
export type NewMarker = z.infer<typeof markersEditSchema>;
export type CombinedMarker = z.infer<typeof combinedMarkersSchema>;

export type Place = z.infer<typeof placesSchema>;
export type NewPlace = z.infer<typeof placesEditSchema>;

export type Collection = z.infer<typeof collectionsSchema>;
export type NewCollection = z.infer<typeof collectionsEditSchema>;

export type CollectionLink = z.infer<typeof collection_linksSchema>;
export type NewCollectionLink = z.infer<typeof collection_linksEditSchema>;

export type MapUser = z.infer<typeof mapUserSchema>;
export type NewMapUser = z.infer<typeof mapUserEditSchema>;

export type Route = z.infer<typeof routesSchema>;
export type NewRoute = z.infer<typeof routesEditSchema>;

export type RouteStop = z.infer<typeof route_stopsSchema>;
export type NewRouteStop = z.infer<typeof route_stopsEditSchema>;

export type Bounds = z.infer<typeof boundsSchema>;
export type Review = z.infer<typeof reviewsSchema>;

export type PermissionEnum = z.infer<typeof permissionEnumSchema>;

export type TravelTypeEnum = z.infer<typeof travelTypeEnumSchema>;

export type MapTypeId = z.infer<typeof mapTypeIdEnum>;

export type Path = z.infer<typeof pathsSchema>;
export type NewPath = z.infer<typeof pathsEditSchema>;
