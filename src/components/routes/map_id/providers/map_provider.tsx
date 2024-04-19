import { Collection, LocationEdit, Map, Marker } from "@/types";
import { createContext, useContext, useState } from "react";

export type MapEnv = {
  GOOGLE_MAPS_API_KEY: string;
  GOOGLE_MAPS_MAPID: string;
};

// Define the type for the context value
export type MapContextValue = {
  markers: Marker[] | null;
  setMarkers: React.Dispatch<React.SetStateAction<Marker[] | null>>;
  map: Map | null;
  setMap: React.Dispatch<React.SetStateAction<Map | null>>;
  searchValue: string;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  collections: Collection[] | null;
  setCollections: React.Dispatch<React.SetStateAction<Collection[] | null>>;
  activeLocation: LocationEdit | null;
  setActiveLocation: React.Dispatch<React.SetStateAction<LocationEdit | null>>;
  addToCollectionOpen: boolean;
  setAddToCollectionOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

// Create a context to hold the state
const MapContext = createContext<MapContextValue | undefined>(undefined);

// Custom hook to access the context
export const useMapContext = (): MapContextValue => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error("useMapContext must be used within a MapProvider");
  }
  return context;
};

export interface MapProviderProps {
  children: React.ReactNode;
  initialMap: Map;
  initialMarkers?: Marker[] | null;
  initialCollections?: Collection[] | null;
  initialActiveLocation?: LocationEdit | null;
}

// Context provider component
export const MapProvider = ({
  children,
  initialMarkers = null,
  initialMap,
  initialCollections = null,
  initialActiveLocation = null,
}: MapProviderProps) => {
  // State variables
  const [markers, setMarkers] = useState<Marker[] | null>(initialMarkers);
  const [map, setMap] = useState<Map | null>(initialMap);
  const [collections, setCollections] = useState<Collection[] | null>(
    initialCollections
  );
  const [activeLocation, setActiveLocation] = useState<LocationEdit | null>(
    initialActiveLocation
  );
  const [addToCollectionOpen, setAddToCollectionOpen] =
    useState<boolean>(false);

  const [searchValue, setSearchValue] = useState<string>("");

  // Context value
  const contextValue: MapContextValue = {
    markers,
    setMarkers,
    map,
    setMap,
    searchValue,
    setSearchValue,
    collections,
    setCollections,
    activeLocation,
    setActiveLocation,
    addToCollectionOpen,
    setAddToCollectionOpen,
  };

  // Render the provider with context value and children
  return (
    <MapContext.Provider value={contextValue}>{children}</MapContext.Provider>
  );
};
