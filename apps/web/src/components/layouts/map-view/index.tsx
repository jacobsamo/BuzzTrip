"use client";
// import MapView from "@/components/mapping/google-maps-old/map-view";
import { useMapStore } from "@/components/providers/map-state-provider";
import { buttonVariants } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useMediaQuery } from "@uidotdev/usehooks";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import MainModal from "./components/main-modal";
import MapDrawer from "./components/map-drawer";
import MapSidebar from "./components/map-sidebar";
import GoogleMapsMapView from "@/components/mapping/google-maps"

export function Map_page() {
  const setIsMobile = useMapStore((store) => store.setMobile);
  const isMobileDevice = useMediaQuery("only screen and (max-width : 768px)");

  useEffect(() => {
    setIsMobile(isMobileDevice);
  }, [isMobileDevice]);

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
          touch-action: none;
        }
      `}</style>
      {/* full-screen, relative positioning, locked scroll */}
      <div className="relative h-screen w-full overflow-hidden">
        {/* === Layer 2: The Map (fills entire container) === */}
        <div className="absolute inset-0 z-0">
          <GoogleMapsMapView />
          {/* <MapView /> */}
        </div>

        {/* === Layer 1: UI Overlay === */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {/* Search bar (or sidebar trigger on desktop) */}
          <div className="pointer-events-auto">
            {isMobileDevice ? (
              /* Drawer trigger is inside MapDrawer already */
              <>
                <MapDrawer />
                <Link
                  href="/app"
                  prefetch={true}
                  className={buttonVariants({
                    variant: "outline",
                    size: "icon",
                    className: "absolute top-2 left-2 z-10",
                  })}
                >
                  <ChevronLeft />
                </Link>
              </>
            ) : (
              <>
                <MapSidebar />
                <SidebarTrigger className="mt-2" />
                <MainModal />
              </>
            )}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
