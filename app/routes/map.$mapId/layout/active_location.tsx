import { useMapContext } from "@/routes/map.$mapId/providers/map_provider";
import { BookmarkCheck } from "lucide-react";
import { lazy } from "react";

const AddToCollectionButton = lazy(() => import('@/routes/map.$mapId/open_add_to_collection'))
const Icon = lazy(() => import("@/components/ui/icon"))

const ActiveLocation = () => {
  const {markers, activeLocation} = useMapContext();

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
            {markers?.find(marker => marker.place_id === activeLocation.place_id) ?   <BookmarkCheck className="w-8 h-8" /> : <AddToCollectionButton />}
          
          </span>
        </div>
        <p className="text-base text-gray-900">{activeLocation.address}</p>
        <p className="text-base text-gray-900">
          {activeLocation.lat}, {activeLocation.lng}
        </p>
        <div className="flex max-h-40 flex-row gap-2 overflow-x-scroll">
          {activeLocation.photos?.map((photo) => (
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
