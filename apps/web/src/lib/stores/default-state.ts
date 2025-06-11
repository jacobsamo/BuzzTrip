import type {
  Collection,
  CollectionLink,
  CombinedMarker,
  Label,
  Map,
  MapUser,
  NewCollection,
  Route,
  RouteStop,
} from "@buzztrip/backend/types";
import { createAction } from "@buzztrip/backend/helpers"

const eventType = [
  ...createAction("collections", ["create", "update"]),
  ...createAction("markers", ["create", "update"]),
] as const;
type EventType = (typeof eventType)[number];

type EventPayloadMap = {
  "collections:create": null;
  "collections:update": NewCollection;
  "markers:create": CombinedMarker;
  "markers:update": CombinedMarker;
};

export type ActiveState = {
  [K in keyof EventPayloadMap]: {
    event: K;
    payload: EventPayloadMap[K];
  }
}[keyof EventPayloadMap];


export type DrawerState = {
  snap: number | string | null;
  dismissible: boolean; // whether the user can close to a smaller snap point
}

export type StoreState = {
  map: Map;
  mapUsers: MapUser[] | null;
  collections: Collection[] | null;
  markers: CombinedMarker[] | null;
  collectionLinks: CollectionLink[] | null;
  labels: Label[] | null;
  routes: Route[] | null;
  routeStops: RouteStop[] | null;

  // Modals
  isMobile: boolean;
  activeLocation: CombinedMarker | null; // mainly for internal use 
  activeState: ActiveState | null;
  drawerState: DrawerState
  searchValue: string | null;

  // collectionsOpen: boolean;
  // snap: number | string | null;
  // markerOpen: {
  //   open: boolean;
  //   marker: CombinedMarker | null;
  //   mode: "create" | "edit" | null;
  // };
};

export type StoreActions = {
  getMarkersForCollection: (
    collectionId: string | null
  ) => CombinedMarker[] | null;
  getCollectionsForMarker: (markerId: string | null) => Collection[] | null;

  // Modals
  setMobile: (isMobile: boolean) => void;
  setActiveState: (state: ActiveState | null) => void;
  setActiveLocation: (location: CombinedMarker | null) => void;
  setDrawerState: (state: DrawerState) => void;
  setSearchValue: (value: string | null) => void;


  // setActiveLocation: (location: CombinedMarker | null) => void;
  // setCollectionsOpen: (open: boolean) => void;
  // setSnap: (snap: number | string | null) => void;
  // setMarkerOpen: (
  //   open: boolean,
  //   marker: CombinedMarker | null,
  //   mode: "create" | "edit" | null
  // ) => void;
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
  isMobile: false,
  activeLocation: null,
  activeState: null,
  drawerState: {
    snap: 0.2,
    dismissible: true,
  },
  searchValue: null,

  // activeLocation: null,
  // collectionsOpen: false,
  // snap: 0.1,
  // markerOpen: {
  //   open: false,
  //   marker: null,
  //   mode: null,
  // },
};