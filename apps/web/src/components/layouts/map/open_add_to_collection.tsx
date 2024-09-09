import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMapStore } from "@/components/providers/map-state-provider";

const AddToCollectionButton = () => {
  const setAddToCollectionOpen = useMapStore(
    (store) => store.setAddToCollectionOpen
  );

  return (
    <Button
      aria-label="Add to collection"
      variant="ghost"
      size={"icon"}
      onClick={() => setAddToCollectionOpen(true)}
      type="button"
    >
      <Plus className="h-8 w-8" />
    </Button>
  );
};

export default AddToCollectionButton;
