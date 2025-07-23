import { useMapStore } from "@/components/providers/map-state-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LineSquiggle } from "lucide-react";

export const CreatePathButton = () => {
  const { isMobile, searchValue, uiState, setUiState } = useMapStore(
    (state) => state
  );

  return (
    <Button
      variant="outline"
      size="icon"
      className={cn("fixed z-50", {
        "right-2 top-2": isMobile,
        "top-[68px] left-[360px]": !isMobile,
        "scale-105 border border-black shadow-lg bg-gray-300":
          uiState === "paths",
        "z-0": searchValue && !isMobile,
      })}
      onClick={() => {
        if (uiState === "paths") {
          setUiState("default");
          return;
        }

        setUiState("paths");
      }}
    >
      <LineSquiggle />
    </Button>
  );
};

export const DrawerRectangle = () => {};

export const DrawerCircle = () => {};

export const DrawerPolygon = () => {};

export const DrawerLine = () => {};

