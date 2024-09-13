"use client";
import { Collection, CombinedMarker } from "@/types";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, ChevronDown, Edit, Trash } from "lucide-react";
import Icon from "@/components/icon";
import { Button } from "@/components/ui/button";

interface CollectionsViewProps {
  collection: Collection;
  markers: CombinedMarker[] | null;
}

/**
 * A view to display a collection with its markers
 */
const CollectionsView = ({ collection, markers }: CollectionsViewProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative flex flex-col gap-2">
      <Button variant="ghost" onClick={() => setOpen(!open)}>
        <Icon name={collection.icon} />
        {collection.title}
        <ChevronDown />
        <DropdownMenu>
          <DropdownMenuTrigger>
            <MoreVertical />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Edit />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Trash className="text-red-500" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Button>
      {open && (
        <div className="ml-4 flex flex-col gap-2">
          {markers &&
            markers.map((marker) => (
              <div key={marker.marker_id}>{marker.title}</div>
            ))}
        </div>
      )}
    </div>
  );
};

export default CollectionsView;
