import { api } from "@buzztrip/backend/api";
import { Id } from "@buzztrip/backend/dataModel";
import type { CombinedMarker, Map } from "@buzztrip/backend/types";
import { useQuery } from "convex/react";
import { createStore as createZustandStore } from "zustand/vanilla";
import { defaultState, StoreActions, type StoreState } from "./default-state";

export type Store = StoreState & StoreActions;

export interface InitState extends Partial<StoreState>  {
  map: Map;
};

export const createStore = (initState: InitState) =>
  createZustandStore<Store>()((set, get) => {

    return {
      ...defaultState,
      ...initState,
      map: initState.map,
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
