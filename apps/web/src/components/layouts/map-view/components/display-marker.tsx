import MarkerPin from "@/components/mapping/google-maps/marker_pin";
import { useMapStore } from "@/components/providers/map-state-provider";
import {
  SidebarMenuAction,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { CombinedMarker } from "@buzztrip/db/types";
import { useMap } from "@vis.gl/react-google-maps";
import { Pencil } from "lucide-react";
import React from "react";

interface DisplayMarkerProps {
  marker: CombinedMarker;
}

const DisplayMarker = ({ marker }: DisplayMarkerProps) => {
  const { setMarkerOpen, setActiveLocation } = useMapStore((store) => store);

  const map = useMap();

  const onMarkerClick = (marker: CombinedMarker) => {
    if (map) {
      map.panTo({ lat: marker.lat, lng: marker.lng });
      map.moveCamera({ zoom: 15 });
      setActiveLocation(marker);
    }
  };

  return (
    <SidebarMenuSubButton
      onClick={() => onMarkerClick(marker)}
      className="flex flex-row items-center justify-start gap-0 py-1"
    >
      <MarkerPin marker={marker} size={16} />
      <span className="wrap ml-2 text-center text-sm">{marker.title}</span>
      <SidebarMenuAction onClick={() => setMarkerOpen(true, marker, "edit")}>
        <Pencil />
      </SidebarMenuAction>
    </SidebarMenuSubButton>
  );
};

export default DisplayMarker;
