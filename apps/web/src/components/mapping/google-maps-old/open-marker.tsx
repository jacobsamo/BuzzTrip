"use client";
import { useMapStore } from "@/components/providers/map-state-provider";
import { Button } from "@/components/ui/button";
import { CombinedMarker } from "@buzztrip/backend/types";
import { Pencil, Plus } from "lucide-react";

interface OpenMarkerButtonProps {
  marker: CombinedMarker;
  mode: "create" | "edit";
}

const OpenMarkerButton = ({ marker, mode }: OpenMarkerButtonProps) => {
  const setActiveState = useMapStore((store) => store.setActiveState);

  return (
    <Button variant="ghost" onClick={() => setActiveState({ event: "markers:update", payload: marker })}>
      {mode === "create" ? <Plus /> : <Pencil />}
    </Button>
  );
};

export default OpenMarkerButton;
