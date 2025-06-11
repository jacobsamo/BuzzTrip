"use client";
import { Button } from "@/components/ui/button";
// import * as Accordion from "@radix-ui/react-accordion";
import { ArrowLeft } from "lucide-react";
// import CollectionCard from "../collection_card";
import OpenCollectionModal from "@/components/modals/open-collection-modal";
import { useMapStore } from "@/components/providers/map-state-provider";
import { ScrollArea } from "@/components/ui/scroll-area";
import ActiveLocation from "../../layouts/map-view/components/active_location";
import CollectionsView from "./collections-view";

const MainView = () => {
  const [
    collections,
    activeState,
    setActiveState,
    setSearchValue,
    getMarkersForCollection,
    setDrawerState
  ] = useMapStore((store) => [
    store.collections,
    store.activeState,
    store.setActiveState,
    store.setSearchValue,
    store.getMarkersForCollection,
    store.setDrawerState
  ]);


  return (
    <>
      <div
        id="content"
        className="mb-4 flex w-full flex-col items-start justify-between"
      >
        {!activeState && (
          <>
            {/* <h2 className="text-lg font-bold">{map!.title}</h2> */}
            <div className="inline-flex items-center gap-2">
              {/* <FeedbackModal /> */}
              <OpenCollectionModal />
            </div>
          </>
        )}
        {!activeState && collections && (
          <ScrollArea className="w-full grow">
            <div className="p-4">
              {collections?.map((collection) => {
                const mark = getMarkersForCollection(collection._id);
                return (
                  <CollectionsView
                    key={collection._id}
                    collection={collection}
                    markers={mark}
                  />
                );
              })}
            </div>
          </ScrollArea>
        )}

        {activeState && activeState.event === "activeLocation" && (
          <Button
            onClick={() => {
              setActiveState(null);
              setSearchValue("");
              setDrawerState({snap: 0.2, dismissible: false});
            }}
            variant={"link"}
            className="text-base"
          >
            <ArrowLeft /> Back
          </Button>
        )}
      </div>

      {activeState && activeState.event === "activeLocation" && <ActiveLocation />}
    </>
  );
};

export default MainView;
