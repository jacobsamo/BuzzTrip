import { useMapStore } from "@/components/providers/map-state-provider";
import { ShowPathIcon } from "@/components/show-path-icon";
import {
  SidebarMenuAction,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { Path } from "@buzztrip/backend/types";
import { useMap } from "@vis.gl/react-google-maps";
import { Pencil } from "lucide-react";

interface DisplayPathProps {
  path: Path;
}

const DisplayPath = ({ path }: DisplayPathProps) => {
  const { setActiveState, setActiveLocation } = useMapStore((store) => store);
  const map = useMap();

  const onpathClick = (path: Path) => {
    if (map) {
      // map.panTo({ lat: path.lat, lng: path.lng });
      // map.moveCamera({ zoom: 15 });
      // setActiveLocation(path);
    }
  };

  return (
    <SidebarMenuSubButton
      onClick={() => onpathClick(path)}
      className="flex flex-row items-center justify-start gap-0 py-1"
    >
      <ShowPathIcon pathType={path.pathType} styles={path.styles} />
      <span className="wrap ml-2 text-center text-sm">{path.title}</span>
      <SidebarMenuAction
        onClick={(e) => {
          e.stopPropagation();
          setActiveState({ event: "paths:update", payload: path });
        }}
      >
        <Pencil />
      </SidebarMenuAction>
    </SidebarMenuSubButton>
  );
};

export default DisplayPath;
