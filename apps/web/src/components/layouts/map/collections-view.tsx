"use client";
import Icon from "@/components/icon";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Collection, CombinedMarker } from "@/types";
import {
  ChevronDown,
  ChevronRight,
  Edit,
  MapPin,
  MoreVertical,
  Trash,
} from "lucide-react";
import { useState } from "react";
import MarkerPin from "./marker_pin";
import OpenMarkerButton from "./open-marker";

interface CollectionsViewProps {
  collection: Collection;
  markers: CombinedMarker[] | null;
}

/**
 * A view to display a collection with its markers
 */
const CollectionsView = ({ collection, markers }: CollectionsViewProps) => {
  const [open, setOpen] = useState(true);

  return (
    <Collapsible
      key={collection.collection_id}
      open={open}
      onOpenChange={() => setOpen(!open)}
      className="w-full"
    >
      <div className="w- full flex items-center justify-between py-2">
        <CollapsibleTrigger className="flex items-center">
          {open ? (
            <ChevronDown className="mr-1 h-4 w-4" />
          ) : (
            <ChevronRight className="mr-1 h-4 w-4" />
          )}
          <Icon name={collection.icon} />

          <span>{collection.title}</span>
        </CollapsibleTrigger>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem
  
              className="text-destructive"
            >
              <Trash className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <CollapsibleContent className="ml-6 space-y-2">
        {markers &&
          markers.map((marker) => (
            <div
              key={marker.marker_id}
              className="flex items-center justify-between py-1"
            >
              <div className="flex items-center">
                <MarkerPin marker={marker} />
                <span>{marker.title}</span>
              </div>
              <OpenMarkerButton marker={marker} mode="edit" />
              {/* <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <MarkerModal marker={marker} mode="edit" />
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() =>
                      handleDeleteMarker(
                        collection.collection_id,
                        marker.marker_id
                      )
                    }
                    className="text-destructive"
                  >
                    <Trash className="mr-2 h-4 w-4" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu> */}
            </div>
          ))}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default CollectionsView;
