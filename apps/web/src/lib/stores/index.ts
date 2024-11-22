import { createStore as createZustandStore } from "zustand/vanilla";
import { defaultState, StoreActions, type StoreState } from "./default-state";

import type {
  Collection,
  CollectionMarker,
  MapUser,
  Map,
  Marker,
  Route,
  RouteStop,
  CombinedMarker,
  NewLocation,
} from "@buzztrip/db/types";

export type Store = StoreState & StoreActions;

export const createStore = (initState: Partial<StoreState>) =>
  createZustandStore<Store>()((set, get, api) => ({
    ...defaultState,
    ...initState,
    setCollectionMarkers: (collectionMarkers: CollectionMarker[] | null) => {
      if (!collectionMarkers) return;

      return set(({ collectionMarkers: prevCollectionMarkers }) => {
        const prevCollectionMarkersMap = prevCollectionMarkers
          ? new Map(
              prevCollectionMarkers.map((collectionMarker) => [
                collectionMarker.link_id,
                collectionMarker,
              ])
            )
          : new Map();

        collectionMarkers.forEach((collectionMarker) => {
          prevCollectionMarkersMap.set(collectionMarker.link_id, {
            ...prevCollectionMarkersMap.get(collectionMarker.link_id),
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

        return {
          markers: updatedMarkers,
          searchValue: null,
          activeLocation: null,
        };
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
    getCollectionsForMarker: (markerId: string | null) => {
      if (!markerId) return null;
      const links = get().collectionMarkers;
      const collections = get().collections;
      if (!links || !collections) return null;

      const collectionIds = links
        .filter((link) => link.marker_id === markerId)
        .map((link) => link.collection_id);

      // Get the collections that match the collection IDs
      const markerCollections = collections.filter((collection) =>
        collectionIds.includes(collection.collection_id)
      );

      return markerCollections;
    },
    getMarkersForCollection: (collectionId: string | null) => {
      if (!collectionId) return null;

      const links = get().collectionMarkers;
      const markers = get().markers;
      if (!links || !markers) return null;

      const markerIds = links
        .filter((link) => link.collection_id === collectionId)
        .map((link) => link.marker_id);

      // Get the markers that match the marker IDs
      const collectionMarkers = markers.filter((marker) =>
        markerIds.includes(marker.marker_id!)
      );

      return collectionMarkers;
    },
    removeCollectionMarkers: (collectionMarkers: string | string[]) => {
      return set(({ collectionMarkers: prevLinks }) => {
        let newLinks = prevLinks ? [...prevLinks] : [];

        if (Array.isArray(collectionMarkers)) {
          newLinks = newLinks.filter(
            (link) => !collectionMarkers.includes(link.link_id)
          );
        } else {
          newLinks = newLinks.filter(
            (link) => link.collection_id !== collectionMarkers
          );
        }

        return { collectionMarkers: newLinks };
      });
    },

    // Modals
    setActiveLocation: (location: CombinedMarker | null) =>
      set(() => {
        if (location) {
          return { activeLocation: location, snap: 0.5 };
        }

        return { activeLocation: null, snap: 0.1, searchValue: null };
      }),
    setCollectionsOpen: (open: boolean) =>
      set(() => ({ collectionsOpen: open })),
    setSearchValue: (value: string | null) =>
      set(() => ({ searchValue: value })),
    setSnap: (snap: number | string | null) => set(() => ({ snap: snap })),
    setMarkerOpen: (
      open: boolean,
      marker: CombinedMarker | null,
      mode: "create" | "edit" | null
    ) => set(() => ({ markerOpen: { open, marker, mode } })),
  }));
