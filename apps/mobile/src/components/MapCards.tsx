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
    <Link
      className="max-h-[300px] w-auto max-w-40 flex-1 flex-col items-center shadow-md"
      href={`/map/${mapId}`}
    >
      <Image src={image} alt="Map image" className="h-full w-full rounded-xl" />
      <Text className="text-center text-black">{title}</Text>
    </Link>
  );
};

export default MapCard;
