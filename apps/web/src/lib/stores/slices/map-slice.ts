import { Store } from "@/lib/stores";
import { StateCreator } from "zustand";
import type {
  Collection,
  CollectionMarker,
  MapUser,
  Map,
  Marker,
  Route,
  RouteStop,
  CombinedMarker,
} from "@/types";

export type MapState = {
  collectionMarkers: CollectionMarker[] | null;
  collections: Collection[] | null;
  mapUsers: MapUser[] | null;
  map: Map | null;
  markers: CombinedMarker[] | null;
  route: Route[] | null;
  routeStops: RouteStop[] | null;
};

export type MapActions = {
  setCollectionMarkers: (collectionMarkers: CollectionMarker[] | null) => void;
  setCollections: (collections: Collection[] | null) => void;
  setMapUsers: (mapUsers: MapUser[] | null) => void;
  setMap: (maps: Map | null) => void;
  setMarkers: (markers: CombinedMarker[] | null) => void;
  setRoute: (route: Route[] | null) => void;
  setRouteStops: (routeStops: RouteStop[] | null) => void;
};

export type MapSlice = MapState & MapActions;

export const initialMapState: MapState = {
  collectionMarkers: null,
  collections: null,
  mapUsers: null,
  map: null,
  markers: null,
  route: null,
  routeStops: null,
};

export const createMapSlice: StateCreator<Store, [], [], MapSlice> = (set) => ({
  ...initialMapState,
  setCollectionMarkers: (collectionMarkers: CollectionMarker[] | null) => {
    if (!collectionMarkers) return;

    return set(({ collectionMarkers: prevCollectionMarkers }) => {
      const prevCollectionMarkersMap = prevCollectionMarkers
        ? new Map(
            prevCollectionMarkers.map((collectionMarker) => [
              collectionMarker.collection_id,
              collectionMarker,
            ])
          )
        : new Map();

      collectionMarkers.forEach((collectionMarker) => {
        prevCollectionMarkersMap.set(collectionMarker.collection_id, {
          ...prevCollectionMarkersMap.get(collectionMarker.collection_id),
          ...collectionMarker,
        });
      });

      const updatedCollectionMarkers = Array.from(
        prevCollectionMarkersMap.values()
      );

      return { collectionMarkers: updatedCollectionMarkers };
    });
  },
  setCollections: (collections: Collection[] | null) => {
    if (!collections) return;

    return set(({ collections: prevCollections }) => {
      const prevCollectionsMap = prevCollections
        ? new Map(
            prevCollections.map((collection) => [
              collection.collection_id,
              collection,
            ])
          )
        : new Map();

      collections.forEach((collection) => {
        prevCollectionsMap.set(collection.collection_id, {
          ...prevCollectionsMap.get(collection.collection_id),
          ...collection,
        });
      });

      const updatedCollections = Array.from(prevCollectionsMap.values());

      return { collections: updatedCollections };
    });
  },
  setMapUsers: (mapUsers: MapUser[] | null) => {
    if (!mapUsers) return;

    return set(({ mapUsers: prevMapUsers }) => {
      const prevMapUsersMap = prevMapUsers
        ? new Map(prevMapUsers.map((mapUser) => [mapUser.map_id, mapUser]))
        : new Map();

      mapUsers.forEach((mapUser) => {
        prevMapUsersMap.set(mapUser.map_id, {
          ...prevMapUsersMap.get(mapUser.map_id),
          ...mapUser,
        });
      });

      return { mapUsers: Array.from(prevMapUsersMap.values()) };
    });
  },
  setMap: (map: Map | null) => {
    if (!map) return;

    return set({ map: map });
  },
  setMarkers: (markers: CombinedMarker[] | null) => {
    if (!markers) return;

    return set(({ markers: prevMarkers }) => {
      const prevMarkersMap = prevMarkers
        ? new Map(prevMarkers.map((marker) => [marker.marker_id, marker]))
        : new Map();

      markers.forEach((marker) => {
        prevMarkersMap.set(marker.marker_id, {
          ...prevMarkersMap.get(marker.marker_id),
          ...marker,
        });
      });

      const updatedMarkers = Array.from(prevMarkersMap.values());

      return { markers: updatedMarkers };
    });
  },
  setRoute: (route: Route[] | null) => {
    if (!route) return;

    return set(({ route: prevRoute }) => {
      const prevRouteMap = prevRoute
        ? new Map(prevRoute.map((route) => [route.route_id, route]))
        : new Map();

      route.forEach((route) => {
        prevRouteMap.set(route.route_id, {
          ...prevRouteMap.get(route.route_id),
          ...route,
        });
      });
      console.log(prevRouteMap);
      const updatedRoute = Array.from(prevRouteMap.values());

      return { route: updatedRoute };
    });
  },
  setRouteStops: (routeStops: RouteStop[] | null) => {
    if (!routeStops) return;

    return set(({ routeStops: prevRouteStops }) => {
      const prevRouteStopsMap = prevRouteStops
        ? new Map(
            prevRouteStops.map((routeStop) => [
              routeStop.route_stop_id,
              routeStop,
            ])
          )
        : new Map();

      routeStops.forEach((routeStop) => {
        prevRouteStopsMap.set(routeStop.route_stop_id, {
          ...prevRouteStopsMap.get(routeStop.route_stop_id),
          ...routeStop,
        });
      });
      const updatedRouteStops = Array.from(prevRouteStopsMap.values());

      return { routeStops: updatedRouteStops };
    });
  },
});