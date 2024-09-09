"use client";
import {
  APIProvider,
  AdvancedMarker,
  Map as GoogleMap,
  Pin,
  useMap,
} from "@vis.gl/react-google-maps";
import { lazy, memo } from "react";
import { AutocompleteCustomInput } from "./search";
import { Location } from "@/types";
import { useMapStore } from "@/components/providers/map-state-provider";
import MapDrawer from "./map-drawer";
import { useMediaQuery } from "@uidotdev/usehooks";
import MapSideBar from "./map-sidebar";
import { IconName } from "@/components/icon";

const MarkerPin = lazy(() => import("./marker_pin"));

const Map = () => {
  const map = useMap();
  const isMediumDevice = useMediaQuery("only screen and (min-width : 769px)");
  const { activeLocation, markers, setActiveLocation } = useMapStore(
    (store) => store
  );

  const mapOptions = {
    center: {
      lat: -25.2744,
      lng: 133.7751,
    },
    zoom: 4,
  };

  return (
    <div className="flex flex-row">
      {isMediumDevice && <MapSideBar />}
      <div style={{ height: "100vh", width: "100%" }}>
        <AutocompleteCustomInput />
        <GoogleMap
          defaultCenter={mapOptions.center}
          defaultZoom={mapOptions.zoom}
          mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAPID}
          disableDefaultUI={true}
          onClick={(e) => {
            console.log("Click map event: ", e);
          }}
          gestureHandling="greedy"
        >
          {activeLocation &&
            !markers?.some(
              (marker) =>
                marker.lat === activeLocation.lat &&
                marker.lng === activeLocation.lng
            ) && (
              <AdvancedMarker
                key={activeLocation.title}
                position={{
                  lat: activeLocation.lat,
                  lng: activeLocation.lng,
                }}
              >
                <Pin />
              </AdvancedMarker>
            )}

          {markers &&
            markers.map((marker) => (
              <AdvancedMarker
                key={marker.map_id}
                position={{ lat: marker.lat, lng: marker.lng }}
                title={marker.title}
                onClick={() => {
                  map!.panTo({ lat: marker.lat, lng: marker.lng });
                  setActiveLocation(marker as Location);
                }}
              >
                <MarkerPin
                  marker={{ ...marker, icon: marker.icon as IconName }}
                  size={16}
                />
              </AdvancedMarker>
            ))}
        </GoogleMap>

        {!isMediumDevice && <MapDrawer />}
      </div>
    </div>
  );
};

export default memo(Map);
