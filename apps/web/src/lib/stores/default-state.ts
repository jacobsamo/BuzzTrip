import { createAction } from "@buzztrip/backend/helpers";
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
  "add-marker": null;
};

export type ActiveState = {
  [K in keyof EventPayloadMap]: {
    event: K;
    payload: EventPayloadMap[K];
  };
}[keyof EventPayloadMap];

export type DrawerState = {
  snap: number;
  dismissible: boolean; // whether the user can close to a smaller snap point
};

export type UIState = "searching" | "add-marker" | "paths" | "default";

export type StoreState = {
  // data
  map: Map;
  mapUsers: MapUser[] | null;
  collections: Collection[] | null;
  markers: CombinedMarker[] | null;
  collectionLinks: CollectionLink[] | null;
  labels: Label[] | null;
  routes: Route[] | null;
  routeStops: RouteStop[] | null;

  // uiState
  isMobile: boolean;
  activeLocation: CombinedMarker | null; // mainly for internal use
  activeState: ActiveState | null;
  prevState: ActiveState | null;
  uiState: UIState;
  drawerState: DrawerState;
  searchValue: string | null;
  searchActive: boolean;
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
  setSearchActive: (active: boolean) => void;
  setUiState: (uiState: UIState) => void;
};

export const defaultState: Omit<StoreState, "map"> = {
  // data
  collectionLinks: null,
  collections: null,
  mapUsers: null,
  markers: null,
  routes: null,
  routeStops: null,
  labels: null,

  // states
  isMobile: false,
  activeLocation: null,
  activeState: null,
  prevState: null,
  uiState: "default",
  drawerState: {
    snap: 0.2,
    dismissible: true,
  },
  searchValue: null,
  searchActive: false,
};
