import { Id } from "@buzztrip/backend/dataModel";
import type { Map } from "@buzztrip/backend/types";
import { createStore as createZustandStore } from "zustand/vanilla";
import {
  ActiveState,
  defaultState,
  DrawerState,
  StoreActions,
  type StoreState,
} from "./default-state";

export type Store = StoreState & StoreActions;

export interface InitState extends Partial<StoreState> {
  map: Map;
}

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

      setActiveState: (state: ActiveState | null) => {
        const prevState = get().activeState;
        let drawerState = { snap: 0.75, dismissible: false };

        switch (state?.event) {
          case "markers:create":
          case "markers:update":
          case "collections:create":
          case "collections:update":
            drawerState = { snap: 0.75, dismissible: false };
            break;
          case "activeLocation":
            drawerState = { snap: 0.5, dismissible: true };
            break;
          default:
            break;
        }

        if (prevState && prevState.event === "activeLocation" && !state) {
          // if the previous state was an activeLocation, and we're setting it to null, we want to set it back to the active location
          set(() => ({
            activeState: prevState,
            drawerState,
          }));
        }

        // set the active state and drawer state
        set(() => ({
          activeState: state,
          drawerState,
        }));
      },

      setDrawerState: (state: DrawerState) => {
        set(() => ({ drawerState: state }));
      },

      setMobile: (isMobile: boolean) => {
        if (isMobile) {
          set(() => ({
            drawerState: { snap: 0.2, dismissible: false },
            isMobile: true,
          }));
        } else {
          set(() => ({
            isMobile: false,
          }));
        }
      },
      setSearchValue: (value: string | null) =>
        set(() => ({ searchValue: value })),
    };
  });
