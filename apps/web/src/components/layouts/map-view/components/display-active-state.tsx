"use client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import MarkerModal from "@/components/modals/map/create_edit_marker_modal";
import { useMapStore } from "@/components/providers/map-state-provider";
import ActiveLocation from "./active_location";
import DisplayCollection from "./display-collection";

const DisplayActiveState = () => {
  const {
    activeLocation,
    collections,
    getMarkersForCollection,
    setActiveLocation,
    setSearchValue,
    setSnap,
  } = useMapStore((store) => store);

  return (
    <>
      {!activeLocation && collections && (
        <div className="p-4">
          {collections?.map((collection) => {
            const mark = getMarkersForCollection(collection.collection_id);
            return (
              <DisplayCollection
                key={collection.collection_id}
                collection={collection}
                markers={mark}
              />
            );
          })}
        </div>
      )}

      {activeLocation !== null && <ActiveLocation />}

      <MarkerModal />
    </>
  );
};

export default DisplayActiveState;
