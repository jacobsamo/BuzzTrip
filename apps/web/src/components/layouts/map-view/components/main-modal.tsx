import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useMemo } from "react";
import { useMapStore } from "../../../providers/map-state-provider";

const MarkerForm = dynamic(() => import("../../../forms/marker-create-edit-form"), {
  ssr: false,
});
const CollectionForm = dynamic(
  () => import("../../../forms/collection-create-edit-form"),
  { ssr: false }
);

const MainModalHeader = () => {
  const activeState = useMapStore((store) => store.activeState);
  if (!activeState) return null;

  switch (activeState.event) {
    case "markers:create":
    case "markers:update":
      return (
        <DialogHeader>
          <DialogTitle>
            <div className="flex flex-row items-center gap-1">
              {activeState.payload.place.photos !== undefined && (
                <Image
                  src={activeState.payload.place.photos?.[0] ?? ""}
                  alt={activeState.payload.title ?? "location"}
                  width={64}
                  height={64}
                  className="h-16 w-16 rounded-md object-cover object-center"
                />
              )}

              <h1 className="w-fit text-wrap text-start text-xl font-bold">
                {activeState.payload.title}
              </h1>
            </div>
          </DialogTitle>
        </DialogHeader>
      );
    case "collections:create":
    case "collections:update":
      return (
        <DialogHeader>
          <DialogTitle>
            {activeState.event === "collections:create" ? "Create" : "Edit"}{" "}
            Collection
          </DialogTitle>
          <DialogDescription>Start your travel plans here</DialogDescription>
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
  const { activeState, setActiveState } = useMapStore((store) => ({
    activeState: store.activeState,
    setActiveState: store.setActiveState,
  }));
  if (!activeState) return null;

  const open = useMemo(() => {
    return (
      activeState.event === "markers:create" ||
      activeState.event === "markers:update" ||
      activeState.event === "collections:create" ||
      activeState.event === "collections:update"
    );
  }, [activeState.event]);

  const setOpen = useCallback(() => {
    setActiveState(null);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <MainModalHeader />
      <MainModalContent />
      <MainModalFooter />
    </Dialog>
  );
}
