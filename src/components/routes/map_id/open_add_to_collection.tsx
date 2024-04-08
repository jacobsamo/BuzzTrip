import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGlobalContext } from "./providers/global_provider";
import { useMapContext } from "./providers/map_provider";

const AddToCollectionButton = () => {
  const { setAddToCollectionOpen } = useMapContext();
  const { setSnap } = useGlobalContext();

  const openView = () => {
    setAddToCollectionOpen(true);
    setSnap(0.75);
    return;
  };

  return (
    <Button
      aria-label="Add to collection"
      variant="ghost"
      size={"icon"}
      onClick={() => openView()}
      type="button"
    >
      <Plus className="h-8 w-8" />
    </Button>
  );
};

export default AddToCollectionButton;
