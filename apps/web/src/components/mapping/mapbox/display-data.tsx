"use client";
import { useMapStore } from "@/components/providers/map-state-provider";
import { Marker, useMap } from "react-map-gl/mapbox";
import MarkerPin from "../google-maps/marker_pin";

const DisplayMapData = () => {
  const { current: map } = useMap();
  const {
    activeLocation,
    markers,
    setActiveLocation,
    searchValue,
    setSearchValue,
  } = useMapStore((store) => store);

  return (
    <>
      {markers &&
        markers &&
        markers.map((marker) => (
          <Marker
            key={marker.marker_id}
            latitude={marker.lat}
            longitude={marker.lng}
            onClick={() => {
              map!.flyTo({ center: [marker.lat, marker.lng] });
              setActiveLocation(marker);
            }}
          >
            <MarkerPin marker={marker} size={16} />
          </Marker>
        ))}
    </>
  );
};

export default DisplayMapData;
