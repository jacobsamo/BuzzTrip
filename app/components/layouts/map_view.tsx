import React from 'react'
import { Collection, Marker } from '@/lib/types';
import Map from '../map';
import { MapProvider } from '../providers/map_provider';
import Main from './main';
import MainDrawer from '../main_drawer';


interface MainLayoutProps {
    markers: Marker[] | null;
    collections: Collection[] | null;
    env: {
        GOOGLE_MAPS_API_KEY: string;
        GOOGLE_MAPS_MAPID: string;
    }
}

const MapView = ({collections, markers, env}: MainLayoutProps) => {
  return (
    <main>
      <MapProvider initialCollections={collections} initialMarkers={markers} env={env}>

      <Map />
      
      <MainDrawer>
        <Main />

      </MainDrawer>
      </MapProvider>
    </main>
  )
}

export default MapView