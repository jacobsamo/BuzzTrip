"use client";
import { type Store, createStore } from "@/lib/stores";
import { defaultState, StoreState } from "@/lib/stores/default-state";
import { type ReactNode, createContext, useContext, useRef } from "react";
import { useStore as useZustandStore } from "zustand";

export type MapStoreApi = ReturnType<typeof createStore>;

export const MapStoreContext = createContext<MapStoreApi | undefined>(
  undefined
);

export interface MapStoreProviderProps {
  children: ReactNode;
  initState: StoreState;
}

export const MapStoreProvider = ({
  children,
  initState = defaultState,
}: MapStoreProviderProps) => {
  const storeRef = useRef<MapStoreApi>();

  if (!storeRef.current) {
    storeRef.current = createStore(initState);
  }

  return (
    <MapStoreContext.Provider value={storeRef.current}>
      {children}
    </MapStoreContext.Provider>
  );
};

export const useMapStore = <T,>(selector: (store: Store) => T): T => {
  const mapStoreContext = useContext(MapStoreContext);

  if (!mapStoreContext) {
    throw new Error(`useStore must be used within StoreProvider`);
  }

  return useZustandStore(mapStoreContext, selector);
};
