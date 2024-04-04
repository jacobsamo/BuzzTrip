"use client";
import type { Collection, Marker, Map as TMap } from "@/types";
import { lazy } from "react";
import { MapProvider } from "../providers/map_provider";
import Map from "../map";
import MainDrawer from "@/components/routes/map_id/main_drawer";

// const MainDrawer = lazy(() => import('@/routes/map.$mapId/main_drawer'));
// const Map = lazy(() => import('@/routes/map.$mapId/map'));
const Main = lazy(() => import("./main"));

interface MainLayoutProps {
  markers: Marker[] | null;
  collections: Collection[] | null;
  map: TMap;
}

const MapView = ({ collections, markers, map }: MainLayoutProps) => {
  return (
    <main className="w-full h-full">
      <MapProvider
        initialCollections={collections}
        initialMarkers={markers}
        initialMap={map}
      >
        <Map />
    
      </MapProvider>
    </main>
  );
};

export default MapView;
