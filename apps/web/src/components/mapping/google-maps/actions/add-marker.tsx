// a button to add a place anywhere on the map
import { useMapStore } from "@/components/providers/map-state-provider";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useMap } from "@vis.gl/react-google-maps";
import { MapPin } from "lucide-react";
import { useHotkeys } from "react-hotkeys-hook";

const AddMarkerButton = () => {
  const { activeState, setActiveState, isMobile, searchValue } = useMapStore(
    (state) => state
  );
  const googleMap = useMap();

  const handleClose = () => {
    if (!googleMap) return;
    googleMap.setOptions({ draggableCursor: "" });
    setActiveState(null);
  };

  useHotkeys("esc", () => handleClose(), {
    enabled: activeState?.event === "add-marker",
  });

  return (
    <Tooltip delayDuration={1000}>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={cn("fixed z-50", {
            "right-2 top-2": isMobile,
            "top-[68px] left-[360px]": !isMobile,
            "scale-105 border border-black shadow-lg bg-gray-300":
              activeState?.event === "add-marker",
            "z-0": searchValue && !isMobile,
          })}
          onClick={() => {
            if (!googleMap) return;
            if (activeState?.event === "add-marker") {
              handleClose();
              return;
            }
            googleMap.setOptions({ draggableCursor: "crosshair" });
            setActiveState({ event: "add-marker", payload: null });
          }}
        >
          <MapPin />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p>Add Marker</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default AddMarkerButton;
