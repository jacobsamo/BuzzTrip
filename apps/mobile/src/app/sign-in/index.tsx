import SignInWithOAuth from "@/components/SignInWithOAuth";
import { View } from "react-native";

export default function SignIn() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <SignInWithOAuth />
    </View>
  );
}
