"use client";
import { type InitState, type Store, createStore } from "@/lib/stores";
import { type StoreState } from "@/lib/stores/default-state";
import { api } from "@buzztrip/backend/api";
import { Id } from "@buzztrip/backend/dataModel";
import { useQuery } from "convex/react";
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

export interface MapStoreProviderProps {
  children: ReactNode;
  initialState: InitState & Partial<StoreState>;
}

export const MapStoreProvider = ({
  children,
  initialState,
}: MapStoreProviderProps) => {
  const markers = useQuery(api.maps.markers.getMarkersView, {
    map_id: initialState.map._id as Id<"maps">,
  });
  const collections = useQuery(api.maps.collections.getCollectionsForMap, {
    mapId: initialState.map._id as Id<"maps">,
  });
  const collectionLinks = useQuery(
    api.maps.collections.getCollectionLinksForMap,
    {
      mapId: initialState.map._id as Id<"maps">,
    }
  );
  const labels = useQuery(api.maps.labels.getMapLabels, {
    mapId: initialState.map._id as Id<"maps">,
  });
  const mapUsers = useQuery(api.maps.mapUsers.getMapUsers, {
    mapId: initialState.map._id as Id<"maps">,
  });
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
