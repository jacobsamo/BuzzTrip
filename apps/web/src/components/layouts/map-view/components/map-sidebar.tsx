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
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";
import DisplayActiveState from "./display-active-state";
import shallow from 'zustand/shallow'

const MapSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const { map, activeState, setActiveState } = useMapStore((store) => ({map: store.map,
    activeState: store.activeState,
    setActiveState: store.setActiveState}), shallow);

  return (
    <Sidebar variant="floating" {...props}>
      <SidebarHeader className="inline-flex items-center gap-2 p-2">
        <SidebarMenu className="flex flex-row items-center gap-2">
          <SidebarMenuItem>
            {activeState && activeState.event === "activeLocation" ? (
              <SidebarMenuButton onClick={() => setActiveState(null)}>
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
            <h1>
              {activeState && activeState.event === "activeLocation"
                ? activeState.payload.title
                : map!.title}
            </h1>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <DisplayActiveState />
      </SidebarContent>

      <SidebarFooter>
        <OpenCollectionModal />
      </SidebarFooter>
    </Sidebar>
  );
};

export default MapSidebar;
