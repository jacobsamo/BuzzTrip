"use client";
import {
  APIProvider,
  AdvancedMarker,
  Map as GoogleMap,
  Pin
} from "@vis.gl/react-google-maps";
import React from "react";
import {
  PlaceAutocompleteInput
} from "./search";
import { IconProps } from "@/components/ui/icon";


const Map = () => {


  const mapOptions = {
    center: {
      lat: -25.2744,
      lng: 133.7751,
    },
    zoom: 4,
  };

  return (
    <APIProvider
      apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY! as string}
      region="au"
      language="en"
      libraries={["places", "marker"]}
    >
      <div style={{ height: "100vh", width: "100%" }}>
        <PlaceAutocompleteInput />
        <GoogleMap
          defaultCenter={mapOptions.center}
          defaultZoom={mapOptions.zoom}
          mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAPID!}
          disableDefaultUI={true}
          onDblclick={(e) => console.log("Double click map event: ", e)}
          onClick={(e) => console.log("Click map event: ", e)}
        >
          {/* {activeLocation && (
            <AdvancedMarker
              key={activeLocation.title}
              position={activeLocation.latlng}
            >
              <Pin />
            </AdvancedMarker>
          )}

          {markers.length > 0 &&
            markers &&
            markers.map((marker) => (
              <AdvancedMarker
                key={marker.uid}
                position={{ lat: marker.lat, lng: marker.lng }}
                onClick={(e) => console.log("Marker clicked: ", e)}
              >
                <MarkerPin
                  backgroundColor={marker.color}
                  name={marker.icon as IconProps["name"]}
                  size={16}
                />
              </AdvancedMarker>
            ))} */}
        </GoogleMap>
      </div>
    </APIProvider>
  );
};

export default React.memo(Map);
