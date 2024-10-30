import React from "react";
import * as WebBrowser from "expo-web-browser";
import { TouchableOpacity, Text, View } from "react-native";
import { useOAuth } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";

WebBrowser.maybeCompleteAuthSession();

const SignInWithOAuth = () => {
  React.useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);

  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const onPress = React.useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL("/", { scheme: "buzztrip" }),
      });

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  }, []);

  return (
    <TouchableOpacity className="flex flex-row gap-2" onPress={onPress}>
      <Text className="text-lg">🌐</Text>
      <Text className="text-base font-medium ">
        Continue with Google
      </Text>
    </TouchableOpacity>
  );
};

export default SignInWithOAuth;
