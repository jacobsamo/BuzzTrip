import React from "react";
import { Text, View } from "react-native";
import { Link, useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api.client";
import { Button } from "react-native-elements";
import MapViewPage from "@/components/screens/MapView";

// gets map data for the map that matches to the mapId && userId
const MapView = () => {
  const { mapId } = useLocalSearchParams();

  const { data } = useQuery({
    queryKey: ["map", mapId],
    queryFn: async () => {
      try {
        const res = await apiClient.map[":mapId"].data.$get({
          param: {
            mapId: mapId as string,
          },
        });
        return res.ok ? res.json() : null;
      } catch (error) {
        console.log("Error fetching data", error);
        return null;
      }
    },
  });

  if (!data) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      <MapViewPage
        initState={{
          ...data,
          mapUsers: data?.mapUsers ?? null,
          collectionMarkers: data?.collection_markers ?? null,
        }}
      />
    </View>
  );
};

export default MapView;
