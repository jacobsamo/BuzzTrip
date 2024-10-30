import { SignedIn, SignedOut } from "@clerk/clerk-expo";
import React from "react";
import { Text, View } from "react-native";
import SignInWithOAuth from "../SignInWithOAuth";

export default function LoginScreen() {
  return (
    <View className="w-dvw h-dvh items-center justify-center">
      <SignedOut>
        <View className="mx-4 w-full max-w-sm items-center rounded-2xl bg-card p-6 text-gray-800 shadow-lg">
          <View className="mb-6 items-center">
            <Text className="mb-2 text-4xl">🌍</Text>
            <Text className="text-center text-2xl font-bold text-foreground">
              Welcome to BuzzTrip
            </Text>
            <Text className="mt-2 text-center text-sm text-muted-foreground">
              Sign in to start planning your next adventure
            </Text>
          </View>
          <SignInWithOAuth />
        </View>
      </SignedOut>
    </View>
  );
}
