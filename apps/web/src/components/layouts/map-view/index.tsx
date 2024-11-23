"use client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import MapSidebar from "./components/map-sidebar";
import MapView from "@/components/mapping/google-maps/map-view";
import { useMediaQuery } from "@uidotdev/usehooks";
import MapDrawer from "./components/map-drawer";

export function Map_page() {
  const isMediumDevice = useMediaQuery("only screen and (min-width : 769px)");

  return (
    <SidebarProvider
      style={{
        // @ts-ignore
        "--sidebar-width": "20rem",
        "--sidebar-width-mobile": "20rem",
      }}
    >
      <div className="flex h-screen w-full">
        {isMediumDevice ? (
          <>
            <MapSidebar />
            <SidebarTrigger className="z-50 mt-2" />
          </>
        ) : (
          <MapDrawer />
        )}
        <MapView />
      </div>
    </SidebarProvider>
  );
}
