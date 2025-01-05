"use client";
import { type Store, createStore } from "@/lib/stores";
import { defaultState, StoreState } from "@/lib/stores/default-state";
import { ReactNode, createContext, useContext, useRef } from "react";
import { useStore as useZustandStore } from "zustand";

export type MapStoreApi = ReturnType<typeof createStore>;

export const MapStoreContext = createContext<MapStoreApi | undefined>(
  undefined
);

export interface MapStoreProviderProps {
  children: ReactNode;
  initialState?: Partial<StoreState>;
}

export const MapStoreProvider = ({
  children,
  initialState,
}: MapStoreProviderProps) => {
  const storeRef = useRef<MapStoreApi>(undefined);

  if (!storeRef.current) {
    storeRef.current = createStore(initialState ?? defaultState);
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
    throw new Error(`useMapStore must be used within MapStoreProvider`);
  }

  return useZustandStore(mapStoreContext, selector);
};
