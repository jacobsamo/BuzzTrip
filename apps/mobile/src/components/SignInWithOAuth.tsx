import React from "react";
import * as WebBrowser from "expo-web-browser";
import { TouchableOpacity, Text, View } from "react-native";
import { useOAuth } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";
import Google from "./GoogleLogo";
import { Button } from "@/components/ui/button";

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
    <Button className="flex flex-row gap-2" onPress={onPress}>
      <Google size={24} />
      <Text className="text-base font-medium">Continue with Google</Text>
    </Button>
  );
};

export default SignInWithOAuth;
