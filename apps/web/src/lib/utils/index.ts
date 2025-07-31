import { Id } from "@buzztrip/backend/dataModel";
import {
  Collection,
  CollectionLink,
  Marker,
  TravelTypeEnum,
} from "@buzztrip/backend/types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const upperCaseFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
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

export const getCollectionsForMarker = (
  collections: Collection[],
  collectionLinks: CollectionLink[],
  markerId: string
) => {
  const collectionIds = collectionLinks
    .filter((link) => link.marker_id === markerId)
    .map((link) => link.collection_id);

  // Get the collections that match the collection IDs
  const markerCollections = collections.filter((collection) =>
    collectionIds.includes(collection._id as Id<"collections">)
  );

  return markerCollections;
};

type PartialMarkerWithId = Pick<Marker, "_id"> & Partial<Marker>;

export const getMarkersForCollection = (
  markers: PartialMarkerWithId[],
  collectionLinks: CollectionLink[],
  collectionId: string
) => {
  const markerIds = collectionLinks
    .filter((link) => link.collection_id === collectionId)
    .map((link) => link.marker_id);

  // Get the markers that match the marker IDs
  const links = markers.filter((marker) =>
    markerIds.includes(marker._id as Id<"markers">)
  );

  return links;
};
