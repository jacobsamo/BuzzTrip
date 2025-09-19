
"use client";
import OpenCollectionModal from "@/components/modals/open-collection-modal";
import { useMapStore } from "@/components/providers/map-state-provider";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import React from "react";
import ActiveLocation from "./active-location";
import MarkersCollectionTabs from "./markers-collections";
import { buttonVariants } from "@/components/ui/button";
import PathsForm from "@/components/forms/paths-create-edit-form";
// import DisplayActiveState from "./display-active-state";
// import shallow from 'zustand/shallow'

const MapSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const { map, activeLocation, activeState, setActiveState } = useMapStore(
    (state) => state
  );

      const pathEditFormOpen = React.useMemo(() => {
      return activeState?.event === "paths:update" 
  }, [activeState]);


  const sidebarTitle = React.useMemo(() => {
    let title = map.title
    if (activeLocation) title = activeLocation.title
    if (pathEditFormOpen) title = `Editing ${activeState?.payload?.title}`
      return title
    }, [activeLocation, activeState]);


  return (
    <Sidebar variant="floating" {...props}>
      <SidebarHeader className="inline-flex items-center gap-2 p-2">
        <SidebarMenu className="flex flex-row items-center gap-2">
          <SidebarMenuItem>
            {!pathEditFormOpen && !activeLocation && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <SidebarMenuButton asChild>
                    <Link href="/app" className={buttonVariants({ variant: "outline", size: "icon" })}>
                      <ChevronLeft />
                    </Link>
                  </SidebarMenuButton>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Back to your maps</p>
                </TooltipContent>
              </Tooltip>
            )}
          </SidebarMenuItem>
          <SidebarMenuItem>
            <h1 className="text-xl font-medium text-gray-900">{sidebarTitle}</h1>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="p-2">
        {!pathEditFormOpen && !activeLocation && <MarkersCollectionTabs />}
        {!pathEditFormOpen && activeLocation && <ActiveLocation />}
        {pathEditFormOpen && <PathsForm />}
        
      </SidebarContent>

      <SidebarFooter>
        <OpenCollectionModal />
      </SidebarFooter>
    </Sidebar>
  );
};

export default MapSidebar;
