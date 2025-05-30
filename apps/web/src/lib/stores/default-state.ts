import type {
  Collection,
  CollectionLink,
  CombinedMarker,
  Map,
  MapUser,
  Route,
  RouteStop,
} from "@buzztrip/db/types";

export type StoreState = {
  collectionLinks: CollectionLink[] | null;
  collections: Collection[] | null;
  mapUsers: MapUser[] | null;
  map: Map | null;
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
  setCollectionLinks: (collectionLinks: CollectionLink[] | null) => void;
  setCollections: (collections: Collection[] | null) => void;
  setMapUsers: (mapUsers: MapUser[] | null) => void;
  setMap: (maps: Map | null) => void;
  setMarkers: (markers: CombinedMarker[] | null) => void;
  setRoute: (routes: Route[] | null) => void;
  setRouteStops: (routeStops: RouteStop[] | null) => void;
  getMarkersForCollection: (
    collectionId: string | null
  ) => CombinedMarker[] | null;
  getCollectionsForMarker: (markerId: string | null) => Collection[] | null;
  removeCollectionLinks: (collectionIds: string | string[]) => void;

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

export const defaultState: StoreState = {
  collectionLinks: null,
  collections: null,
  mapUsers: null,
  map: null,
  markers: null,
  routes: null,
  routeStops: null,

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
