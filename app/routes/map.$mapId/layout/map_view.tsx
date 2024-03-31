import type { Collection, Marker, Map as TMap } from '@/lib/types';
import { lazy, Suspense } from 'react';
import { MapProvider } from '../providers/map_provider';

const MainDrawer = lazy(() => import('@/routes/map.$mapId/main_drawer'));
const Map = lazy(() => import('@/routes/map.$mapId/map'));
const Main = lazy(() => import('./main'));

interface MainLayoutProps {
  markers: Marker[] | null;
  collections: Collection[] | null;
  map: TMap;
  env: {
    GOOGLE_MAPS_API_KEY: string;
    GOOGLE_MAPS_MAPID: string;
  }
}

const MapView = ({ collections, markers, env, map }: MainLayoutProps) => {
  return (
    <main>
        <MapProvider initialCollections={collections} initialMarkers={markers} env={env} initialMap={map}>
          <Suspense fallback={<div>Loading Map...</div>}>
            <Map />
          </Suspense>
          <Suspense fallback={<div>Loading Main Drawer...</div>}>
            <MainDrawer>
              <Suspense fallback={<div>Loading Main...</div>}>
                <Main />
              </Suspense>
            </MainDrawer>
          </Suspense>
        </MapProvider>
    </main>
  )
}

export default MapView;