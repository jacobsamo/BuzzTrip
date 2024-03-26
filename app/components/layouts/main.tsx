import { Edit } from "lucide-react";
import { useState } from "react";
import MarkerCard from "../marker_card";
import { useMapContext } from "../providers/map_provider";
import { Button } from "../ui/button";
import Icon from "../ui/icon";
import ActiveLocation from "./active_location";

// const MarkerCard = dynamic(() => import("../Markers/MarkerCard"));

const Main = () => {
  const {markers, setMarkers, collections, setCollections, activeLocation, setActiveLocation} = useMapContext();

  return (
    <div>
        {activeLocation !== null  && <ActiveLocation />}
    {activeLocation === null && (
        <>
        {collections ? (
            <>
              {collections.map((collection) => (
                <div key={collection.uid}>
                  <div className="flex h-fit flex-row items-center gap-2">
                    <Icon name={"MdOutlineFolder"} size={24} color="#000" />
                    <h1>{collection.title}</h1>
                    <Button
                      aria-label="edit collection"
                      onClick={() =>
                        console.log("Edit collection: ", collection.title)
                      }
                      variant="ghost"
                    >
                      <Edit />
                    </Button>
                  </div>
                  <ul className="ml-4">
                    {markers && markers.map((marker) => (
                      <>
                        {marker.uid === collection.uid && (
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
                You don&apos;t have any collections yet. Create one to add locations
                to.
              </p>
            </>
          )}
        
        </>
    )}
      
    </div>
  );
};

export default Main;
