import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ClerkProvider from "./clerk-provider";
import { Text } from "react-native";
import { ClerkLoaded } from "@clerk/clerk-expo";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider>
      <SafeAreaView style={{ flex: 1 }}>{children}</SafeAreaView>
    </ClerkProvider>
  );
};

export default Providers;
