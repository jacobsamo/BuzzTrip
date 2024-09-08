import { type MapState, initialMapState } from "./slices/map-slice";
import { type ModalState, initialModalState } from "./slices/modal-slice";

export type StoreState = MapState & ModalState;

export const defaultState: StoreState = {
  ...initialMapState,
  ...initialModalState,
};
