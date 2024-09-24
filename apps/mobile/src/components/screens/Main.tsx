import { View, Text } from "react-native";
import React from "react";
import MapCard from "../MapCards";
import Sheet from "../Sheet";
import { Link } from "expo-router";
import { StyleSheet } from "react-native";

export default function MainPage() {
  const maps = [
    { mapId: '1', title: "Test Map" },
    { mapId: '2', title: "Sydney" },
    { mapId: '3', title: "Brisbane" },
    { mapId: '4', title: "Perth" },
  ];

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.mapcards}>
        {maps.map((map) => (
          <MapCard
            key={map.mapId}
            image="https://via.placeholder.com/150"
            title={map.title}
            mapId={map.mapId}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mapcards: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    paddingLeft: 8,
    paddingRight: 8,
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },
});
