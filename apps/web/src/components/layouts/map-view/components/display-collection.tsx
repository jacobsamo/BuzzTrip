import { useMapStore } from "@/components/providers/map-state-provider";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Collection, CombinedMarker } from "@buzztrip/backend/types";
import { useMap } from "@vis.gl/react-google-maps";
import { ChevronDown, ChevronRight } from "lucide-react";
import DisplayMarker from "./display-marker";
// import { useMap } from "react-map-gl/mapbox";

interface DisplayCollectionProps {
  collection: Collection;
  markers: CombinedMarker[] | null;
}

const DisplayCollection = ({ collection, markers }: DisplayCollectionProps) => {
  const setActiveState = useMapStore((store) => store.setActiveState);

  // All for zooming to marker using google maps
  const map = useMap();

  const onMarkerClick = (marker: CombinedMarker) => {
    if (map) {
      map.panTo({ lat: marker.lat, lng: marker.lng });
      map.moveCamera({ zoom: 15 });
      setActiveState({ event: "activeLocation", payload: marker });
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
      key={collection._id}
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
                <SidebarMenuSubItem key={marker._id}>
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
