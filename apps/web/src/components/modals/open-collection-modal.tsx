import { Button } from "@/components/ui/button";
import { Collection } from "@buzztrip/backend/types";
import { Edit, Plus } from "lucide-react";
import { useMapStore } from "../providers/map-state-provider";

interface CollectionModalProps {
  triggerType?: "icon" | "text";
  mode?: "create" | "edit";
  collection?: Collection | null;
}

export default function OpenCollectionModal({
  triggerType,
  mode,
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
        <Edit className="h-6 w-6" />
      )}
    </Button>
  );
}
