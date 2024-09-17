"use client";
import React from "react";
import { useMapStore } from "@/components/providers/map-state-provider";
import { Button } from "@/components/ui/button";
import { Pencil, Plus } from "lucide-react";
import { CombinedMarker } from "@/types";

interface OpenMarkerButtonProps {
  marker: CombinedMarker;
  mode: "create" | "edit";
}

const OpenMarkerButton = ({ marker, mode }: OpenMarkerButtonProps) => {
  const setMarkerOpen = useMapStore((store) => store.setMarkerOpen);

  return (
    <Button variant="ghost" onClick={() => setMarkerOpen(true, marker, mode)}>
      {mode === "create" ? <Plus /> : <Pencil />}
    </Button>
  );
};

export default OpenMarkerButton;
