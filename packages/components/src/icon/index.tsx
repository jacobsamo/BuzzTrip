import React from "react";
import {
  Icons,
  accommodation,
  activities,
  food,
  other,
  places,
  popular,
  transport,
} from "./icons";
import type {
  AccommodationIcon,
  ActivitiesIcon,
  TransportIcon,
  FoodIcon,
  PlacesIcon,
  OtherIcon,
  IconType,
  PopularIcon,
} from "@buzztrip/db/types";

export interface IconProps {
  name: IconType;
  color?: React.CSSProperties["color"] | string;
  size?: number;
}

const Icon = ({
  name = "MapPin",
  color = "#000",
  size = 24,
  ...props
}: IconProps) => {
  const DisplayIcon = Icons[name];

  return <DisplayIcon color={color} size={size} weight="regular" {...props} />;
};

export default Icon;

export * from './icons'

export const iconsList = Object.keys(Icons) as IconType[];
export const popularIconsList = Object.keys(popular) as PopularIcon[];
export const activitiesIconsList = Object.keys(activities) as ActivitiesIcon[];
export const accommodationIconsList = Object.keys(accommodation) as AccommodationIcon[];
export const foodIconsList = Object.keys(food) as FoodIcon[];
export const placesIconsList = Object.keys(places) as PlacesIcon[];
export const transportIconsList = Object.keys(transport) as TransportIcon[];
export const otherIconsList = Object.keys(other) as OtherIcon[];
