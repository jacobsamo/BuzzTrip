"use client";
import { AutocompleteCustomInput } from "@/components/mapping/google-maps/search-new";
import { CreateMapSchema } from "@buzztrip/db/mutations/maps";
import {
  AdvancedMarker,
  APIProvider,
  Map as GoogleMap,
} from "@vis.gl/react-google-maps";
import { env } from "env";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import MarkerPin from "../mapping/google-maps/marker_pin";

const MapLocationForm = () => {
  const [searchValue, setSearchValue] = useState<string | undefined>(undefined);
  const { setValue, getValues } =
    useFormContext<z.infer<typeof CreateMapSchema>>();

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
              setValue("map.lat", details?.location.lat ?? null, {
                shouldDirty: true,
                shouldTouch: true,
              });
              setValue("map.lng", details?.location.lng ?? null, {
                shouldDirty: true,
                shouldTouch: true,
              });
              setValue("map.bounds", details?.bounds.toJSON() ?? null, {
                shouldDirty: true,
                shouldTouch: true,
              });
            }}
          />
        </div>
        {/* Map Preview Container */}
        <div className="h-[200px] w-full rounded-md border bg-muted">
          {/* Map component will be added here */}
          <GoogleMap
            mapId={env.NEXT_PUBLIC_GOOGLE_MAPS_MAPID}
            disableDefaultUI={true}
            gestureHandling="greedy"
            reuseMaps
          >
            {getValues("map.lat") && getValues("map.lng") && (
              <AdvancedMarker
                position={{
                  lat: getValues("map.lat") as number,
                  lng: getValues("map.lng") as number,
                }}
                title="Default Location"
              >
                <MarkerPin size={18} />
              </AdvancedMarker>
            )}
          </GoogleMap>
        </div>
      </div>
    </APIProvider>
  );
};

export default MapLocationForm;
