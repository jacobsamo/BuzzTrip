import { useMapStore } from "@/components/providers/map-state-provider";
import { Button } from "@/components/ui/button";
import { CombinedMarker } from "@buzztrip/db/types";
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
  const { setActiveLocation } = useMapStore((store) => store);

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
        <div className="absolute bottom-[-4px] flex h-8 w-8 items-center justify-center rounded-full bg-green-600 shadow-lg transition-transform group-hover:scale-110">
          <MarkerPin color={location.color} icon={location.icon} size={24} />
        </div>

        {/* Tip */}
        {/* <div className="absolute bottom-[-4px] h-3 w-3 rotate-45 bg-green-600"></div> */}

        {/* Info Card */}
        <div className="absolute z-10 bottom-8 left-1/2 -translate-x-1/2 transition-opacity duration-300 group-hover:block">
          <div className="w-[300px] overflow-hidden rounded-lg bg-white shadow-lg">
            {/* Image */}
            <Image
              src={(location?.photos && location?.photos[0]) || ""}
              alt={location.title}
              width={300}
              height={300}
              className="h-40 object-cover object-center"
            />

            {/* Text Content */}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {location.title}
              </h3>
              <p className="text-sm text-gray-600">{location.address}</p>
            </div>

            {/* Close Button */}
            {/* <Button
              className="absolute right-2 top-2 h-8 w-8"
              variant="secondary"
              size="icon"
              onClick={() => setActiveLocation(null)}
            >
              <X className="h-4 w-4" />
            </Button> */}
          </div>
        </div>
      </div>
    </AdvancedMarker>
  );
};

export default DisplayMarkerInfo;
