import { Link } from "@remix-run/react";
import { MoreVertical, Share, Trash2 } from "lucide-react";
import { MapModal } from "./modals/create_edit_map_modal";
import { Button } from "./ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Tables } from "database.types";

interface MapCardProps {
  map: Tables<"map">;
}

const MapCard = ({ map }: MapCardProps) => {
  return (
    <>
      <Link
        to={`/maps/${map.uid}`}
        className="relative flex h-32 w-full flex-row rounded-lg border bg-card bg-zinc-600 text-card-foreground"
      >
        <img
          src={map.image ?? "/images/banner.jpg"}
          alt={map.title}
          width={100}
          height={112}
          className="w-28 rounded-bl-md rounded-tl-md object-cover object-center"
        />
        <div className="pl-2">
          <h3 className="font-bold">{map.title}</h3>
          <p className="text-sm font-light">{new Date(map?.createdAt).toDateString()}</p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="absolute right-0">
              <MoreVertical className="h-6 w-6" />
              <span className="sr-only">More</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center">
            <DropdownMenuItem>
              <MapModal map={map} />
            </DropdownMenuItem>
            <DropdownMenuItem className="text-normal gap-2 text-sm font-normal">
              <Share /> Share
            </DropdownMenuItem>
            <DropdownMenuItem className="text-normal gap-2 text-sm font-normal">
              <Trash2 /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Link>
    </>
  );
};

export default MapCard;
