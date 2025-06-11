"use client";
import OpenCollectionModal from "@/components/modals/open-collection-modal";
import { useMapStore } from "@/components/providers/map-state-provider";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar";
import React from "react";
import ActiveLocation from "./active-location";
import CollectionTree from "./tree-view";
import MarkersCollectionTabs from "./markers-collections";
// import DisplayActiveState from "./display-active-state";
// import shallow from 'zustand/shallow'

const MapSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const { map, activeLocation, activeState, setActiveState } = useMapStore((state) => state);

  return (
    <Sidebar variant="floating" {...props}>
      <SidebarContent className="p-2">
        {!activeLocation && <MarkersCollectionTabs />}
        {activeLocation && <ActiveLocation />}
      </SidebarContent>

      <SidebarFooter>
        <OpenCollectionModal />
      </SidebarFooter>
    </Sidebar>
  );
};

export default MapSidebar;
