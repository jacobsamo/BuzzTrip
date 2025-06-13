import { useMapStore } from "@/components/providers/map-state-provider";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { api } from "@buzztrip/backend/api";
import { Id } from "@buzztrip/backend/dataModel";
import { MapTypeId } from "@buzztrip/backend/types";
import { useMap } from "@vis.gl/react-google-maps";
import { useMutation } from "convex/react";
import { Map } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

// TODO: change to use my own images for map style (future)
const mapTypes: { id: MapTypeId; image: string; description: string }[] = [
  {
    id: "hybrid",
    image: "https://maps.gstatic.com/tactile/layerswitcher/ic_satellite-1x.png",
    description:
      "This map type displays a transparent layer of major streets on satellite images",
  },
  {
    id: "roadmap",
    image:
      "https://maps.gstatic.com/tactile/layerswitcher/ic_default_colors2-1x.png",
    description: "This map type displays a normal street map",
  },
  //   { id: "SATELLITE", image: "", description: "This map type displays satellite images" },
  {
    id: "terrain",
    image: "https://maps.gstatic.com/tactile/layerswitcher/ic_terrain-1x.png",
    description:
      "This map type displays maps with physical features such as terrain and vegetation",
  },
];

const ChangeMapStyle = () => {
  const googleMap = useMap();
  const { map, isMobile } = useMapStore((state) => state);
  const updateMap = useMutation(api.maps.index.partialMapUpdate);
  const [open, setOpen] = useState(false);

  if (!googleMap) return null;

  const handleMapTypeChange = (mapType: MapTypeId) => {
    googleMap.setMapTypeId(mapType.toLowerCase());
    updateMap({
      mapId: map._id as Id<"maps">,
      map: {
        mapTypeId: mapType,
      },
    });
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={cn("fixed z-10 right-2", {
            "top-2": isMobile,
            "bottom-2": !isMobile,
          })}
        >
          <Map />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-fit flex flex-col gap-2"
        align="start"
        side={isMobile ? "left" : "bottom"}
      >
        {mapTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => {
              handleMapTypeChange(type.id);
            }}
            className="flex flex-col items-center"
          >
            <Image
              src={type.image}
              alt={type.description}
              width={40}
              height={40}
              className="rounded-md size-10"
            />
            <p className="text-xs text-gray-600">{type.id.toLowerCase()}</p>
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
};

export default ChangeMapStyle;
