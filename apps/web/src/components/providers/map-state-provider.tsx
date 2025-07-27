"use client";
import { type InitState, type Store, createStore } from "@/lib/stores";
import { type StoreState } from "@/lib/stores/default-state";
import { api } from "@buzztrip/backend/api";
import { Preloaded, usePreloadedQuery } from "convex/react";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";
import { useStore as useZustandStore } from "zustand";

export type MapStoreApi = ReturnType<typeof createStore>;

export const MapStoreContext = createContext<MapStoreApi | undefined>(
  undefined
);

type MapStoreProviderPreloadedQueries = {
  markers: Preloaded<typeof api.maps.markers.getMarkersView>;
  collections: Preloaded<typeof api.maps.collections.getCollectionsForMap>;
  collectionLinks: Preloaded<
    typeof api.maps.collections.getCollectionLinksForMap
  >;
  labels: Preloaded<typeof api.maps.labels.getMapLabels>;
  mapUsers: Preloaded<typeof api.maps.mapUsers.getMapUsers>;
  paths: Preloaded<typeof api.maps.paths.getPathsForMap>;
  // routes: Preloaded<typeof api.maps.routes.getRoutesForMap>;
  // routeStops: Preloaded<typeof api.maps.routes.getRouteStopsForMap>;
};

export interface MapStoreProviderProps {
  children: ReactNode;
  initialState: InitState & Partial<StoreState>;
  preloadedQueries: MapStoreProviderPreloadedQueries;
}

export const MapStoreProvider = ({
  children,
  initialState,
  preloadedQueries,
}: MapStoreProviderProps) => {
  const markers = usePreloadedQuery(preloadedQueries.markers);
  const collections = usePreloadedQuery(preloadedQueries.collections);
  const collectionLinks = usePreloadedQuery(preloadedQueries.collectionLinks);
  const labels = usePreloadedQuery(preloadedQueries.labels);
  const mapUsers = usePreloadedQuery(preloadedQueries.mapUsers);
  const paths = usePreloadedQuery(preloadedQueries.paths);
  // const routes = useQuery(api.maps.routes.getRoutesForMap , {
  //   map_id: initialState.map._id as Id<"maps">,
  // })
  // const routeStops = useQuery(api.maps.routes.getRouteStopsForMap , {
  //   map_id: initialState.map._id as Id<"maps">,
  // })
  const storeRef = useRef<MapStoreApi>(undefined);

  const initializeStore = useCallback(() => {
    storeRef.current = createStore({
      ...initialState,
      markers: markers ?? null,
      collections: collections ?? null,
      paths: paths ?? null,
      collectionLinks: collectionLinks ?? null,
      labels: labels ?? null,
      mapUsers: mapUsers ?? null,
    });
  }, [initialState, markers, collections, collectionLinks, labels, mapUsers]);

  // Initialize once
  if (!storeRef.current) {
    initializeStore();
  }

  // Update store when queries change
  useEffect(() => {
    if (storeRef.current) {
      storeRef.current.setState({
        markers: markers ?? null,
        collections: collections ?? null,
        collectionLinks: collectionLinks ?? null,
        labels: labels ?? null,
        mapUsers: mapUsers ?? null,
      });
    }
  }, [markers, collections, collectionLinks, labels, mapUsers]);

  return (
    <MapStoreContext.Provider value={storeRef.current}>
      {children}
    </MapStoreContext.Provider>
  );
};

export const useMapStore = <T,>(selector: (store: Store) => T): T => {
  const mapStoreContext = useContext(MapStoreContext);

  if (!mapStoreContext) {
    throw new Error(`useMapStore must be used within MapStoreProvider`);
  }

  return useZustandStore(mapStoreContext, selector);
};
