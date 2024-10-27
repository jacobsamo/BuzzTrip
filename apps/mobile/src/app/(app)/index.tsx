import React, { useEffect } from "react";
import { useAuth } from "@clerk/clerk-expo";
import { Text, View, Button } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api.client";

// login page that after login will route to /[id] containing the userId
export default function App() {
  const { userId } = useAuth();

  if (!userId) {
    return <Text>Loading...</Text>;
  }

  const { data, refetch } = useQuery({
    queryKey: ["maps", userId],
    queryFn: async () => {
      try {
        const res = await apiClient[":userId"].maps.$get({
          param: { userId },
        });

        console.log("data: ", res);

        if (res.ok) {
          return res.json();
        }
        return null;
      } catch (error) {
        console.log("Error fetching data", error);
        return null;
      }
    },
  });

  return (
    <View>
      <Text className="text-black">Main page</Text>
      {data?.map((map) => <Text key={map.map_id}>{map.map_id}</Text>)}
      <Button title="Refresh" onPress={() => refetch()} />
    </View>
  );
}
