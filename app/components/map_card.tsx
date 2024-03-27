import { Link } from "@remix-run/react";
import { MoreVertical, Share, Trash2 } from "lucide-react";
import MapModal  from "./modals/create_edit_map_modal";
import { Button } from "./ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from '@/components/ui/dialog'

import { Tables } from "database.types";
import { Map } from "@/lib/types";
// import ConfirmDeleteModal from "./modals/comfirm_delete_modal";

interface MapCardProps {
  map: Map & Tables<"shared_map">;
}

const MapCard = ({ map }: MapCardProps) => {
  return (
      <Link
        to={`/map/${map.uid}`}
        className="relative flex h-32 w-full flex-row rounded-lg border bg-card bg-zinc-600 text-card-foreground"
      >
        <img
          src={map.image ?? ""}
          alt={map.title}
          width={100}
          height={112}
          className="w-28 rounded-bl-md rounded-tl-md object-cover object-center"
        />
        <div className="pl-2">
          <h3 className="font-bold">{map.title}</h3>
          <p className="text-sm font-light">{new Date(map.created_at).toDateString()}</p>
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
              <MapModal 
                mode="edit"
                map={map} 
              />
            </DropdownMenuItem>
            {/* <DropdownMenuItem>
              <Share /> Share
            </DropdownMenuItem> */}
            {/* <DropdownMenuItem>
          
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      </Link>
  );
};

export default MapCard;
