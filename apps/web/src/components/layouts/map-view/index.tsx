"use client";
import MapView from "@/components/mapping/google-maps/map-view";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useMediaQuery } from "@uidotdev/usehooks";
import MainModal from "./components/main-modal";
import MapDrawer from "./components/map-drawer";
import MapSidebar from "./components/map-sidebar";

export function Map_page() {
  const isMediumDevice = useMediaQuery("only screen and (min-width : 769px)");

  return (
    <SidebarProvider
      style={{
        // @ts-expect-error - TS(2339): Property 'style' does not exist on type 'IntrinsicAttributes & SidebarProviderProps & { children: ReactNode; }'.
        "--sidebar-width": "20rem",
        "--sidebar-width-mobile": "20rem",
      }}
    >
      <style jsx global>{`
        html,
        body,
        #__next {
          height: 100%;
          overflow: hidden;
          margin: 0;
          padding: 0;
        }
      `}</style>
      {/* full-screen, relative positioning, locked scroll */}
      <div className="relative h-screen w-full overflow-hidden">
        {/* === Layer 2: The Map (fills entire container) === */}
        <div className="absolute inset-0 z-0">
          <MapView />
        </div>

        {/* === Layer 1: UI Overlay === */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {/* Search bar (or sidebar trigger on desktop) */}
          <div className="pointer-events-auto">
            {isMediumDevice ? (
              <>
                <MapSidebar />
                <SidebarTrigger className="mt-2" />
                {/* <MainModal /> */}
              </>
            ) : (
              /* Drawer trigger is inside MapDrawer already */
              <MapDrawer />
            )}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
