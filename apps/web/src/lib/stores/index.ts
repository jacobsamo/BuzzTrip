import { createStore as createZustandStore } from "zustand/vanilla";
import { defaultState, StoreActions, type StoreState } from "./default-state";

import type {
  Collection,
  CollectionLink,
  CombinedMarker,
  Map,
  MapUser,
  Route,
  RouteStop,
} from "@buzztrip/db/types";

export type Store = StoreState & StoreActions;

export const createStore = (initState: Partial<StoreState>) =>
  createZustandStore<Store>()((set, get) => ({
    ...defaultState,
    ...initState,
    setCollectionLinks: (collectionLinks: CollectionLink[] | null) => {
      if (!collectionLinks) return;

      return set(({ collectionLinks: prevCollectionLinks }) => {
        const prevCollectionLinksMap = prevCollectionLinks
          ? new Map(
              prevCollectionLinks.map((collectionLink) => [
                collectionLink.link_id,
                collectionLink,
              ])
            )
          : new Map();

        collectionLinks.forEach((collectionLink) => {
          prevCollectionLinksMap.set(collectionLink.link_id, {
            ...prevCollectionLinksMap.get(collectionLink.link_id),
            ...collectionLink,
          });
        });

        const updatedCollectionLinks = Array.from(
          prevCollectionLinksMap.values()
        );

        return { collectionLinks: updatedCollectionLinks };
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
      const links = get().collectionLinks;
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

      const links = get().collectionLinks;
      const markers = get().markers;
      if (!links || !markers) return null;

      const markerIds = links
        .filter((link) => link.collection_id === collectionId)
        .map((link) => link.marker_id);

      // Get the markers that match the marker IDs
      const collectionLinks = markers.filter((marker) =>
        markerIds.includes(marker.marker_id!)
      );

      return collectionLinks;
    },
    removeCollectionLinks: (collectionLinks: string | string[]) => {
      return set(({ collectionLinks: prevLinks }) => {
        let newLinks = prevLinks ? [...prevLinks] : [];

        if (Array.isArray(collectionLinks)) {
          newLinks = newLinks.filter(
            (link) => !collectionLinks.includes(link.link_id)
          );
        } else {
          newLinks = newLinks.filter(
            (link) => link.collection_id !== collectionLinks
          );
        }

        return { collectionLinks: newLinks };
      });
    },

    // Modals
    setActiveLocation: (place: CombinedMarker | null) =>
      set(() => {
        if (place) {
          return {
            activeLocation: place,
            snap: 0.5,
            searchValue: place.address,
          };
        }

        return { activeLocation: null, snap: 0.1, searchValue: "" };
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
