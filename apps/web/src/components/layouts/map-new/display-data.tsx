"use client";
import { useMapStore } from "@/components/providers/map-state-provider";
import { useMap, Marker } from "react-map-gl";
import MarkerPin from "../map/marker_pin";

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
