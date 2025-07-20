import { useMapStore } from "@/components/providers/map-state-provider";
import { Button } from "@/components/ui/button";
import { CombinedMarker, IconType } from "@buzztrip/backend/types";
import {
  AdvancedMarker,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import { X } from "lucide-react";
import Image from "next/image";
import MarkerPin from "./marker_pin";

interface DisplayMarkerInfoProps {
  location: CombinedMarker;
}

const DisplayMarkerInfo = ({ location }: DisplayMarkerInfoProps) => {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const setActiveLocation = useMapStore((store) => store.setActiveLocation);

  return (
    <AdvancedMarker
      ref={markerRef}
      key={location.title}
      position={{
        lat: location.lat,
        lng: location.lng,
      }}
      className="relative"
    >
      <div className="group relative flex flex-col items-center">
        {/* Pin */}
        <div className="absolute bottom-[-4px] flex size-8 items-center justify-center rounded-full bg-green-700 shadow-lg z-20">
          <MarkerPin color={location.color} icon={location.icon as IconType} size={28} />
        </div>

        {/* Info Card (always visible) */}
        <div className="absolute z-30 bottom-8 left-1/2 -translate-x-1/2 w-[200px]">
          <div className="relative overflow-hidden rounded-md bg-white shadow-xl border border-gray-200">
            {/* Image */}
            {location?.place.photos && location?.place.photos[0] ? (
              <Image
                src={location.place.photos[0]}
                alt={location.title}
                width={200}
                height={100}
                className="h-[80px] w-full object-cover object-center"
                style={{ minHeight: 60 }}
              />
            ) : (
              <div className="h-[60px] w-full bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                No Image
              </div>
            )}

            {/* Text Content */}
            <div className="p-2">
              <h3 className="text-base font-semibold text-gray-800 truncate">
                {location.title}
              </h3>
              <p className="text-xs text-gray-600 truncate">
                {location.place.address}
              </p>
            </div>

            {/* Close Button */}
            <Button
              className="absolute right-1 top-1 h-6 w-6 p-0 rounded-full bg-white hover:bg-gray-100 border border-gray-300 shadow"
              variant="secondary"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                setActiveLocation(null);
              }}
              aria-label="Close info box"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </AdvancedMarker>
  );
};

export default DisplayMarkerInfo;
