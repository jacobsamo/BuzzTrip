import CollectionForm from "@/components/forms/collection-create-edit-form";
import MarkerForm from "@/components/forms/marker-create-edit-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCallback, useMemo } from "react";
import { useMapStore } from "../../../providers/map-state-provider";

const MainModalHeader = () => {
  const activeState = useMapStore((store) => store.activeState);
  if (!activeState) return null;

  switch (activeState.event) {
    case "collections:create":
    case "collections:update":
      return (
        <DialogHeader>
          <DialogTitle>
            {activeState.event === "collections:create" ? "Create" : "Edit"}{" "}
            Collection
          </DialogTitle>
        </DialogHeader>
      );

    default:
      return null;
  }
};

const MainModalContent = () => {
  const activeState = useMapStore((store) => store.activeState);
  if (!activeState) return null;

  switch (activeState.event) {
    case "markers:create":
    case "markers:update":
      return <MarkerForm />;
    case "collections:create":
    case "collections:update":
      return <CollectionForm />;
    default:
      return null;
  }
};

const MainModalFooter = () => {
  return <></>;
};

export default function MainModal() {
  const { activeState, setActiveState } = useMapStore((state) => state);

  const open = useMemo(() => {
    if (!activeState) return false;
    return (
      activeState.event === "markers:create" ||
      activeState.event === "markers:update" ||
      activeState.event === "collections:create" ||
      activeState.event === "collections:update"
    );
  }, [activeState]);

  const setOpen = useCallback(() => {
    setActiveState(null);
  }, [setActiveState]);

  if (!activeState) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <MainModalHeader />
        <MainModalContent />
        <MainModalFooter />
      </DialogContent>
    </Dialog>
  );
}
