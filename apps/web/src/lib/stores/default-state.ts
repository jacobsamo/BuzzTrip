import type {
  Collection,
  CollectionMarker,
  MapUser,
  Map,
  Marker,
  Route,
  RouteStop,
  CombinedMarker,
  NewLocation,
} from "@/types";

export type StoreState = {
  collectionMarkers: CollectionMarker[] | null;
  collections: Collection[] | null;
  mapUsers: MapUser[] | null;
  map: Map | null;
  markers: CombinedMarker[] | null;
  route: Route[] | null;
  routeStops: RouteStop[] | null;

  // Modals
  activeLocation: NewLocation | null;
  collectionsOpen: boolean;
  searchValue: string | null;
  snap: number | string | null;
  addToCollectionOpen: boolean;
};

export type StoreActions = {
  setCollectionMarkers: (collectionMarkers: CollectionMarker[] | null) => void;
  setCollections: (collections: Collection[] | null) => void;
  setMapUsers: (mapUsers: MapUser[] | null) => void;
  setMap: (maps: Map | null) => void;
  setMarkers: (markers: CombinedMarker[] | null) => void;
  setRoute: (route: Route[] | null) => void;
  setRouteStops: (routeStops: RouteStop[] | null) => void;
  getMarkersForCollection: (collectionId: string) => CombinedMarker[] | null;
  getCollectionsForMarker: (markerId: string) => Collection[] | null;

  // Modals
  setActiveLocation: (location: NewLocation | null) => void;
  setCollectionsOpen: (open: boolean) => void;
  setSearchValue: (value: string | null) => void;
  setSnap: (snap: number | string | null) => void;
  setAddToCollectionOpen: (open: boolean) => void;
};

export const defaultState: StoreState = {
  collectionMarkers: null,
  collections: null,
  mapUsers: null,
  map: null,
  markers: null,
  route: null,
  routeStops: null,

  // Modals
  activeLocation: null,
  collectionsOpen: false,
  searchValue: null,
  snap: 0.1,
  addToCollectionOpen: false,
};
