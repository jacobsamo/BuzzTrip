"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Map } from "@buzztrip/db/types";
import { MoreVertical } from "lucide-react";
import Link from "next/link";
import EditMapModal from "./modals/edit_map_modal";
import ShareModal from "./modals/share_map_modal";

interface MapCardProps {
  map: Map;
  updateMap?: (map: Partial<Map>) => void;
}

const MapCard = ({ map, updateMap }: MapCardProps) => {
  return (
    <Card key={map.map_id} className="w-full bg-white shadow-md">
      <Link href={`/app/map/${map.map_id}`}>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{map.title}</CardTitle>
            <CardDescription>{map.description}</CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="z-50">
              <DropdownMenuItem onClick={(e) => e.preventDefault()}>
                <ShareModal map_id={map.map_id} />
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => e.preventDefault()}>
                <EditMapModal map={map} updateMap={updateMap} />
              </DropdownMenuItem>
              {/* <DropdownMenuItem onClick={() => handleEditSharing(map.map_id)}>
                <Share2 className="mr-2 h-4 w-4" />
                <span>Edit Sharing</span>
              </DropdownMenuItem> */}
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        {/* <CardContent className="p-0">
          <div className="relative h-48">
            <Image
              src={map.image ?? "/placeholder.png"}
              alt={map.title}
              layout="fill"
              objectFit="cover"
            />
          </div>
        </CardContent> */}
      </Link>
    </Card>
  );
};

export default MapCard;
