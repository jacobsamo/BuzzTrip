"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Map } from "@/types";
import { Edit, MapPin, MoreVertical, Share2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface MapCardProps {
  map: Map;
}

const MapCard = ({ map }: MapCardProps) => {
  const handleShareMap = (mapId: string) => {
    console.log("Sharing map: ", mapId);
  };

  const handleEditMap = (mapId: string) => {
    console.log("Editing map: ", mapId);
  };

  const handleEditSharing = (mapId: string) => {
    console.log("Editing sharing: ", mapId);
  };

  return (
    <Card key={map.map_id} className="bg-white shadow-md w-full">
      <Link href={`/app/map/${map.map_id}`}>
        <CardContent className="p-0">
          <div className="relative h-48">
            <Image
              src={map.image ?? "/placeholder.png"}
              alt={map.title}
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div className="p-4">
            <h2 className="mb-2 text-xl font-semibold">{map.title}</h2>
            <p className="mb-2 text-sm text-gray-600">{map.description}</p>
            <p className="flex items-center text-sm text-gray-500">
              <MapPin className="mr-1 h-4 w-4" /> {map.title}
            </p>
          </div>
        </CardContent>
      </Link>
      <CardFooter className="flex items-center justify-between bg-gray-50 p-4">
        {/* <p className="text-xs text-gray-500">Created on {map.}</p> */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleShareMap(map.map_id)}>
              <Share2 className="mr-2 h-4 w-4" />
              <span>Share</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEditMap(map.map_id)}>
              <Edit className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEditSharing(map.map_id)}>
              <Share2 className="mr-2 h-4 w-4" />
              <span>Edit Sharing</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
};

export default MapCard;
