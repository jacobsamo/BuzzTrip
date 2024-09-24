import { SignedIn, SignedOut } from "@clerk/clerk-expo";
import React from "react";
import { Text, View } from "react-native";
import SignInWithOAuth from "../SignInWithOAuth";

export default function LoginScreen() {
  return (
    <View>
      <SignedIn>
        <Text>You are Signed in</Text>
      </SignedIn>
      <SignedOut>
        <SignInWithOAuth />
      </SignedOut>
    </View>
  );
}
