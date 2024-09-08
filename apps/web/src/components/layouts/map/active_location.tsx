
import { useMapStore } from "@/components/providers/map-state-provider";
import { BookmarkCheck } from "lucide-react";
import Image from "next/image";
import { lazy } from "react";

// const AddToCollectionButton = lazy(() => import("../open_add_to_collection"));
const Icon = lazy(() => import("@/components/icon"));

const ActiveLocation = () => {
  const { markers, activeLocation } = useMapStore(store => store);

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
            {/* {markers?.find(
              (marker) => marker.gm_place_id === activeLocation.gm_place_id
            ) ? (
              <BookmarkCheck className="h-8 w-8" />
            ) : (
              <AddToCollectionButton />
            )} */}
          </span>
        </div>
        <p className="text-base text-gray-900">{activeLocation.address}</p>
        <p className="text-base text-gray-900">
          {activeLocation.lat}, {activeLocation.lng}
        </p>
        <div className="flex h-44 w-fit flex-row gap-2 overflow-x-auto overflow-y-hidden">
          {activeLocation.photos &&
            activeLocation.photos.map((photo) => (
              // eslint-disable-next-line jsx-a11y/img-redundant-alt
              <Image
                key={photo}
                src={photo}
                width={160}
                height={160}
                alt="location photo"
                className="aspect-square h-40 w-40 rounded-md object-cover object-center"
              />
            ))}
        </div>
      </div>
    </>
  );
};

export default ActiveLocation;
