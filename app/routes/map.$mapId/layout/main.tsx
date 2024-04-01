import Icon, { IconProps } from "@/components/ui/icon";
import { useMapContext } from "@/routes/map.$mapId/providers/map_provider";
import { lazy } from "react";

const ActiveLocation = lazy(() => import("./active_location"));
const AddToCollection = lazy(() => import("./add_to_collection"));
const CollectionModal = lazy(
  () => import("../modals/create_edit_collection_modal")
);
const MarkerCard = lazy(() => import("../marker_card"));

const Main = () => {
  const { markers, collections, activeLocation, map, addToCollectionOpen } =
    useMapContext();

  return (
    <div className="h-full p-2">
      {activeLocation !== null && !addToCollectionOpen && <ActiveLocation />}

      {addToCollectionOpen && <AddToCollection />}

      {!addToCollectionOpen && !activeLocation && (
        <div className="flex flex-row justify-end mb-4">
          <CollectionModal map_id={map!.uid} />
        </div>
      )}

      {activeLocation === null && (
        <>
          {collections ? (
            <>
              {collections.map((collection) => (
                <div key={collection.uid}>
                  <div className="flex h-fit flex-row items-center gap-2">
                    <Icon
                      name={collection.icon as IconProps["name"]}
                      size={24}
                      color="#000"
                    />
                    <h1>{collection.title}</h1>
                    <CollectionModal
                      mode="edit"
                      collection={collection}
                      map_id={map!.uid}
                    />
                  </div>
                  <ul className="ml-4">
                    {markers &&
                      markers.map((marker) => (
                        <>
                          {marker.collection_id === collection.uid && (
                            <li key={marker.uid}>
                              <MarkerCard marker={marker} />
                            </li>
                          )}
                        </>
                      ))}
                  </ul>
                </div>
              ))}
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
        </>
      )}
    </div>
  );
};

export default Main;
