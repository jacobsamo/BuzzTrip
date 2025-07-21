"use client";
import { AutocompleteCustomInput } from "@/components/mapping/google-maps/search";
import { useMapStore } from "@/components/providers/map-state-provider";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import { Drawer } from "vaul";
import ActiveLocation from "./active-location";
import MarkersCollectionTabs from "./markers-collections";
import OpenCollectionModal from "@/components/modals/open-collection-modal";
import CloseButton from "./close-button";
import CollectionForm from "@/components/forms/collection-create-edit-form";
import MarkerForm from "@/components/forms/marker-create-edit-form";


export default function MapDrawer() {
  const {
    activeState,
    activeLocation,
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
      snapPoints={[0.1, 0.2, 0.5, 0.75, 0.9]}
      activeSnapPoint={drawerState.snap}
      setActiveSnapPoint={(snapPoint) => {
        if (typeof snapPoint === "number") {
          if (drawerState.dismissible) {
            setDrawerState({ snap: snapPoint, dismissible: true });
          } else if (snapPoint >= drawerState.snap) {
            setDrawerState({ snap: snapPoint, dismissible: false });
          }
        }
      }}
      modal={false}
      fixed={true}
      repositionInputs={false}
      shouldScaleBackground={false}
    >
      <Drawer.Portal>
        <Drawer.Content
          className={cn(
            "fixed inset-0 bottom-0 right-0 left-0 z-50",
            "mx-auto flex w-full flex-col",
            "rounded-t-[10px] border bg-background",
            "p-2 pb-6 md:w-3/4",
            "overflow-clip",
            "touch-pan-y"
          )}
        >
          <Drawer.Handle />

          {!activeLocation && !markerFormOpen && !collectionFormOpen && (
            <>
              <AutocompleteCustomInput />
              <div className="mt-16">
                {!searchActive && (
                  <>
                  <MarkersCollectionTabs />
                  <div className="flex items-center justify-center gap-2 mt-5">

                  <OpenCollectionModal />
                  </div>
                  </>
                )}
              </div>
            </>
          )}
          {activeLocation && !activeState && (!markerFormOpen || !collectionFormOpen) && (
            <ActiveLocation />
          )}

          {activeState && (markerFormOpen || collectionFormOpen) && (
            <div>
            <CloseButton />
              {markerFormOpen && (
                <ScrollArea>
                  <MarkerForm />
                </ScrollArea>
              )}
              {collectionFormOpen && (
                <ScrollArea>
                  <CollectionForm />
                </ScrollArea>
              )}
            </div>
          )}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
