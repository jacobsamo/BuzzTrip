"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative h-48">
            <Image
              src={map.image ?? "/placeholder.png"}
              alt={map.title}
              layout="fill"
              objectFit="cover"
            />
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default MapCard;
