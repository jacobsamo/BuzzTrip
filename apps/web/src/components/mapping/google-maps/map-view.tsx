"use client";
import { useMapStore } from "@/components/providers/map-state-provider";
import {
  AdvancedMarker,
  Map as GoogleMap,
  MapMouseEvent,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import { env } from "env";
import { memo, useMemo } from "react";
import DisplayMarkerInfo from "./display-marker-info";
import { AutocompleteCustomInput, detailsRequestCallback } from "./search";
import MarkerPin from "./marker_pin";

const Mapview = () => {
  const map = useMap();
  const places = useMapsLibrary("places");
  const { activeLocation, markers, setActiveLocation, setSearchValue } =
    useMapStore((store) => store);

  const mapOptions = useMemo(() => {
    return {
      center: {
        lat: -25.2744,
        lng: 133.7751,
      },
      zoom: 4,
    };
  }, []);

  async function handleMapClick(e: MapMouseEvent) {
    if (!places || !map) return;
    e.domEvent?.stopPropagation();
    e.stop();
    const placesService = new places.PlacesService(map);

    if (e.detail.placeId) {
      const requestOptions: google.maps.places.PlaceDetailsRequest = {
        placeId:
          e.detail.placeId ||
          `${e.detail.latLng?.lat}, ${e.detail.latLng?.lng}`,
        fields: [
          "geometry",
          "name",
          "formatted_address",
          "place_id",
          "photos",
          "rating",
          "price_level",
          "types",
          "website",
          "formatted_phone_number",
          "opening_hours",
          "reviews",
        ],
      };

      placesService.getDetails(requestOptions, (data) => {
        const res = detailsRequestCallback(map!, data);
        if (res) {
          setActiveLocation(res.location);
          setSearchValue(
            res.placeDetails?.name ?? res.placeDetails?.formatted_address ?? ""
          );
        }
      });
    }

    if (e.detail.latLng) {
    }
  }

  return (
    <div className="absolute inset-0 h-screen w-full flex-1">
      <AutocompleteCustomInput />
      <GoogleMap
        defaultCenter={mapOptions.center}
        defaultZoom={mapOptions.zoom}
        mapId={env.NEXT_PUBLIC_GOOGLE_MAPS_MAPID}
        disableDefaultUI={true}
        onClick={(e) => handleMapClick(e)}
        gestureHandling="greedy"
        reuseMaps
      >
        {activeLocation && (
          // !markers?.some(
          //   (marker) =>
          //     marker.lat === activeLocation.lat &&
          //     marker.lng === activeLocation.lng
          // ) &&
          <>
            <DisplayMarkerInfo location={activeLocation} />
          </>
        )}

        {markers &&
          markers.map((marker) => (
            <AdvancedMarker
              key={marker.marker_id}
              position={{ lat: marker.lat, lng: marker.lng }}
              title={marker.title}
              onClick={() => {
                map!.panTo({ lat: marker.lat, lng: marker.lng });
                setActiveLocation(marker);
              }}
            >
              <MarkerPin marker={marker} size={16} />
            </AdvancedMarker>
          ))}
      </GoogleMap>
    </div>
  );
};

export default memo(Mapview);
