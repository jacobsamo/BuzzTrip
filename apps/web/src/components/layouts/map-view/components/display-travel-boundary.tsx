"use client";

import { api } from "@buzztrip/backend/api";
import { TravelBoundary } from "@buzztrip/backend/types";
import {
  SidebarMenuAction,
  SidebarMenuSubButton,
} from "@buzztrip/ui/components/sidebar";
import { useMap } from "@vis.gl/react-google-maps";
import { useMutation } from "convex/react";
import { Eye, EyeOff, Timer, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@buzztrip/ui/components/alert-dialog";

interface DisplayTravelBoundaryProps {
  boundary: TravelBoundary;
}

const DisplayTravelBoundary = ({ boundary }: DisplayTravelBoundaryProps) => {
  const map = useMap();
  const toggleVisibility = useMutation(
    api.maps.travelBoundaries.toggleTravelBoundaryVisibility
  );
  const deleteBoundary = useMutation(
    api.maps.travelBoundaries.deleteTravelBoundary
  );

  const handleBoundaryClick = (boundary: TravelBoundary) => {
    if (map) {
      // Pan to the center of the boundary
      map.panTo({ lat: boundary.center_lat, lng: boundary.center_lng });
      map.setZoom(11);
    }
  };

  const handleToggleVisibility = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await toggleVisibility({ boundaryId: boundary._id });
      toast.success(
        boundary.is_visible ? "Boundary hidden" : "Boundary visible"
      );
    } catch (error) {
      console.error("Error toggling visibility:", error);
      toast.error("Failed to toggle visibility");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteBoundary({ boundaryId: boundary._id });
      toast.success("Boundary deleted");
    } catch (error) {
      console.error("Error deleting boundary:", error);
      toast.error("Failed to delete boundary");
    }
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0
      ? `${hours}h ${remainingMinutes}min`
      : `${hours}h`;
  };

  return (
    <SidebarMenuSubButton
      onClick={() => handleBoundaryClick(boundary)}
      className="flex flex-row items-center justify-start gap-2 py-2"
    >
      <Timer className="h-4 w-4 text-blue-600" />
      <div className="flex flex-1 flex-col items-start">
        <span className="text-sm font-medium">
          {boundary.title || "Travel Boundary"}
        </span>
        <span className="text-xs text-muted-foreground">
          {formatDuration(boundary.duration_minutes)} drive
        </span>
      </div>

      {/* Visibility toggle */}
      <SidebarMenuAction onClick={handleToggleVisibility}>
        {boundary.is_visible ? (
          <Eye className="h-4 w-4" />
        ) : (
          <EyeOff className="h-4 w-4" />
        )}
      </SidebarMenuAction>

      {/* Delete button with confirmation */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <SidebarMenuAction
            onClick={(e) => e.stopPropagation()}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </SidebarMenuAction>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Travel Boundary?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete &quot;{boundary.title || "this boundary"}&quot;. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarMenuSubButton>
  );
};

export default DisplayTravelBoundary;
