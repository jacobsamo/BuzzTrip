"use client";
import { AutocompleteCustomInput } from "@/components/mapping/google-maps/search-new";
import {
  AdvancedMarker,
  APIProvider,
  Map as GoogleMap,
} from "@vis.gl/react-google-maps";
import { env } from "env";
import { useState } from "react";
import MarkerPin from "../mapping/google-maps/marker_pin";
import { useMapFormContext } from "./provider";

const MapLocationForm = () => {
  const {
    form: { setValue, watch },
  } = useMapFormContext();
  const [searchValue, setSearchValue] = useState<string | undefined>(undefined);

  const lat = watch("lat");
  const lng = watch("lng");
  const bounds = watch("bounds");

  return (
    <APIProvider
      apiKey={env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
      libraries={["places", "marker"]}
    >
      <div className="space-y-1">
        <div className="relative">
          <AutocompleteCustomInput
            value={searchValue}
            onValueChange={setSearchValue}
            locationTypes={["(regions)"]}
            autoFocus={true}
            // limit={3}
            classNames={{
              scrollArea: "max-h-20", // Custom height
              predictions: "max-h-20", // Custom max height for predictions
              container: "w-full", // Custom width
            }}
            onSelect={(pred, details) => {
              setSearchValue(
                details?.placeDetails.name ??
                  details?.placeDetails?.formatted_address ??
                  ""
              );
              setValue("lat", details?.location.lat ?? null, {
                shouldDirty: true,
                shouldTouch: true,
              });
              setValue("lng", details?.location.lng ?? null, {
                shouldDirty: true,
                shouldTouch: true,
              });
              setValue("bounds", details?.bounds.toJSON() ?? null, {
                shouldDirty: true,
                shouldTouch: true,
              });
            }}
          />
        </div>
        {/* Map Preview Container */}

        <div>
          <p>Map Preview {lat && lng && `of ${lat}, ${lng}`}</p>
          <div className="h-[200px] w-full rounded-lg border bg-muted">
            <GoogleMap
              mapId={env.NEXT_PUBLIC_GOOGLE_MAPS_MAPID}
              disableDefaultUI={true}
              gestureHandling="greedy"
              reuseMaps
              defaultZoom={3}
              defaultCenter={{
                lat: lat ?? 12.2891309,
                lng: lng ?? 31.6049679,
              }}
            >
              {lat && lng && (
                <AdvancedMarker
                  position={{
                    lat: lat,
                    lng: lng,
                  }}
                  title="Default Location"
                >
                  <MarkerPin size={18} />
                </AdvancedMarker>
              )}
            </GoogleMap>
          </div>
        </div>
      </div>
    </APIProvider>
  );
};

export default MapLocationForm;
