import MarkerPin from "@/components/mapping/google-maps/marker_pin";
import { useMapStore } from "@/components/providers/map-state-provider";
import {
  SidebarMenuAction,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { CombinedMarker } from "@buzztrip/backend/types";
import { useMap } from "@vis.gl/react-google-maps";
import { Pencil } from "lucide-react";

interface DisplayMarkerProps {
  marker: CombinedMarker;
}

const DisplayMarker = ({ marker }: DisplayMarkerProps) => {
  const setActiveState = useMapStore((store) => store.setActiveState);
  const map = useMap();

  const onMarkerClick = (marker: CombinedMarker) => {
    if (map) {
      map.panTo({ lat: marker.lat, lng: marker.lng });
      map.moveCamera({ zoom: 15 });
      setActiveState({ event: "activeLocation", payload: marker });
    }
  };

  return (
    <SidebarMenuSubButton
      onClick={() => onMarkerClick(marker)}
      className="flex flex-row items-center justify-start gap-0 py-1"
    >
      <MarkerPin
        color={marker.color}
        icon={marker.icon ?? "MapPin"}
        size={16}
      />
      <span className="wrap ml-2 text-center text-sm">{marker.title}</span>
      <SidebarMenuAction
        onClick={() =>
          setActiveState({ event: "markers:update", payload: marker })
        }
      >
        <Pencil />
      </SidebarMenuAction>
    </SidebarMenuSubButton>
  );
};

export default DisplayMarker;
