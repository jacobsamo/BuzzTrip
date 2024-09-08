import { Store } from "@/lib/stores";
import { Location, NewLocation } from "@/types";
import { StateCreator } from "zustand";

export type ModalState = {
  activeLocation: NewLocation | null;
  collectionsOpen: boolean;
};

export type ModalActions = {
  setActiveLocation: (location: NewLocation | null) => void;
  setCollectionsOpen: (open: boolean) => void;
};

export type ModalSlice = ModalState & ModalActions;

export const initialModalState: ModalState = {
  activeLocation: null,
  collectionsOpen: false,
};

export const createModalSlice: StateCreator<Store, [], [], ModalSlice> = (
  set
) => ({
  ...initialModalState,
  setActiveLocation: (location: NewLocation | null) =>
    set(() => ({ activeLocation: location })),
  setCollectionsOpen: (open: boolean) => set(() => ({ collectionsOpen: open })),
});
