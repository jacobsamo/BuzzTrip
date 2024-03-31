import { Button } from "@/components/ui/button";
import { DrawerHeader } from "@/components/ui/drawer";
import Icon, { IconProps } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { INTENTS } from "@/routes/map.$mapId/intents";
import { useMapContext } from "@/routes/map.$mapId/providers/map_provider";
import { useFetcher, useSubmit } from "@remix-run/react";
import { lazy, useState } from "react";
import { toast } from "sonner";
import { useGlobalContext } from "../providers/global_provider";

const CollectionModal = lazy(() => import('../modals/create_edit_collection_modal'))


const AddToCollection = () => {
  const fetcher = useFetcher();
  const submit = useSubmit();
  const {markers, setMarkers, collections, activeLocation, setActiveLocation, map, setAddToCollectionOpen} = useMapContext();
  const {setSnap} = useGlobalContext();
  const [selected, setSelected] = useState<string>('');

  const collectionsMarkerCount = collections ? collections.map((collection) => {
    return {
      uid: collection.uid,
      markerCount: markers ? markers.filter(
        (marker) => marker.collection_id == collection.uid
      ).length : 0,
    };
  }) : 0;

  if (activeLocation === null) return null;
    // Function to handle icon selection
    const handleCollectionSelected = (icon: string) => {
      setSelected(icon);
    };
  
    // Function to handle form submission
    const handleSubmit = (event) => {
      event.preventDefault();
      const marker = {
        ...activeLocation,
        collection_id: selected,
        map_id: map!.uid,
        color: "#ef233c",
        reviews: JSON.stringify(activeLocation.reviews),
        photos: JSON.stringify(activeLocation.photos),
        types: JSON.stringify(activeLocation.types),
        opening_times: JSON.stringify(activeLocation.opening_times),
      }

      if (marker.collection_id === '' || marker.collection_id == null) {
        toast.error("Please select a collection");
        return;
      }

      submit({intent: INTENTS.createMarker, ...marker}, {
        method: "post",
        fetcherKey: `marker`,
        navigate: false,
        unstable_flushSync: true,
        replace: true,
      });

      setAddToCollectionOpen(false);
      setActiveLocation(null);
      setSnap(0.2);
      setMarkers([marker, ...markers]);
      toast.success("Location added to collection");
    };


  return (
    <div className="relative flex flex-col gap-2 h-full">
      <DrawerHeader className="flex flex-row  gap-1">
        {activeLocation.photos !== undefined && (
          <img
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
        <CollectionModal map_id={map!.uid}  />
      </span>

      <fetcher.Form
        method="POST"
        className="my-4 flex flex-col items-start"
        onSubmit={handleSubmit}
      >
        {collections && collections.map((collection, index) => {
          const selectedCollection = collection.uid === selected;

          return (
            <Button
              onClick={() => handleCollectionSelected(collection.uid)}
              key={index}
              // name="collection_id"
              // value={collection.uid}
              className={cn(
                "group h-fit w-full flex-row items-start justify-start gap-2",
                {
                  "scale-105 border border-gray-500 shadow-lg": selectedCollection,
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
                  {
                    typeof collectionsMarkerCount == "object" && collectionsMarkerCount.find(
                      (col) => collection.uid == col.uid
                    )?.markerCount
                  }
                </p>
              </div>
            </Button>
          );
        })}

        <Button
          aria-label="Add to list"
          className="mt-2"
          type="submit"
          // name="intent" 
          // value={INTENTS.createMarker}
        >
          Done
        </Button>
      <Button
        onClick={() => setAddToCollectionOpen(false)}
        className="mt-auto"
        variant="ghost"
        type="button"
      >
        Cancel
      </Button>
      </fetcher.Form>

    </div>
  );
};

export default AddToCollection;
