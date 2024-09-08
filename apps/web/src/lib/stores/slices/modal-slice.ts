import { Store } from "@/lib/stores";
import { Location, NewLocation } from "@/types";
import { StateCreator } from "zustand";

export type ModalState = {
  activeLocation: NewLocation | null;
  collectionsOpen: boolean;
  searchValue: string | null;
  snap: number | string | null;
  addToCollectionOpen: boolean;
};

export type ModalActions = {
  setActiveLocation: (location: NewLocation | null) => void;
  setCollectionsOpen: (open: boolean) => void;
  setSearchValue: (value: string | null) => void;
  setSnap: (snap: number | string | null) => void;
  setAddToCollectionOpen: (open: boolean) => void;
};

export type ModalSlice = ModalState & ModalActions;

export const initialModalState: ModalState = {
  activeLocation: null,
  collectionsOpen: false,
  searchValue: null,
  snap: 0.1,
  addToCollectionOpen: false,
};

export const createModalSlice: StateCreator<Store, [], [], ModalSlice> = (
  set
) => ({
  ...initialModalState,
  setActiveLocation: (location: NewLocation | null) =>
    set(() => ({ activeLocation: location, snap: 0.5 })),
  setCollectionsOpen: (open: boolean) => set(() => ({ collectionsOpen: open })),
  setSearchValue: (value: string | null) => set(() => ({ searchValue: value })),
  setSnap: (snap: number | string | null) => set(() => ({ snap: snap })),
  setAddToCollectionOpen: (open: boolean) =>
    set(() => ({ addToCollectionOpen: open, snap: 0.75 })),
});
