import type { Collection, Marker, Map as TMap } from "@/lib/types";
import { lazy } from "react";
import { MapProvider } from "../providers/map_provider";
import Map from "../map";
import Main from "./main";
import MainDrawer from "@/routes/map.$mapId/main_drawer";

// const MainDrawer = lazy(() => import('@/routes/map.$mapId/main_drawer'));
// const Map = lazy(() => import('@/routes/map.$mapId/map'));
const Main = lazy(() => import("./main"));

interface MainLayoutProps {
  markers: Marker[] | null;
  collections: Collection[] | null;
  map: TMap;
  env: {
    GOOGLE_MAPS_API_KEY: string;
    GOOGLE_MAPS_MAPID: string;
  };
}

const MapView = ({ collections, markers, env, map }: MainLayoutProps) => {
  return (
    <main className="overflow-hidden">
      <MapProvider
        initialCollections={collections}
        initialMarkers={markers}
        env={env}
        initialMap={map}
      >
        <Map />
        <MainDrawer>
          <Main />
        </MainDrawer>
      </MapProvider>
    </main>
  );
};

export default MapView;
