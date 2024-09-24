import { useAuth } from "@clerk/clerk-expo";
import { Redirect, Slot } from "expo-router";

export default function AppLayout() {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return <Redirect href="/sign-in" />;
  }

  return <Slot />;
}
