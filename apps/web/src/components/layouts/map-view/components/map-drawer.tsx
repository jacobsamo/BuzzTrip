"use client";
// import * as Accordion from "@radix-ui/react-accordion";
import { Drawer } from "vaul";
// import CollectionCard from "../collection_card";
import { AutocompleteCustomInput } from "@/components/mapping/google-maps/search";
import { useMapStore } from "@/components/providers/map-state-provider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import ActiveLocation from "./active-location";
import MarkersCollectionTabs from "./markers-collections";
// import DisplayActiveState from "./display-active-state";

const MarkerForm = dynamic(
  () => import("../../../forms/marker-create-edit-form"),
  {
    ssr: false,
  }
);
const CollectionForm = dynamic(
  () => import("../../../forms/collection-create-edit-form"),
  { ssr: false }
);

export default function MapDrawer() {
  const {
    activeState,
    activeLocation,
    setActiveState,
    map,
    searchActive,
    drawerState,
    setDrawerState,
  } = useMapStore((state) => state);

  const markerFormOpen = useMemo(() => {
    return (
      activeState?.event === "markers:create" ||
      activeState?.event === "markers:update"
    );
  }, [activeState]);

  const collectionFormOpen = useMemo(() => {
    return (
      activeState?.event === "collections:create" ||
      activeState?.event === "collections:update"
    );
  }, [activeState]);

  return (
    <Drawer.Root
      open
      dismissible={false}
      snapPoints={[0.1, 0.2, 0.5, 0.75, 0.9, 0.98]}
      activeSnapPoint={drawerState.snap}
      setActiveSnapPoint={(snapPoint) =>
        setDrawerState({ snap: snapPoint, dismissible: true })
      }
      modal={false}
      fixed={true}
    >
      <Drawer.Portal>
        <Drawer.Content
          className={cn(
            "fixed inset-0 bottom-0 z-50",
            "mx-auto flex w-full flex-col",
            "rounded-t-[10px] border bg-background",
            "p-2 pb-6 md:w-3/4",
            "overflow-hidden",
            "touch-pan-y"
          )}
        >
          <div
            id="handle"
            className="top-0 mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted"
          />

          {!activeLocation && !markerFormOpen && !collectionFormOpen && (
            <>
              <AutocompleteCustomInput />
              {!searchActive && <MarkersCollectionTabs />}
            </>
          )}
          {activeLocation && (!markerFormOpen || !collectionFormOpen) && (
            <ActiveLocation />
          )}

          {activeState && markerFormOpen && (
            <ScrollArea>
              <MarkerForm />
            </ScrollArea>
          )}
          {activeState && collectionFormOpen && (
            <ScrollArea>
              <CollectionForm />
            </ScrollArea>
          )}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
