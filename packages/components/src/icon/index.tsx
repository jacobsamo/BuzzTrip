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

export type IconName = keyof typeof Icons;

export interface IconProps {
  name: IconName;
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

export const iconsList = Object.keys(Icons) as IconName[];
export const popularIconsList = Object.keys(popular) as IconName[];
export const activitiesIconsList = Object.keys(activities) as IconName[];
export const accommodationIconsList = Object.keys(accommodation) as IconName[];
export const foodIconsList = Object.keys(food) as IconName[];
export const placesIconsList = Object.keys(places) as IconName[];
export const transportIconsList = Object.keys(transport) as IconName[];
export const otherIconsList = Object.keys(other) as IconName[];
