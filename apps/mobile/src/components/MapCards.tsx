import { View, Text, StyleSheet } from "react-native";
import { Link } from "expo-router";
import React from "react";
import { Image } from "react-native-elements";

interface MapCardProps {
  image: string;
  title: string;
  mapId: string;
}

const MapCard = ({ image, title, mapId }: MapCardProps) => {
  return (
    <Link style={styles.container} href={`/app/map/${mapId}`}>
      <Image src={image} alt="Map image" style={styles.image} />
      <Text style={styles.title}>{title}</Text>
    </Link>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    width: "auto",
    display: "flex",
    flexDirection: "column",
    maxWidth: 150,
    maxHeight: 300,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  title: {
    color: "black",
  },
});

export default MapCard;
