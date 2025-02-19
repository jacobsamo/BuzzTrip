"use client";
import { useMapStore } from "@/components/providers/map-state-provider";
import { env } from "env";
import { memo, useMemo } from "react";
import { Map, MapProvider, Marker } from "react-map-gl/mapbox";
import MarkerPin from "../google-maps/marker_pin";
import "mapbox-gl/dist/mapbox-gl.css";
import DisplayMapData from "./display-data";

const MapView = () => {
  const {
    activeLocation,
    markers,
    setActiveLocation,
    searchValue,
    setSearchValue,
  } = useMapStore((store) => store);

  const mapOptions = useMemo(() => {
    return {
      center: {
        lat: -25.2744,
        lng: 133.7751,
      },
      zoom: 4,
    };
  }, []);

  return (
    <MapProvider>
      <Map
        initialViewState={{
          latitude: mapOptions.center.lat,
          longitude: mapOptions.center.lng,
          zoom: mapOptions.zoom,
        }}
        reuseMaps
        mapboxAccessToken={env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        style={{ width: "100%", height: "100%" }}
      >
        <DisplayMapData />
      </Map>
    </MapProvider>
  );
};

export default memo(MapView);
