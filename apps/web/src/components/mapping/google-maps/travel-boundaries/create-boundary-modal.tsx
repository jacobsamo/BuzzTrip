"use client";

import { useMapStore } from "@/components/providers/map-state-provider";
import { api } from "@buzztrip/backend/api";
import { Button } from "@buzztrip/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@buzztrip/ui/components/dialog";
import { Input } from "@buzztrip/ui/components/input";
import { Label } from "@buzztrip/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@buzztrip/ui/components/select";
import { useAction, useQuery } from "convex/react";
import { Loader2, MapPin, Search } from "lucide-react";
import { useState } from "react";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { toast } from "sonner";

interface CreateBoundaryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DURATION_OPTIONS = [
  { value: 15, label: "15 minutes" },
  { value: 30, label: "30 minutes" },
  { value: 45, label: "45 minutes" },
  { value: 60, label: "1 hour" },
  { value: 90, label: "1.5 hours" },
  { value: 120, label: "2 hours" },
  { value: 180, label: "3 hours" },
  { value: 240, label: "4 hours" },
  { value: 360, label: "6 hours" },
  { value: 480, label: "8 hours" },
  { value: 720, label: "12 hours" },
];

export function CreateBoundaryModal({
  open,
  onOpenChange,
}: CreateBoundaryModalProps) {
  const { map } = useMapStore((state) => state);
  const currentUser = useQuery(api.users.currentUser);
  const googleMap = useMap();
  const placesLibrary = useMapsLibrary("places");

  const [searchValue, setSearchValue] = useState("");
  const [selectedPlace, setSelectedPlace] = useState<{
    lat: number;
    lng: number;
    name: string;
  } | null>(null);
  const [duration, setDuration] = useState<number>(30);
  const [title, setTitle] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);
  const [useMapClick, setUseMapClick] = useState(false);

  const calculateAndSave = useAction(
    api.maps.travelBoundaries.calculateAndSaveTravelBoundary
  );

  const handleSearchPlace = async () => {
    if (!placesLibrary || !searchValue) return;

    const service = new placesLibrary.PlacesService(
      document.createElement("div")
    );

    service.textSearch(
      {
        query: searchValue,
      },
      (results, status) => {
        if (status === "OK" && results && results[0]) {
          const place = results[0];
          const location = place.geometry?.location;
          if (location) {
            setSelectedPlace({
              lat: location.lat(),
              lng: location.lng(),
              name: place.name || searchValue,
            });

            // Center map on selected place
            if (googleMap) {
              googleMap.setCenter({ lat: location.lat(), lng: location.lng() });
              googleMap.setZoom(12);
            }
          }
        } else {
          toast.error("Place not found. Please try a different search.");
        }
      }
    );
  };

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (!useMapClick || !e.latLng) return;

    setSelectedPlace({
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
      name: "Custom location",
    });
    setUseMapClick(false);
  };

  const handleCreateBoundary = async () => {
    if (!selectedPlace) {
      toast.error("Please select a center point");
      return;
    }

    if (!currentUser) {
      toast.error("User not authenticated");
      return;
    }

    setIsCalculating(true);

    try {
      await calculateAndSave({
        mapId: map._id,
        centerLat: selectedPlace.lat,
        centerLng: selectedPlace.lng,
        durationMinutes: duration,
        title: title || `${duration} min from ${selectedPlace.name}`,
        userId: currentUser._id,
      });

      toast.success("Travel boundary created successfully");
      onOpenChange(false);

      // Reset form
      setSelectedPlace(null);
      setSearchValue("");
      setTitle("");
      setDuration(30);
    } catch (error) {
      console.error("Error creating boundary:", error);
      toast.error("Failed to create travel boundary");
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Travel Time Boundary</DialogTitle>
          <DialogDescription>
            Show everywhere you can reach within a specified time by car
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search for center point */}
          <div className="space-y-2">
            <Label htmlFor="center">Center Point</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="center"
                  placeholder="Search for a location..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearchPlace();
                    }
                  }}
                  className="pl-8"
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={handleSearchPlace}
                disabled={!searchValue}
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>

            {/* Map click option */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setUseMapClick(true)}
              className="w-full"
            >
              <MapPin className="mr-2 h-4 w-4" />
              Click on map to select location
            </Button>

            {selectedPlace && (
              <p className="text-sm text-muted-foreground">
                Selected: {selectedPlace.name}
              </p>
            )}
          </div>

          {/* Duration selector */}
          <div className="space-y-2">
            <Label htmlFor="duration">Travel Time</Label>
            <Select
              value={duration.toString()}
              onValueChange={(value) => setDuration(parseInt(value))}
            >
              <SelectTrigger id="duration">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                {DURATION_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value.toString()}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Optional title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title (optional)</Label>
            <Input
              id="title"
              placeholder="e.g., Weekend getaway zone"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Cost estimate */}
          <div className="rounded-md bg-muted p-3 text-sm">
            <p className="font-medium">Estimated calculation time: 10-20 seconds</p>
            <p className="text-muted-foreground">
              This will use approximately 24-32 Google Maps API calls (~$0.14)
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isCalculating}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateBoundary}
            disabled={!selectedPlace || isCalculating}
          >
            {isCalculating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Calculating...
              </>
            ) : (
              "Create Boundary"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
