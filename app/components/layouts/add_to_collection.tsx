import { PlusIcon } from "lucide-react";
// import EditCollectionDialog from "../Collections/EditCollection";


import { useMapContext } from "../providers/map_provider";
import { DrawerHeader } from "../ui/drawer";

const AddToCollection = () => {
  const {markers, setMarkers, collections, setCollections, activeLocation, setActiveLocation} = useMapContext();


  const collectionsMarkerCount = collections ? collections.map((collection) => {
    return {
      uid: collection.uid,
      markerCount: markers ? markers.filter(
        (activeLocation) => activeLocation.uid == collection.uid
      ).length : 0,
    };
  }) : 0;

  if (activeLocation === null) return null;

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
    <div className="flex flex-col gap-2">
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
        {/* <EditCollectionDialog
          Trigger={
            <>
              <PlusIcon /> New Collection
            </>
          }
        /> */}
      </span>

      {/* <form
        onSubmit={handleSubmit(onSubmit)}
        className="my-4 flex flex-col items-start"
      >
        {collections.map((collection, index) => {
          const selected = watch("selected") == collection.uid;

          return (
            <Button
              onClick={() => setValue("selected", collection.uid)}
              key={index}
              className={cn(
                "group h-fit w-full flex-row items-start justify-start gap-2",
                {
                  "scale-105 border border-gray-500 shadow-lg": selected,
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
                    collectionsMarkerCount.find(
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
          className="absolute bottom-2 mx-auto w-1/2"
          type="submit"
        >
          Done
        </Button>
      </form> */}
    </div>
  );
};

export default AddToCollection;
