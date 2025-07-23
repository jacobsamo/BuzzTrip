"use client";
import { useMapStore } from "@/components/providers/map-state-provider";
import { IconType } from "@buzztrip/backend/types";
import { Marker, useMap } from "react-map-gl/mapbox";
import MarkerPin from "@/components/marker-pin";

const DisplayMapData = () => {
  const { current: map } = useMap();
  const { markers, searchValue, setSearchValue, setActiveLocation } =
    useMapStore((store) => store);

  return (
    <>
      {markers &&
        markers &&
        markers.map((marker) => (
          <Marker
            key={marker._id}
            latitude={marker.lat}
            longitude={marker.lng}
            onClick={() => {
              map!.flyTo({ center: [marker.lat, marker.lng] });
              setActiveLocation(marker);
            }}
          >
            <MarkerPin
              color={marker.color}
              icon={marker.icon as IconType}
              size={16}
            />
          </Marker>
        ))}
    </>
  );
};

export default DisplayMapData;
