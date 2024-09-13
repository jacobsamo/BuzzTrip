"use client";
import { Button } from "@/components/ui/button";
// import * as Accordion from "@radix-ui/react-accordion";
import { ArrowLeft } from "lucide-react";
// import CollectionCard from "../collection_card";
import CollectionModal from "@/components/modals/map/create_edit_collection_modal";
import { useMapStore } from "@/components/providers/map-state-provider";
import { ScrollArea } from "@/components/ui/scroll-area";
import ActiveLocation from "../active_location";
import AddToCollection from "../add_to_collection";
import CollectionsView from "../collections-view";

const MapSideBar = () => {
  const {
    markers,
    collections,
    activeLocation,
    setActiveLocation,
    map,
    setSearchValue,
    addToCollectionOpen,
    setAddToCollectionOpen,
    getMarkersForCollection,
    snap,
    setSnap,
  } = useMapStore((store) => store);
  return (
    <div className="h-vh w-96 bg-gray-500">
      {!activeLocation && collections && (
        <ScrollArea className="flex h-full flex-col">
          {collections?.map((collection) => (
            <CollectionsView
              key={collection.collection_id}
              collection={collection}
              markers={getMarkersForCollection(collection.collection_id)}
            />
          ))}
        </ScrollArea>
      )}

      {(activeLocation || addToCollectionOpen) && (
        <Button
          onClick={() => {
            setActiveLocation(null);
            setSearchValue("");
            if (addToCollectionOpen) {
              setAddToCollectionOpen(false);
            }
            setSnap(0.2);
          }}
          variant={"link"}
          className="text-base"
        >
          <ArrowLeft /> Back
        </Button>
      )}

      {!addToCollectionOpen && !activeLocation && (
        <>
          {/* <h2 className="text-lg font-bold">{map!.title}</h2> */}
          <div className="inline-flex items-center gap-2">
            {/* <FeedbackModal /> */}
            <CollectionModal />
          </div>
        </>
      )}

      {activeLocation !== null && !addToCollectionOpen && <ActiveLocation />}

      {addToCollectionOpen && <AddToCollection />}
    </div>
  );
};

export default MapSideBar;
