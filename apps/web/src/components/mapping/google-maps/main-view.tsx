"use client";
import { Button } from "@/components/ui/button";
// import * as Accordion from "@radix-ui/react-accordion";
import { ArrowLeft } from "lucide-react";
// import CollectionCard from "../collection_card";
import CollectionModal from "@/components/modals/map/create_edit_collection_modal";
import { useMapStore } from "@/components/providers/map-state-provider";
import { ScrollArea } from "@/components/ui/scroll-area";
import ActiveLocation from "../../layouts/map-view/components/active_location";
import CollectionsView from "./collections-view";
import MarkerModal from "@/components/modals/map/create_edit_marker_modal";

const MainView = () => {
  const {
    markers,
    collections,
    activeLocation,
    setActiveLocation,
    map,
    setSearchValue,
    getMarkersForCollection,
    snap,
    setSnap,
  } = useMapStore((store) => store);
  return (
    <>
      <div
        id="content"
        className="mb-4 flex w-full flex-col items-start justify-between"
      >
        {!activeLocation && (
          <>
            {/* <h2 className="text-lg font-bold">{map!.title}</h2> */}
            <div className="inline-flex items-center gap-2">
              {/* <FeedbackModal /> */}
              <CollectionModal />
            </div>
          </>
        )}
        {!activeLocation && collections && (
          <ScrollArea className="w-full flex-grow">
            <div className="p-4">
              {collections?.map((collection) => {
                const mark = getMarkersForCollection(collection.collection_id);
                return (
                  <CollectionsView
                    key={collection.collection_id}
                    collection={collection}
                    markers={mark}
                  />
                );
              })}
            </div>
          </ScrollArea>
        )}

        {activeLocation && (
          <Button
            onClick={() => {
              setActiveLocation(null);
              setSearchValue("");
              setSnap(0.2);
              setActiveLocation(null);
            }}
            variant={"link"}
            className="text-base"
          >
            <ArrowLeft /> Back
          </Button>
        )}
      </div>

      {activeLocation !== null && <ActiveLocation />}

      <MarkerModal />
    </>
  );
};

export default MainView;
