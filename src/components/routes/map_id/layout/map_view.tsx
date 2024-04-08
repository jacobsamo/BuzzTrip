"use client";
import type { Collection, Marker, Map as TMap } from "@/types";
import { MapProvider } from "../providers/map_provider";
import Map from "../map";

interface MainLayoutProps {
  markers: Marker[] | null;
  collections: Collection[] | null;
  map: TMap;
}

const MapView = ({ collections, markers, map }: MainLayoutProps) => {
  return (
    <main className="h-full w-full">
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
