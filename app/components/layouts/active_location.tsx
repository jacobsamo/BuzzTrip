"use client";
import { activeLocationAtom, collectionsAtom, markersAtom } from "@/lib/atoms";
import { Collection, Marker } from "@/server/db/types";
import { useAtom } from "jotai";
import { Edit, PlusIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Icon from "../ui/Icon";
import { Button } from "../ui/button";
import AddToCollection from "./add_to_collection";
import AddToCollectionButton from "../Collections/open_add_to_collection";
import Image from "next/image";

const MarkerCard = dynamic(() => import("../Markers/MarkerCard"));

const ActiveLocation = () => {
  const [markers, setMarkers] = useAtom(markersAtom);
  const [isOpen, setIsOpen] = useState(false);
  const [snap, setSnap] = useState<number | string | null>("15%");

  const [collections, setCollections] = useAtom(collectionsAtom);
  const [editCollection, setEditCollection] = useState<{
    open: boolean;
    edit: boolean;
    collection: Collection | undefined;
  }>({ open: false, edit: false, collection: undefined });

  // map & the active location
  const [activeLocation, setActiveLocation] = useAtom(activeLocationAtom);

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
            <AddToCollectionButton />
          </span>
        </div>
        <p className="text-base text-gray-900">{activeLocation.address}</p>
        <p className="text-base text-gray-900">
          {activeLocation.latlng.lat()}, {activeLocation.latlng.lng()}
        </p>
        <div className="flex max-h-40 flex-row gap-2 overflow-x-scroll">
          {activeLocation.photos?.slice(0, 5).map((photo) => (
            <>
              <Image
                key={photo.getUrl()}
                src={photo.getUrl()}
                alt={photo.html_attributions[0]}
                width={photo.width}
                height={photo.height}
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
