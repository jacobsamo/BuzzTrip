import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Map } from "@/lib/types";
import { Link } from "@remix-run/react";
import { Tables } from "database.types";
import { MoreVertical } from "lucide-react";
import MapModal from "./modals/create_edit_map_modal";
import ShareModal from "./modals/share_map_modal";

interface MapCardProps {
  map: Map & Tables<"shared_map">;
}

const MapCard = ({ map }: MapCardProps) => {
  return (
    <div className="relative flex h-32 w-full flex-row justify-between rounded-lg border shadow">
      <Link to={`/map/${map.uid}`} className="inline-flex">
        <img
          src={map.image ?? ""}
          alt={map.title}
          width={100}
          height={112}
          className="w-28 rounded-bl-md rounded-tl-md object-cover object-center"
        />
        <div className="pl-2">
          <h3 className="font-bold">{map.title}</h3>
          <p className="text-sm font-light">
            {new Date(map.created_at).toDateString()}
          </p>
        </div>
      </Link>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="absolute right-0">
            <MoreVertical className="h-6 w-6" />
            <span className="sr-only">More</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="flex flex-col gap-2">
          <MapModal mode="edit" map={map} />
          <ShareModal map_id={map.uid} />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default MapCard;
