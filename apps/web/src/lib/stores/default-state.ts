import type {
  Collection,
  CollectionLink,
  CombinedMarker,
  Label,
  Map,
  MapUser,
  Route,
  RouteStop,
} from "@buzztrip/backend/types";

export type StoreState = {
  collectionLinks: CollectionLink[] | null;
  collections: Collection[] | null;
  mapUsers: MapUser[] | null;
  map: Map;
  labels: Label[] | null;
  markers: CombinedMarker[] | null;
  routes: Route[] | null;
  routeStops: RouteStop[] | null;

  // Modals
  activeLocation: CombinedMarker | null;
  collectionsOpen: boolean;
  searchValue: string | null;
  snap: number | string | null;
  markerOpen: {
    open: boolean;
    marker: CombinedMarker | null;
    mode: "create" | "edit" | null;
  };
};

export type StoreActions = {
  getMarkersForCollection: (
    collectionId: string | null
  ) => CombinedMarker[] | null;
  getCollectionsForMarker: (markerId: string | null) => Collection[] | null;

  // Modals
  setActiveLocation: (location: CombinedMarker | null) => void;
  setCollectionsOpen: (open: boolean) => void;
  setSearchValue: (value: string | null) => void;
  setSnap: (snap: number | string | null) => void;
  setMarkerOpen: (
    open: boolean,
    marker: CombinedMarker | null,
    mode: "create" | "edit" | null
  ) => void;
};

export const defaultState: Omit<StoreState, "map"> = {
  collectionLinks: null,
  collections: null,
  mapUsers: null,
  markers: null,
  routes: null,
  routeStops: null,
  labels: null,

  // Modals
  activeLocation: null,
  collectionsOpen: false,
  searchValue: null,
  snap: 0.1,
  markerOpen: {
    open: false,
    marker: null,
    mode: null,
  },
};