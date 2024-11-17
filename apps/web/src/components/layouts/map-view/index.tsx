import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import MapSidebar from "./components/map-sidebar";
import MapView from "@/components/mapping/google-maps/map-view";

export function Map_page() {
  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "20rem",
        "--sidebar-width-mobile": "20rem",
      }}
    >
      <div className="flex h-screen w-full">
        <MapSidebar />
        <SidebarTrigger className="z-50 mt-2" />
        <div className="absolute inset-0 h-screen w-full flex-1">
          <MapView />
        </div>
      </div>
    </SidebarProvider>
  );
}
