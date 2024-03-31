import type { Collection, Marker, Map as TMap } from '@/lib/types';
import MainDrawer from '@/routes/map.$mapId/main_drawer';
import Map from '@/routes/map.$mapId/map';
import { MapProvider } from '@/routes/map.$mapId/providers/map_provider';
import Main from './main';

interface MainLayoutProps {
    markers: Marker[] | null;
    collections: Collection[] | null;
    map: TMap;
    env: {
        GOOGLE_MAPS_API_KEY: string;
        GOOGLE_MAPS_MAPID: string;
    }
}

const MapView = ({collections, markers, env, map}: MainLayoutProps) => {
  return (
    <main>
      <MapProvider initialCollections={collections} initialMarkers={markers} env={env} initialMap={map}>

      <Map />
      
      <MainDrawer>
        <Main />

      </MainDrawer>
      </MapProvider>
    </main>
  )
}

export default MapView