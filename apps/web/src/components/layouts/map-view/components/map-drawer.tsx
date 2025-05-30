"use client";
// import * as Accordion from "@radix-ui/react-accordion";
import { Drawer } from "vaul";
// import CollectionCard from "../collection_card";
import CollectionModal from "@/components/modals/map/create_edit_collection_modal";
import { useMapStore } from "@/components/providers/map-state-provider";
import { Button } from "@/components/ui/button";
import { DrawerFooter } from "@/components/ui/drawer";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import DisplayActiveState from "./display-active-state";
import { cn } from "@/lib/utils";

export default function MapDrawer() {
  const { snap, setSnap, activeLocation, setActiveLocation, map } = useMapStore(
    (store) => store
  );

  return (
    <Drawer.Root
      open
      dismissible={false}
      snapPoints={[0.1, 0.2, 0.5, 0.75, 0.9]}
      activeSnapPoint={snap}
      setActiveSnapPoint={setSnap}
      modal={false}
      fixed={true}
    >
      <Drawer.Portal>
        <Drawer.Content className={cn("fixed inset-0 bottom-0 z-50",
    "mx-auto flex w-full flex-col",
    "rounded-t-[10px] border bg-background",
    "p-2 pb-6 md:w-3/4", "overflow-hidden")}>
          <div
            id="handle"
            className="top-0 mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted"
          />
          <Drawer.Title className="mb-2 flex flex-row items-center gap-2">
            {activeLocation ? (
              <Button variant="outline" onClick={() => setActiveLocation(null)}>
                <ArrowLeft /> Back
              </Button>
            ) : (
              <>
                <Link href="/app">
                  <ArrowLeft />
                </Link>
                {map!.title}
              </>
            )}
          </Drawer.Title>

          <DisplayActiveState />

          <DrawerFooter className="mb-12">
            <CollectionModal />
          </DrawerFooter>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
