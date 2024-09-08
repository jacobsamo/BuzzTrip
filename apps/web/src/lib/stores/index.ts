import { createStore as createZustandStore } from "zustand/vanilla";
import { defaultState, type StoreState } from "./default-state";
import { createModalSlice, ModalSlice } from "./slices/modal-slice";
import { createMapSlice, MapSlice } from "./slices/map-slice";

export type Store = MapSlice & ModalSlice;

export const initStore = (): StoreState => {
  return defaultState;
};

export const createStore = (initState: StoreState = defaultState) =>
  createZustandStore<Store>()((...actions) => ({
    ...initState,
    ...createMapSlice(...actions),
    ...createModalSlice(...actions),
  }));
