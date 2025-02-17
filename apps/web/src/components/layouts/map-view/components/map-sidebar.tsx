"use client";
import React from "react";
import { useMapStore } from "@/components/providers/map-state-provider";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CollectionModal from "@/components/modals/map/create_edit_collection_modal";
import DisplayCollection from "./display-collection";
import { CombinedMarker } from "@buzztrip/db/types";
import DisplayActiveState from "./display-active-state";

const MapSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const {
    activeLocation,
    markers,
    setActiveLocation,
    searchValue,
    setSearchValue,
    collections,
    getMarkersForCollection,
    map,
  } = useMapStore((store) => store);

  return (
    <Sidebar variant="floating" {...props}>
      <SidebarHeader className="inline-flex items-center gap-2 p-2">
        <SidebarMenu className="flex flex-row items-center gap-2">
          <SidebarMenuItem>
            {activeLocation ? (
              <SidebarMenuButton onClick={() => setActiveLocation(null)}>
                <ArrowLeft />
              </SidebarMenuButton>
            ) : (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SidebarMenuButton asChild>
                      <Link href="/app">
                        <ArrowLeft />
                      </Link>
                    </SidebarMenuButton>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Back to Home</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </SidebarMenuItem>
          <SidebarMenuItem>
            <h1>{activeLocation ? activeLocation.title : map!.title}</h1>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <DisplayActiveState />
      </SidebarContent>

      <SidebarFooter>
        <CollectionModal />
      </SidebarFooter>
    </Sidebar>
  );
};

export default MapSidebar;
