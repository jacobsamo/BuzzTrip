import { cn } from "@/lib/utils";
import { useState } from "react";
import CollectionModal from "../modals/create_edit_collection_modal";
import { useMapContext } from "../providers/map_provider";
import { Button } from "../ui/button";
import { DrawerHeader } from "../ui/drawer";
import Icon, { IconProps } from "../ui/icon";
import { Tables, TablesInsert } from "database.types";
import { useUser } from "@/lib/getUser";
import { toast } from "sonner";
import { Marker } from "@/lib/types";
import clsx from "clsx";

const AddToCollection = () => {
  const {markers, setMarkers, collections, setCollections, activeLocation, setActiveLocation, map, setAddToCollectionOpen} = useMapContext();
  const [selected, setSelected] = useState<string>('');
  

  const collectionsMarkerCount = collections ? collections.map((collection) => {
    return {
      uid: collection.uid,
      markerCount: markers ? markers.filter(
        (activeLocation) => activeLocation.uid == collection.uid
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
      }

      // Perform your form submission
      // Example: You can use fetch to submit the form data
      const createMarker = fetch(
        '/api/marker/create',
        {
          method: 'POST',
          body: JSON.stringify(marker),
        }
      )

      toast.promise(createMarker, {
        loading: 'Adding to list...',
        success: (res) => {

          console.log("res:", res)
          res.json().then((data: Marker) => {
            console.log("data:", data)
            setMarkers((prev) => [...(prev || []), data]);
            return data
          });

          return 'Added to list';
        },
        error: (err) => {
          console.error(err);
          return 'Something went wrong';
        },
      });
      setAddToCollectionOpen(false);
      // Update collections state
    };

  // const onSubmit = async (data: { selected: string }) => {
  //   if (!data.selected) {
  //     setActiveLocation(null);
  //     return;
  //   }

  //   const newMarker = {
  //     title: activeLocation.title,
  //     description: activeLocation.description,
  //     icon: activeLocation.icon,
  //     lat: activeLocation.latlng.lat,
  //     lng: activeLocation.latlng.lng,
  //     uid: data.selected,
  //   };

  //   const req = await fetch("/api/markers/create", {
  //     method: "POST",
  //     body: JSON.stringify(newMarker as Partial<Marker>),
  //   });

  //   if (req.status == 200) {
  //     const res = await req.json();

  //     setMarker([...markers, res.activeLocation]);
  //     setActiveLocation(null);
  //     setSearchString("");
  //     toast.success("Added to list");
  //   } else {
  //     toast.error("Something went wrong");
  //   }
  // };

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

      <form
        onSubmit={handleSubmit}
        className="my-4 flex flex-col items-start"
      >
        {collections && collections.map((collection, index) => {
          const selectedCollection = collection.uid === selected;

          return (
            <Button
              onClick={() => handleCollectionSelected(collection.uid)}
              key={index}
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
        >
          Done
        </Button>
      </form>
    </div>
  );
};

export default AddToCollection;
