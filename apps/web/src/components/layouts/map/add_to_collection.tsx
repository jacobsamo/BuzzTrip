"use client";
import { Button } from "@/components/ui/button";
import { DrawerHeader } from "@/components/ui/drawer";
import Icon, { IconProps } from "@/components/icon";
import { cn } from "@/lib/utils";
import { lazy, useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { useMapStore } from "@/components/providers/map-state-provider";

const CollectionModal = lazy(
  () => import("@/components/modals/map/create_edit_collection_modal")
);

const AddToCollection = () => {
  const {
    setSearchValue,
    markers,
    setMarkers,
    collections,
    activeLocation,
    setActiveLocation,
    map,
    setAddToCollectionOpen,
    setSnap
  } = useMapStore(store => store);

  const [selected, setSelected] = useState<string>("");

  const collectionsMarkerCount = collections
    ? collections.map((collection) => {
        return {
          collection_id: collection.collection_id!,
          markerCount: markers
            ? markers.filter((marker) => marker.collection_id == collection.collection_id)
                .length
            : 0,
        };
      })
    : 0;

  if (activeLocation === null) return null;
  // Function to handle icon selection
  const handleCollectionSelected = (icon: string) => {
    setSelected(icon);
  };

  // Function to handle form submission
  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const marker = {
      ...activeLocation,
      collection_id: selected,
      map_id: map!.map_id,
      color: "#ef233c",
    };

    if (marker.collection_id === "" || marker.collection_id == null) {
      toast.error("Please select a collection");
      return;
    }

    // const create = fetch(`/api/map/${map!.map_id}/marker`, {
    //   method: "POST",
    //   body: JSON.stringify(marker),
    // });

    // toast.promise(create, {
    //   loading: "Creating marker...",
    //   success: (res) => {
    //     if (res.ok) {
    //       res.json().then((val) => {
    //         setMarkers((prev) => [
    //           (val as { data: any })!.data,
    //           ...(prev || []),
    //         ]);
    //         setAddToCollectionOpen(false);
    //         setActiveLocation(null);
    //         setSnap(0.5);
    //         setSearchValue("");
    //       });
    //     }

    //     return "Marker created successfully!";
    //   },
    //   error: "Failed to create marker",
    // });
  };

  return (
    <div className="relative flex h-full flex-col gap-2">
      <DrawerHeader className="flex flex-row  gap-1">
        {activeLocation.photos !== undefined && (
          <Image
            src={activeLocation.photos?.[0] ?? ""}
            alt={activeLocation.title ?? "location"}
            width={64}
            height={64}
            className="h-16 w-16 rounded-md object-cover object-center"
          />
        )}

        <h1 className="w-fit text-wrap text-start text-base font-bold">
          {activeLocation.title}
        </h1>
      </DrawerHeader>

      <span className="flex w-full flex-row justify-between">
        <h2 className="font-bold">Collections</h2>
        <CollectionModal/>
      </span>

      <form
        method="POST"
        className="my-4 flex flex-col items-start"
        onSubmit={handleSubmit}
      >
        {collections &&
          collections.map((collection, index) => {
            const selectedCollection = collection.collection_id === selected;

            return (
              <Button
                onClick={() => handleCollectionSelected(collection.collection_id!)}
                key={index}
                className={cn(
                  "group h-fit w-full flex-row items-start justify-start gap-2",
                  {
                    "scale-105 border border-gray-500 shadow-lg":
                      selectedCollection,
                  }
                )}
                type="button"
                variant="ghost"
              >
                <Icon name={collection.icon as IconProps["name"]} size={32} />
                <div className="flex-col">
                  <h2>{collection.title}</h2>
                  <p>
                    Markers:
                    {typeof collectionsMarkerCount == "object" &&
                      collectionsMarkerCount.find(
                        (col) => collection.collection_id == col.collection_id
                      )?.markerCount}
                  </p>
                </div>
              </Button>
            );
          })}

        <Button
          aria-label="Add to list"
          className="mt-2"
          type="submit"
        >
          Done
        </Button>
        <Button
          onClick={() => {
            setAddToCollectionOpen(false);
            setActiveLocation(null);
          }}
          className="mt-auto"
          variant="ghost"
          type="button"
        >
          Cancel
        </Button>
      </form>
    </div>
  );
};

export default AddToCollection;
