import React from "react";
import { useAuth } from "@clerk/clerk-expo";
import { Text, View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api.client";

// login page that after login will route to /[id] containing the userId
export default function App() {
  const { userId } = useAuth();

  if (!userId) {
    return <Text>Loading...</Text>;
  }

  const { data } = useQuery({
    queryKey: ["maps", userId],
    queryFn: async () => {
      const res = await apiClient[":userId"].maps.$get({
        param: { userId },
      });
      const data = await res.json();

    },
  });

  return (
    <View>
      <Text className="text-black">Main page</Text>
      {data!}
    </View>
  );
}
