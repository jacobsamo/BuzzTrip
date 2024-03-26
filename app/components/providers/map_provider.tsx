import { Location, Marker, Map, Collection } from '@/lib/types';
import React, { createContext, useState, useContext } from 'react';

export type MapEnv = {
    GOOGLE_MAPS_API_KEY: string;
    GOOGLE_MAPS_MAPID: string;
}

// Define the type for the context value
export type MapContextValue = {
    markers: Marker[] | null;
    setMarkers: React.Dispatch<React.SetStateAction<Marker[] | null>>;
    map: Map | null;
    setMap: React.Dispatch<React.SetStateAction<Map | null>>;
    collections: Collection[] | null;
    setCollections: React.Dispatch<React.SetStateAction<Collection[] | null>>;
    activeLocation: Location | null;
    setActiveLocation: React.Dispatch<React.SetStateAction<Location | null>>;
    env: MapEnv
};

// Create a context to hold the state
const MapContext = createContext<MapContextValue | undefined>(undefined);

// Custom hook to access the context
export const useMapContext = (): MapContextValue => {
    const context = useContext(MapContext);
    if (!context) {
        throw new Error('useMapContext must be used within a MapProvider');
    }
    return context;
};


export interface MapProviderProps { 
    children: React.ReactNode,
    initialMarkers?: Marker[] | null,
    initialMap?: Map | null,
    initialCollections?: Collection[] | null,
    initialActiveLocation?: Location | null,
    env: MapEnv
}


// Context provider component
export const MapProvider = ({ children, env, initialMarkers = null, initialMap = null, initialCollections = null, initialActiveLocation = null }: MapProviderProps) => {
    // State variables
    const [markers, setMarkers] = useState<Marker[] | null>(initialMarkers);
    const [map, setMap] = useState<Map | null>(initialMap);
    const [collections, setCollections] = useState<Collection[] | null>(initialCollections);
    const [activeLocation, setActiveLocation] = useState<Location | null>(initialActiveLocation);

    // Context value
    const contextValue: MapContextValue = {
        markers,
        setMarkers,
        map,
        setMap,
        collections,
        setCollections,
        activeLocation,
        setActiveLocation,
        env
    };

    // Render the provider with context value and children
    return <MapContext.Provider value={contextValue}>{children}</MapContext.Provider>;
};
