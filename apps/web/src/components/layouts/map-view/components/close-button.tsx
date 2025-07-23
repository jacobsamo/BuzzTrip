import { useMapStore } from "@/components/providers/map-state-provider";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const CloseButton = () => {
  const { setActiveState, setActiveLocation } = useMapStore((store) => store);

  return (
    <Button
      className="absolute z-30 right-4 top-4 size-8 p-0 rounded-md bg-white hover:bg-gray-100 border border-gray-300 shadow"
      variant="secondary"
      size="icon"
      onClick={(e) => {
        e.stopPropagation();
        setActiveState(null);
        setActiveLocation(null);
      }}
      aria-label="Close info box"
    >
      <X className="h-4 w-4" />
    </Button>
  );
};

export default CloseButton;
