"use client";
import { useMapStore } from "@/components/providers/map-state-provider";
import { Location } from "@buzztrip/db/types";
import { useMediaQuery } from "@uidotdev/usehooks";
import {
  AdvancedMarker,
  Map as GoogleMap,
  InfoWindow,
  MapMouseEvent,
  Pin,
  useAdvancedMarkerRef,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import { env } from "env";
import { lazy, memo } from "react";
import MapDrawer from "./map-drawer";
import MapSideBar from "./map-sidebar";
import { AutocompleteCustomInput, detailsRequestCallback } from "./search";

const MarkerPin = lazy(() => import("./marker_pin"));

const Map = () => {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const map = useMap();
  const places = useMapsLibrary("places");
  const isMediumDevice = useMediaQuery("only screen and (min-width : 769px)");
  const {
    activeLocation,
    markers,
    setActiveLocation,
    searchValue,
    setSearchValue,
  } = useMapStore((store) => store);

  const mapOptions = {
    center: {
      lat: -25.2744,
      lng: 133.7751,
    },
    zoom: 4,
  };

  async function handleMapClick(e: MapMouseEvent) {
    if (!places || !map) return;
    e.domEvent?.stopPropagation();
    const placesService = new places.PlacesService(map);

    const requestOptions: google.maps.places.PlaceDetailsRequest = {
      placeId:
        e.detail.placeId || `${e.detail.latLng?.lat}, ${e.detail.latLng?.lng}`,
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
      console.log("res", res);
      if (res) {
        setActiveLocation(res.location);
        setSearchValue(
          res.placeDetails?.name ?? res.placeDetails?.formatted_address ?? ""
        );
      }
    });
  }

  return (
    <div className="flex flex-row">
      {isMediumDevice && <MapSideBar />}
      <div style={{ height: "100vh", width: "100%" }}>
        <AutocompleteCustomInput />
        <GoogleMap
          defaultCenter={mapOptions.center}
          defaultZoom={mapOptions.zoom}
          mapId={env.NEXT_PUBLIC_GOOGLE_MAPS_MAPID}
          disableDefaultUI={true}
          onClick={(e) => handleMapClick(e)}
          gestureHandling="greedy"
        >
          {activeLocation && (
            // !markers?.some(
            //   (marker) =>
            //     marker.lat === activeLocation.lat &&
            //     marker.lng === activeLocation.lng
            // ) &&
            <>
              <AdvancedMarker
                ref={markerRef}
                key={activeLocation.title}
                position={{
                  lat: activeLocation.lat,
                  lng: activeLocation.lng,
                }}
              >
                <Pin />
              </AdvancedMarker>
              {/* <InfoWindow
                position={{
                  lat: activeLocation.lat,
                  lng: activeLocation.lng,
                }}
                className=""
                headerContent={activeLocation.title}
              >
                {activeLocation.title}
            
              </InfoWindow> */}
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
                  setActiveLocation(marker as Location);
                }}
              >
                <MarkerPin marker={marker} size={16} />
              </AdvancedMarker>
            ))}
        </GoogleMap>

        {!isMediumDevice && <MapDrawer />}
      </div>
    </div>
  );
};

export default memo(Map);
