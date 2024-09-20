"use client";
import { useMapStore } from "@/components/providers/map-state-provider";
import { Location } from "@/types";
import { useMediaQuery } from "@uidotdev/usehooks";
import {
  AdvancedMarker,
  Map as GoogleMap,
  Pin,
  useMap
} from "@vis.gl/react-google-maps";
import { env } from "env";
import { lazy, memo } from "react";
import MapDrawer from "./map-drawer";
import MapSideBar from "./map-sidebar";
import { AutocompleteCustomInput } from "./search";

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
          mapId={env.NEXT_PUBLIC_GOOGLE_MAPS_MAPID}
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
                key={marker.marker_id}
                position={{ lat: marker.lat, lng: marker.lng }}
                title={marker.title}
                onClick={() => {
                  map!.panTo({ lat: marker.lat, lng: marker.lng });
                  setActiveLocation(marker as Location);
                }}
              >
                <MarkerPin
                  marker={marker}
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
