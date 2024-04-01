import {
  APIProvider,
  AdvancedMarker,
  Map as GoogleMap,
  Pin
} from "@vis.gl/react-google-maps";
import { lazy, memo } from "react";
import { useMapContext } from "./providers/map_provider";

const PlaceAutocompleteInput = lazy(() => import('./search'))
const MarkerPin = lazy(() => import('./MarkerPin')) 


const Map = () => {
  const {activeLocation, markers, env, setActiveLocation} = useMapContext();

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
      {/*TODO: make it so it fills just the screen not any larger to stop scrolling */}
      <div style={{ height: "100%", width: "100%" }}>
        <PlaceAutocompleteInput />
        <GoogleMap
          defaultCenter={mapOptions.center}
          defaultZoom={mapOptions.zoom}
          mapId={env.GOOGLE_MAPS_MAPID!}
          disableDefaultUI={true}
          onDblclick={(e) => console.log("Double click map event: ", e)}
          onClick={(e) => console.log("Click map event: ", e)}
        >
          {activeLocation && (
            <AdvancedMarker
              key={activeLocation.title}
              position={{
                lat: activeLocation.lat,
                lng: activeLocation.lng
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
                onClick={(e) => setActiveLocation(marker)}
              >
                <MarkerPin
                  // backgroundColor={marker.color}
                  name="MdOutlineLocationOn"
                  size={16}
                />
              </AdvancedMarker>
            ))}
        </GoogleMap>
      </div>
    </APIProvider>
  );
};

export default memo(Map);
