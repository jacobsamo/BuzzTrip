import { View, Text, StyleSheet } from "react-native";
import { Link } from "expo-router";
import React from "react";
import { Image } from "react-native-elements";

export interface MapCardProps {
  image: string;
  title: string;
  mapId: string;
}

export const MapCard = ({ image, title, mapId }: MapCardProps) => {
  return (
    <Link className="flex flex-1 items-center w-auto flex-col max-w-40 max-h-[300px]" href={`/map/${mapId}`}>
      <Image src={image} alt="Map image" className="w-full h-full rounded-xl" />
      <Text className="text-center text-black">{title}</Text>
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
