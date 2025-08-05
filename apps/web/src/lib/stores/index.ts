import { Id } from "@buzztrip/backend/dataModel";
import type { CombinedMarker, Map } from "@buzztrip/backend/types";
import { TerraDraw } from "terra-draw";
import { createStore as createZustandStore } from "zustand/vanilla";
import {
  ActiveState,
  defaultState,
  DrawerState,
  StoreActions,
  UIState,
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
      setActiveLocation: (location: CombinedMarker | null) => {
        if (!location) {
          set(() => ({
            activeLocation: null,
            drawerState: { snap: 0.2, dismissible: true },
            searchValue: null,
            searchActive: false,
          }));
        }

        const searchValue = location
          ? location.place.title
            ? location.place.title
            : `${location.lat}, ${location.lng}`
          : null;

        set(() => ({
          activeLocation: location,
          drawerState: { snap: 0.5, dismissible: true },
          searchValue,
          searchActive: false,
        }));
      },
      setActiveState: (state: ActiveState | null) => {
        const currentState = get().activeState;
        const prevState = get().prevState;

        if (
          (prevState?.event === "markers:create" ||
            prevState?.event === "markers:update") &&
          currentState?.event === "collections:create"
        ) {
          set(() => ({
            activeState: prevState,
            prevState: currentState,
            drawerState: { snap: 0.9, dismissible: false },
          }));
          return;
        }

        if (!state) {
          set(() => ({
            activeState: state,
            prevState: currentState,
            drawerState: { snap: 0.2, dismissible: true },
            uiState: "default",
          }));
          return;
        }

        set(() => ({
          activeState: state,
          prevState: currentState,
          drawerState: { snap: 0.9, dismissible: false },
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
      setSearchActive: (active: boolean) =>
        set(() => ({
          searchActive: active,
        })),
      setUiState: (uiState: UIState) => {
        set(() => ({ uiState: uiState }));
      },
      setTerraDrawInstance: (instance: TerraDraw | null) =>
        set(() => ({ terraDrawInstance: instance })),
    };
  });
