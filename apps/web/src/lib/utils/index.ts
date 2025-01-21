import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { TravelTypeEnum } from "@buzztrip/db/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getGoogleMapsTravelMode(travelType: TravelTypeEnum) {
  switch (travelType) {
    case "driving":
      return google.maps.TravelMode.DRIVING;
    case "walking":
      return google.maps.TravelMode.WALKING;
    case "transit":
      return google.maps.TravelMode.TRANSIT;
    case "bicycling":
      return google.maps.TravelMode.BICYCLING;
    default:
      return google.maps.TravelMode.DRIVING;
  }
}
