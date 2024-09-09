"use client";
import { Button } from "@/components/ui/button";
// import * as Accordion from "@radix-ui/react-accordion";
import { ArrowLeft } from "lucide-react";
import { lazy } from "react";
import { Drawer } from "vaul";
// import CollectionCard from "../collection_card";
import { useMapStore } from "@/components/providers/map-state-provider";
import { ScrollArea } from "@/components/ui/scroll-area";
import * as Accordion from "@radix-ui/react-accordion";
import ActiveLocation from "./active_location";
import CollectionModal from "@/components/modals/map/create_edit_collection_modal";
import AddToCollection from "./add_to_collection";

export default function MapDrawer() {
  const {
    markers,
    collections,
    activeLocation,
    setActiveLocation,
    map,
    setSearchValue,
    addToCollectionOpen,
    setAddToCollectionOpen,
    snap,
    setSnap,
  } = useMapStore((store) => store);

  return (
    <Drawer.Root
      open
      dismissible={false}
      snapPoints={[0.1, 0.2, 0.5, 0.75, 0.9]}
      activeSnapPoint={snap}
      setActiveSnapPoint={setSnap}
      modal={false}
      fixed={true}
    >
      <Drawer.Content className="fixed inset-0 bottom-0 z-50 mx-auto flex w-full flex-col rounded-t-[10px] border bg-background p-2 pb-6 md:w-3/4">
        <div
          id="handle"
          className="top-0 mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted"
        />
        <div
          id="content"
          className="mb-4 flex flex-row items-center justify-between"
        >
          {!activeLocation && collections && (
            <ScrollArea className="flex h-full flex-col">
              {collections?.map((collection) => (
                <Accordion.Item
                  key={collection.collection_id}
                  value={collection.collection_id}
                >
                  <Accordion.Header>
                    <Accordion.Trigger>{collection.title}</Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Content>
                    <div className="flex flex-col gap-2">
                      {markers &&
                        markers
                          .filter(
                            (marker) =>
                              marker.collection_id === collection.collection_id
                          )
                          .map((marker) => (
                            <div key={marker.marker_id} className="text-sm">
                              {marker.title}
                            </div>
                          ))}
                    </div>
                  </Accordion.Content>
                </Accordion.Item>
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
                <CollectionModal  />
              </div>
            </>
          )}
        </div>

        {activeLocation !== null && !addToCollectionOpen && <ActiveLocation />}

        {addToCollectionOpen && <AddToCollection />}

        {/* {activeLocation === null && (
          <div>
            {collections ? (
              <>
                <Accordion.Root
                  type="multiple"
                  defaultValue={collections.map((col) => col.uid)}
                >
                  {collections.map((collection) => (
                    <CollectionCard
                      key={collection.uid}
                      collection={collection}
                      markers={
                        markers
                          ? markers.filter(
                              (marker) =>
                                marker.collection_id === collection.uid
                            )
                          : null
                      }
                    />
                  ))}
                </Accordion.Root>
              </>
            ) : (
              <>
                <h1>No Collections</h1>
                <p className="text-base text-gray-900">
                  You don&apos;t have any collections yet. Create one to add
                  locations to.
                </p>
              </>
            )}
          </div>
        )} */}
      </Drawer.Content>
    </Drawer.Root>
  );
}
