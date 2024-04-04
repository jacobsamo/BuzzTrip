import { createContext, useContext, useState } from "react";

export type MapEnv = {
  GOOGLE_MAPS_API_KEY: string;
  GOOGLE_MAPS_MAPID: string;
};

// Define the type for the context value
export type GlobalProviderContextValue = {
  snap: number | string | null;
  setSnap: React.Dispatch<React.SetStateAction<number | string | null>>;
};

// Create a context to hold the state
const GlobalContext = createContext<GlobalProviderContextValue | undefined>(
  undefined
);

// Custom hook to access the context
export const useGlobalContext = (): GlobalProviderContextValue => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useMapContext must be used within a MapProvider");
  }
  return context;
};

export interface GlobalProviderProps {
  children: React.ReactNode;
}

// Context provider component
export const GlobalProvider = ({ children }: GlobalProviderProps) => {
  // State variables
  const [snap, setSnap] = useState<number | string | null>(0.2);

  const contextValue: GlobalProviderContextValue = {
    snap,
    setSnap,
  };

  // Render firstrovider with context value and children
  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  );
};
