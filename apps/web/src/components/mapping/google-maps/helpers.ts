import { Id } from "@buzztrip/backend/dataModel";
import { CombinedMarker } from "@buzztrip/backend/types";

export interface DetailsRequestCallbackReturn {
  placeDetails: google.maps.places.PlaceResult;
  location: CombinedMarker;
  bounds: google.maps.LatLngBounds;
}

export const detailsRequestCallback = (
  map: google.maps.Map,
  placeDetails: google.maps.places.PlaceResult | null,
  isMobile: boolean = false
): DetailsRequestCallbackReturn | null => {
  if (
    placeDetails == null ||
    !placeDetails.geometry ||
    !placeDetails.geometry.location
  ) {
    console.warn("Returned place contains no geometry");
    return null;
  }

  const bounds = new google.maps.LatLngBounds();

  if (placeDetails.geometry.viewport) {
    const viewport = placeDetails.geometry.viewport;
    if (isMobile) {
      const offsetViewport = new google.maps.LatLngBounds(
        new google.maps.LatLng(
          viewport.getSouthWest().lat() - 0.3,
          viewport.getSouthWest().lng()
        ),
        viewport.getNorthEast()
      );
      bounds.union(offsetViewport);
      map!.fitBounds(offsetViewport);
    } else {
      bounds.union(viewport);
      map!.fitBounds(viewport);
    }
  } else {
    bounds.extend(placeDetails.geometry.location);
    const center = placeDetails.geometry.location;
    if (isMobile) {
      const offset = new google.maps.LatLng(center.lat() - 0.3, center.lng());
      map!.setCenter(offset);
    } else {
      map!.setCenter(center);
    }
    map!.setZoom(8);
  }

  const title = placeDetails.name
    ? placeDetails.name
    : `${placeDetails.geometry.location.lat()}, ${placeDetails.geometry.location.lng()}`;

  const location: CombinedMarker = {
    color: "#0b7138",
    icon: "MapPin",
    lat: placeDetails.geometry.location.lat(),
    lng: placeDetails.geometry.location.lng(),
    note: undefined,
    title: title,
    map_id: "" as Id<"maps">,
    place: {
      gm_place_id: placeDetails.place_id ?? undefined,
      lat: placeDetails.geometry.location.lat(),
      lng: placeDetails.geometry.location.lng(),
      bounds: bounds.toJSON(),
      icon: "MapPin",
      title: title,
      description: placeDetails?.html_attributions?.[0] ?? undefined,
      plus_code: placeDetails.plus_code?.global_code ?? undefined,
      address: placeDetails.formatted_address ?? undefined,
      photos:
        placeDetails?.photos?.map((photo) => photo.getUrl({})) ?? undefined,
      rating: placeDetails.rating ?? 0,
      types: placeDetails.types ?? undefined,
      website: placeDetails.website ?? undefined,
      phone: placeDetails.formatted_phone_number ?? undefined,
    },
  };

  return {
    placeDetails,
    location,
    bounds,
  };
};