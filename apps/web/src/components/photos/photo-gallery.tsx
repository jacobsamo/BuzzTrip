"use client";

import { Button } from "@buzztrip/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@buzztrip/ui/components/dialog";
import { api } from "@buzztrip/backend/api";
import { Id } from "@buzztrip/backend/dataModel";
import { useQuery, useMutation } from "convex/react";
import { Trash2Icon, UserIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Empty } from "@buzztrip/ui/components/empty";

interface PhotoGalleryProps {
  type: "place" | "marker";
  entityId: Id<"places"> | Id<"markers">;
  currentUserId?: Id<"users">;
  className?: string;
  showUploader?: boolean;
}

export function PhotoGallery({
  type,
  entityId,
  currentUserId,
  className,
}: PhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<{
    url: string;
    caption?: string;
    userName?: string;
  } | null>(null);

  const photos =
    type === "place"
      ? useQuery(api.photos.getPlacePhotos, { place_id: entityId as Id<"places"> })
      : useQuery(api.photos.getMarkerPhotos, { marker_id: entityId as Id<"markers"> });

  const deletePlacePhoto = useMutation(api.photos.deletePlacePhoto);
  const archiveMarkerPhoto = useMutation(api.photos.archiveMarkerPhoto);

  const handleDelete = async (photoId: Id<"place_photos"> | Id<"marker_photos">, userId?: Id<"users">) => {
    try {
      if (type === "place") {
        // For places, only the uploader can delete their own photos
        if (currentUserId !== userId) {
          toast.error("You can only delete your own photos");
          return;
        }
        await deletePlacePhoto({ photo_id: photoId as Id<"place_photos"> });
        toast.success("Photo deleted successfully");
      } else {
        // For markers, anyone can archive (soft delete)
        await archiveMarkerPhoto({ photo_id: photoId as Id<"marker_photos"> });
        toast.success("Photo archived successfully");
      }
    } catch (error) {
      console.error("Error deleting photo:", error);
      toast.error("Failed to delete photo. Please try again.");
    }
  };

  if (!photos) {
    return (
      <div className={cn("grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4", className)}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-muted aspect-square animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <Empty
        icon={UserIcon}
        title="No photos yet"
        description={
          type === "place"
            ? "Be the first to add a photo to this place"
            : "No photos have been added to this marker"
        }
        className={className}
      />
    );
  }

  return (
    <>
      <div className={cn("grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4", className)}>
        {photos.map((photo) => (
          <div key={photo._id} className="group relative">
            <button
              onClick={() =>
                setSelectedPhoto({
                  url: photo.photo_url,
                  caption: photo.caption,
                })
              }
              className="relative aspect-square w-full overflow-hidden rounded-lg transition-all hover:ring-2 hover:ring-primary"
            >
              <Image
                src={photo.photo_url}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                alt={photo.caption || "Photo"}
                className="size-full object-cover"
              />
            </button>
            {currentUserId && (type === "marker" || photo.user_id === currentUserId) && (
              <Button
                size="icon-sm"
                variant="destructive"
                className="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(photo._id, photo.user_id);
                }}
              >
                <Trash2Icon className="size-3" />
              </Button>
            )}
          </div>
        ))}
      </div>

      {/* Photo viewer dialog */}
      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Photo</DialogTitle>
          </DialogHeader>
          {selectedPhoto && (
            <div className="space-y-4">
              <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                <Image
                  src={selectedPhoto.url}
                  fill
                  sizes="(max-width: 1024px) 100vw, 896px"
                  alt={selectedPhoto.caption || "Photo"}
                  className="size-full object-contain"
                />
              </div>
              {selectedPhoto.caption && (
                <p className="text-muted-foreground text-sm">{selectedPhoto.caption}</p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
