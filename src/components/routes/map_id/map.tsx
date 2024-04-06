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
import { useMapContext } from "./providers/map_provider";
import MainDrawer from "./main_drawer";
import Main from "./layout/main";
import env from "env";

const MarkerPin = lazy(() => import("./marker_pin"));

const Map = () => {
  const { activeLocation, markers, setActiveLocation } = useMapContext();

  const mapOptions = {
    center: {
      lat: -25.2744,
      lng: 133.7751,
    },
    zoom: 4,
  };

  return (
    <APIProvider
      apiKey={env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}
      region="au"
      language="en"
      libraries={["places", "marker"]}
    >
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
                key={marker.uid}
                position={{ lat: marker.lat, lng: marker.lng }}
                title={marker.title}
                onClick={() => {
                  // map!.panTo({ lat: marker.lat, lng: marker.lng });
                  setActiveLocation(marker);
                }}
              >
                <MarkerPin marker={marker} size={16} />
              </AdvancedMarker>
            ))}
        </GoogleMap>

        <MainDrawer>
          <Main />
        </MainDrawer>
      </div>
    </APIProvider>
  );
};

export default memo(Map);
