import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Collection, CombinedMarker } from "@buzztrip/db/types";
import { ChevronDown, ChevronRight, Pencil } from "lucide-react";
import MarkerPin from "../../../mapping/google-maps/marker_pin";
import OpenMarkerButton from "../../../mapping/google-maps/open-marker";
import { useMap } from "@vis.gl/react-google-maps";
import { useMapStore } from "@/components/providers/map-state-provider";
import DisplayMarker from "./display-marker";
// import { useMap } from "react-map-gl/mapbox";

interface DisplayCollectionProps {
  collection: Collection;
  markers: CombinedMarker[] | null;
}

const DisplayCollection = ({ collection, markers }: DisplayCollectionProps) => {
  const { setMarkerOpen, setActiveLocation } = useMapStore((store) => store);

  // All for zooming to marker using google maps
  const map = useMap();

  const onMarkerClick = (marker: CombinedMarker) => {
    if (map) {
      map.panTo({ lat: marker.lat, lng: marker.lng });
      map.moveCamera({ zoom: 15 });
      setActiveLocation(marker);
    }
  };

  // For mapbox
  // const {current} = useMap();

  // const onMarkerClick = (marker: CombinedMarker) => {
  //   if (current) {
  //     map.flyTo({ lat: marker.lat, lng: marker.lng });
  //   }
  // };

  return (
    <Collapsible
      key={collection.collection_id}
      defaultOpen={true}
      className="group/collapsible"
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton>
            {collection.title}{" "}
            <ChevronRight className="ml-auto group-data-[state=open]/collapsible:hidden" />
            <ChevronDown className="ml-auto group-data-[state=closed]/collapsible:hidden" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        {markers ? (
          <CollapsibleContent>
            <SidebarMenuSub className="space-y-2">
              {markers.map((marker) => (
                <SidebarMenuSubItem key={marker.marker_id}>
                  <DisplayMarker marker={marker} />
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        ) : null}
      </SidebarMenuItem>
    </Collapsible>
  );
};

export default DisplayCollection;
