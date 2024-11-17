"use client";
// import * as Accordion from "@radix-ui/react-accordion";
import { Drawer } from "vaul";
// import CollectionCard from "../collection_card";
import { useMapStore } from "@/components/providers/map-state-provider";
import MainView from "./main-view";

export default function MapDrawer() {
  const {
    snap,
    setSnap,
  } = useMapStore((store) => store);

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
      <Drawer.Content className="fixed inset-0 bottom-0 z-50 mx-auto flex w-full flex-col rounded-t-[10px] border bg-background p-2 pb-6 md:w-3/4">
        <div
          id="handle"
          className="top-0 mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted"
        />

        <MainView />
      </Drawer.Content>
    </Drawer.Root>
  );
}
