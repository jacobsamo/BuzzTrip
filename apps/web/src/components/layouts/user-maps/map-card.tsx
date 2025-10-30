"use client";
import EditMapModal from "@/components/modals/edit_map_modal";
import { Button } from "@buzztrip/ui/components/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@buzztrip/ui/components/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@buzztrip/ui/components/dropdown-menu";
import { UserMap } from "@buzztrip/backend/types";
import { formatDistanceToNow } from "date-fns";
import { Calendar, Copy, Edit2, MapIcon, MoreVertical, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@buzztrip/backend/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface MapCardProps {
  map: UserMap;
}

const MapCard = ({ map }: MapCardProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);
  const mapImage = map.image || "/placeholder.svg?height=200&width=400";
  const mapColor = map.color || "#2C7772";
  const router = useRouter();
  const duplicateMap = useMutation(api.maps.index.duplicateMap);

  const handleDuplicate = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDuplicating(true);
    try {
      const newMapId = await duplicateMap({ mapId: map.map_id });
      toast.success("Map duplicated successfully!");
      router.push(`/app/map/${newMapId}`);
    } catch (error) {
      console.error("Failed to duplicate map:", error);
      toast.error("Failed to duplicate map. Please try again.");
    } finally {
      setIsDuplicating(false);
    }
  };

  return (
    <>
      <Card className="overflow-hidden hover:shadow-md transition-shadow py-0 gap-2">
        <Link href={`/app/map/${map.map_id}`}>
          <div className="relative h-40 w-full bg-muted">
            {map.image ? (
              <Image
                src={mapImage || "/placeholder.svg"}
                alt={map.title}
                width={400}
                height={200}
                fill
                className="object-cover"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ backgroundColor: mapColor }}
              >
                <MapIcon className="h-12 w-12 text-white" />
              </div>
            )}
          </div>

          <CardHeader className="px-4">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg truncate">{map.title}</CardTitle>
              {(map.permission === "owner" || map.permission === "editor") && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      variant="ghost"
                      size="icon"
                      disabled={isDuplicating}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsEditModalOpen(true);
                      }}
                    >
                      <Edit2 className="h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleDuplicate}
                      disabled={isDuplicating}
                    >
                      <Copy className="h-4 w-4" />
                      {isDuplicating ? "Duplicating..." : "Duplicate"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </CardHeader>

          <CardContent className="px-4 pt-0">
            {map.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {map.description}
              </p>
            )}
          </CardContent>

          <CardFooter className="px-4 pb-4 pt-0 text-xs text-muted-foreground">
            <div className="flex items-center gap-4 w-full">
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                <span>
                  {formatDistanceToNow(
                    new Date(map.updatedAt || map._creationTime),
                    {
                      addSuffix: true,
                    }
                  )}
                </span>
              </div>
              <div className="flex items-center">
                <User className="h-3 w-3 mr-1" />
                <span>{map.permission || "Owner"}</span>
              </div>
            </div>
          </CardFooter>
        </Link>
      </Card>
      <EditMapModal
        map={{
          _id: map.map_id,
          title: map.title,
          description: map.description,
          image: map.image,
          icon: map.icon,
          color: map.color,
          owner_id: map.owner_id,
          location_name: map.location_name,
          lat: map.lat,
          lng: map.lng,
          bounds: map.bounds,
          visibility: map.visibility,
          updatedAt: map.updatedAt,
          _creationTime: map._creationTime,
        }}
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
      />
    </>
  );
};

export default MapCard;
