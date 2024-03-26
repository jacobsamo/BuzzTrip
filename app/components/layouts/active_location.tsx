"use client";
// import dynamic from "next/dynamic";
import { useState } from "react";
// import AddToCollectionButton from "../Collections/open_add_to_collection";
import { useMapContext } from "../providers/map_provider";
import Icon from "../ui/icon";
import { Plus } from "lucide-react";

// const MarkerCard = dynamic(() => import("../Markers/MarkerCard"));

const ActiveLocation = () => {
  const {markers, setMarkers, collections, setCollections, activeLocation, setActiveLocation} = useMapContext();
  const [snap, setSnap] = useState<number | string | null>("15%");

  if (activeLocation === null) return null;

  return (
    <>
      <div className="flex flex-col pl-3">
        <div className="relative flex w-full flex-row justify-between">
          <span className="flex flex-row gap-2">
            <Icon name="MdOutlineLocationOn" size={24} color="#000" />
            <h1 className="text-2xl text-gray-900">{activeLocation.title}</h1>
          </span>
          <span>
            {/* <AddToCollectionButton /> */}
            <Plus />
          </span>
        </div>
        <p className="text-base text-gray-900">{activeLocation.address}</p>
        <p className="text-base text-gray-900">
          {activeLocation.latlng.lat}, {activeLocation.latlng.lng}
        </p>
        <div className="flex max-h-40 flex-row gap-2 overflow-x-scroll">
          {activeLocation.photos?.slice(0, 5).map((photo) => (
            <>
              <img
                src={photo}
                alt="location photo"
                className="h-40 w-40 rounded-md object-cover object-center"
              />
            </>
          ))}
        </div>
      </div>
    </>
  );
};

export default ActiveLocation;
