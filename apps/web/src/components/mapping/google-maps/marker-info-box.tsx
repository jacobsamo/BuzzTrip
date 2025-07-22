import { ColorPicker } from "@/components/color-picker";
import { IconPicker } from "@/components/icon-picker";
import { useMapStore } from "@/components/providers/map-state-provider";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { api } from "@buzztrip/backend/api";
import { Id } from "@buzztrip/backend/dataModel";
import { IconType } from "@buzztrip/backend/types";
import {
  AdvancedMarker,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import { useMutation } from "convex/react";
import { Pencil, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useCallback } from "react";
import { toast } from "sonner";
import MarkerPin from "./marker-pin";

const DisplayMarkerInfo = () => {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const { setActiveLocation, setActiveState, activeLocation } = useMapStore(
    (store) => store
  );
  const updateConvexMarker = useMutation(api.maps.markers.editMarker);
  const deleteMarker = useMutation(api.maps.markers.deleteMarker);

  if (!activeLocation) return null;

  // Use useCallback to prevent unnecessary re-renders
  const handleUpdate = useCallback(
    async ({ icon, color }: { icon?: IconType; color?: string }) => {
      if (!icon && !color && activeLocation._id) return;

      try {
        await updateConvexMarker({
          marker_id: activeLocation._id as Id<"markers">,
          mapId: activeLocation.map_id as Id<"maps">,
          marker: {
            ...(icon && { icon }),
            ...(color && { color }),
          },
        });

        // Only update local state after successful mutation
        setActiveLocation({
          ...activeLocation,
          ...(icon && { icon }),
          ...(color && { color }),
        });
      } catch (error) {
        console.error("Failed to update marker:", error);
        toast.error("Failed to update marker");
      }
    },
    [activeLocation, updateConvexMarker, setActiveLocation]
  );

  const handleDelete = useCallback(() => {
    if (!activeLocation._id) return;

    const deletedMarker = deleteMarker({
      markerId: activeLocation._id as Id<"markers">,
    });

    toast.promise(deletedMarker, {
      loading: "Deleting marker...",
      success: () => {
        setActiveLocation(null);
        return "Marker deleted successfully";
      },
      error: "Failed to delete marker",
    });
  }, [activeLocation._id, deleteMarker, setActiveLocation]);

  // Use a stable key that doesn't change when activeLocation properties change
  const stableKey =
    activeLocation._id || `${activeLocation.lat}-${activeLocation.lng}`;

  return (
    <AdvancedMarker
      ref={markerRef}
      key={stableKey} // Use stable key instead of title
      position={{
        lat: activeLocation.lat,
        lng: activeLocation.lng,
      }}
      className="relative"
      onClick={(e) => e.stop()}
    >
      <div
        className="group relative flex flex-col items-center z-50"
        onClick={(e) => e.preventDefault()}
      >
        {/* Pin */}
        <div className="absolute bottom-[-4px] flex size-8 items-center justify-center rounded-full bg-green-700 shadow-lg">
          <MarkerPin
            color={activeLocation.color}
            icon={activeLocation.icon as IconType}
            size={28}
          />
        </div>

        {/* Info Card (always visible) */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[200px]">
          <div className="relative overflow-hidden rounded-md bg-white shadow-xl border border-gray-200">
            {/* Image */}
            {activeLocation?.place.photos && activeLocation?.place.photos[0] ? (
              <Image
                src={activeLocation.place.photos[0]}
                alt={activeLocation.title}
                width={200}
                height={100}
                className="h-[80px] w-full object-cover object-center"
                style={{ minHeight: 60 }}
              />
            ) : (
              <div className="h-[60px] w-full bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                No Image
              </div>
            )}

            {/* Text Content */}
            <div className="p-2">
              <h3 className="text-base font-semibold text-gray-800 truncate">
                {activeLocation.title}
              </h3>
              <p className="text-xs text-gray-600 truncate">
                {activeLocation.place.address}
              </p>

              {activeLocation._id && (
                <TooltipProvider delayDuration={2000}>
                  <div className="inline-flex items-center justify-end gap-2 w-full">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <IconPicker
                          className="size-6"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          value={activeLocation.icon as IconType}
                          onChange={(icon) => handleUpdate({ icon })}
                        />
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        Customize Icon
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <ColorPicker
                          className="size-6"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          value={{
                            hex: activeLocation.color,
                            name: activeLocation.color,
                          }}
                          onChange={(color) =>
                            handleUpdate({ color: color.hex })
                          }
                        />
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        Customize Color
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveState({
                              event: "markers:update",
                              payload: activeLocation,
                            });
                          }}
                          aria-label="Edit Marker"
                        >
                          <Pencil size={24} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">Edit Marker</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-6 hover:text-destructive"
                          onClick={handleDelete}
                          aria-label="Delete Marker"
                        >
                          <Trash2 size={24} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        Delete Marker
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </TooltipProvider>
              )}
            </div>

            {/* Close Button */}
            <Button
              className="absolute right-1 top-1 h-6 w-6 p-0 rounded-full bg-white hover:bg-gray-100 border border-gray-300 shadow"
              variant="secondary"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                setActiveLocation(null);
              }}
              aria-label="Close info box"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </AdvancedMarker>
  );
};

export default DisplayMarkerInfo;
