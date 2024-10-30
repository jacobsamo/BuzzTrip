import React, { useEffect } from "react";
import { Text, View, Button } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api.client";
import { MapCard } from "@/components/MapCards";
import { useClerk, useAuth } from "@clerk/clerk-expo";

// login page that after login will route to /[id] containing the userId
export default function App() {
  const { userId, signOut } = useAuth();

  if (!userId) {
    return <Text>Loading...</Text>;
  }

  const { data, refetch } = useQuery({
    queryKey: ["maps", userId],
    queryFn: async () => {
      try {
        const res = await apiClient.user[":userId"].maps.$get({
          param: { userId },
        });
        return res.ok ? res.json() : null;
      } catch (error) {
        console.log("Error fetching data", error);
        return null;
      }
    },
  });

  return (
    <View>
      <Text className="text-black">Main page</Text>
      {data?.map((map) => (
        <MapCard
          key={map.map_id}
          image={map.image!}
          title={map.title}
          mapId={map.map_id!}
        />
      ))}
      <Button title="Refresh" onPress={() => refetch()} />
      <Button title="Sign out" onPress={() => signOut()} />
    </View>
  );
}
