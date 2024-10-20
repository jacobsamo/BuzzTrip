import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ClerkProvider from "./clerk-provider";
import ReactQueryProvider from "./react-query-provider";


const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider>
      <ReactQueryProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            {children}
          </GestureHandlerRootView>
        </SafeAreaView>
      </ReactQueryProvider>
    </ClerkProvider>
  );
};

export default Providers;
