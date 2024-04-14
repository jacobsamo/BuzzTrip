"use client";
import { Button } from "@/components/ui/button";
import * as Accordion from '@radix-ui/react-accordion';
import { ArrowLeft } from "lucide-react";
import { lazy } from "react";
import { Drawer } from "vaul";
import CollectionCard from "../collection_card";
import { useGlobalContext } from "../providers/global_provider";
import { useMapContext } from "../providers/map_provider";

const ActiveLocation = lazy(() => import("./active_location"));
const AddToCollection = lazy(() => import("./add_to_collection"));
const CollectionModal = lazy(
  () => import("../modals/create_edit_collection_modal")
);
const MarkerCard = lazy(() => import("../marker_card"));

export default function Main() {
  const { snap, setSnap } = useGlobalContext();
  const {
    markers,
    collections,
    activeLocation,
    setActiveLocation,
    setAddToCollectionOpen,
    map,
    addToCollectionOpen,
  } = useMapContext();

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
      <Drawer.Content className="fixed inset-0 bottom-0 z-50 mx-auto flex w-full flex-col overflow-y-auto rounded-t-[10px] border bg-background p-2 pb-6 md:w-3/4">
        <div className="top-0 mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />

        {(activeLocation || addToCollectionOpen) && (
          <Button
            onClick={() => {
              setActiveLocation(null);
              if (addToCollectionOpen) {
                setAddToCollectionOpen(false);
              }
            }}
            variant={"link"}
            className="text-base"
          >
            <ArrowLeft /> Back
          </Button>
        )}

        {activeLocation !== null && !addToCollectionOpen && <ActiveLocation />}

        {addToCollectionOpen && <AddToCollection />}

        {!addToCollectionOpen && !activeLocation && (
          <div
            key="collection-modal"
            className="mb-4 flex flex-row justify-between"
          >
            <h2 className="text-lg font-bold">{map!.title}</h2>
            <CollectionModal map_id={map!.uid} />
          </div>
        )}

        {activeLocation === null && (
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
        )}
      </Drawer.Content>
    </Drawer.Root>
  );
}
