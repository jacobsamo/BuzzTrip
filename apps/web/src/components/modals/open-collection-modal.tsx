import { Button } from "@/components/ui/button";
import { Collection } from "@buzztrip/backend/types";
import { Edit2, Plus } from "lucide-react";
import { useMapStore } from "../providers/map-state-provider";

interface CollectionModalProps {
  triggerType?: "icon" | "text";
  mode?: "create" | "edit";
  collection?: Collection | null;
}

export default function OpenCollectionModal({
  triggerType = "text",
  mode = "create",
  collection,
}: CollectionModalProps) {
  const setActiveState = useMapStore((store) => store.setActiveState);

  return (
    <Button
      variant="ghost"
      onClick={() => {
        if (mode === "create") {
          setActiveState({ event: "collections:create", payload: null });
        }
      }}
    >
      {triggerType == "text" && mode == "create" ? (
        <>
          <Plus className="h-6 w-6" /> Create Collection
        </>
      ) : (
        <Edit2 className="h-6 w-6" />
      )}
    </Button>
  );
}
