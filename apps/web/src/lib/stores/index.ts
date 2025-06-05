import { api } from "@buzztrip/backend/api";
import { Id } from "@buzztrip/backend/dataModel";
import type { CombinedMarker, Map } from "@buzztrip/backend/types";
import { useQuery } from "convex/react";
import { createStore as createZustandStore } from "zustand/vanilla";
import { StoreActions, type StoreState } from "./default-state";

export type Store = StoreState & StoreActions;

export type InitState = {
  map: Map;
};

export const createStore = (initState: InitState) =>
  createZustandStore<Store>()((set, get) => {
    const markers = useQuery(api.maps.markers.getMarkersView, {
      map_id: initState.map._id as Id<"maps">,
    });
    const collections = useQuery(api.maps.collections.getCollectionsForMap, {
      mapId: initState.map._id as Id<"maps">,
    });
    const collectionLinks = useQuery(
      api.maps.collections.getCollectionLinksForMap,
      {
        mapId: initState.map._id as Id<"maps">,
      }
    );
    const labels = useQuery(api.maps.labels.getMapLabels, {
      mapId: initState.map._id as Id<"maps">,
    });
    const mapUsers = useQuery(api.maps.mapUsers.getMapUsers, {
      mapId: initState.map._id as Id<"maps">,
    });
    // const routes = useQuery(api.maps.routes.getRoutesForMap , {
    //   map_id: initState.map._id as Id<"maps">,
    // })
    // const routeStops = useQuery(api.maps.routes.getRouteStopsForMap , {
    //   map_id: initState.map._id as Id<"maps">,
    // })

    return {
      map: initState.map,
      markers: markers ?? null,
      collections: collections ?? null,
      collectionLinks: collectionLinks ?? null,
      labels: labels ?? null,
      mapUsers: mapUsers ?? null,
      routes: null,
      routeStops: null,
      activeLocation: null,
      collectionsOpen: false,
      searchValue: null,
      snap: 0.1,
      markerOpen: {
        open: false,
        marker: null,
        mode: null,
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
          collectionIds.includes(collection._id as Id<"collections">)
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
          markerIds.includes(marker._id as Id<"markers">)
        );

        return collectionLinks;
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
    };
  });
