import type {
  Collection,
  CollectionLink,
  CombinedMarker,
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

