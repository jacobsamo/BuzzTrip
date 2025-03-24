import { createContext, useContext, useState } from "react";

const REDIRECT_URL = "/app";

type FlowState = "general" | "oAuth" | "verify" | "passkey";

// Define the type for the context value
export type AuthContextValue = {
  REDIRECT_URL: string;
  flowState: FlowState | null;
  setFlowState: (state: FlowState) => void;
};

// Create a context to hold the state
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Custom hook to access the context
export const useAuthContext = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useMapContext must be used within a MapProvider");
  }
  return context;
};

export interface RecipeProviderProps {
  children: React.ReactNode;
}

// Context provider component
export const AuthFormProvider = ({ children }: RecipeProviderProps) => {
  const [flowState, setFlowState] = useState<FlowState>("general");

  // Context value
  const contextValue: AuthContextValue = {
    REDIRECT_URL,
    flowState,
    setFlowState: (state) => setFlowState(state),
  };

  // Render the provider with context value and children
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
