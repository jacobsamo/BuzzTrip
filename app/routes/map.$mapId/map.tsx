import {
  APIProvider,
  AdvancedMarker,
  Map as GoogleMap,
  Pin,
  useMap,
} from "@vis.gl/react-google-maps";
import { lazy, memo } from "react";
import { AutocompleteCustomInput } from "./custom-search";
import { useMapContext } from "./providers/map_provider";
import MainDrawer from "./main_drawer";
import Main from "./layout/main";

const MarkerPin = lazy(() => import("./MarkerPin"));

const Map = () => {
  const { activeLocation, markers, env, setActiveLocation } = useMapContext();
  const map = useMap();

  const mapOptions = {
    center: {
      lat: -25.2744,
      lng: 133.7751,
    },
    zoom: 4,
  };

  return (
    <APIProvider
      apiKey={env.GOOGLE_MAPS_API_KEY! as string}
      region="au"
      language="en"
      libraries={["places", "marker"]}
    >
      <AutocompleteCustomInput />
      <GoogleMap
        defaultCenter={mapOptions.center}
        defaultZoom={mapOptions.zoom}
        mapId={env.GOOGLE_MAPS_MAPID!}
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
                map!.panTo({ lat: marker.lat, lng: marker.lng });
                setActiveLocation(marker);
              }}
            >
              <MarkerPin
                // backgroundColor={marker.color}
                name="MdOutlineLocationOn"
                size={16}
              />
            </AdvancedMarker>
          ))}
      </GoogleMap>

      <MainDrawer>
        <Main />
      </MainDrawer>
    </APIProvider>
  );
};

export default memo(Map);
