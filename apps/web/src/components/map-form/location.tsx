"use client";
import { AutocompleteCustomInput } from "@/components/mapping/google-maps/search-new";
import { Bounds } from "@buzztrip/db/types";
import { map, mapsEditSchema } from "@buzztrip/db/zod-schemas";
import {
  AdvancedMarker,
  APIProvider,
  Map as GoogleMap,
  Pin,
} from "@vis.gl/react-google-maps";
import { env } from "env";
import { SearchIcon } from "lucide-react";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import MarkerPin from "../mapping/google-maps/marker_pin";

interface MapLocationFormProps {
  form: UseFormReturn<z.infer<typeof mapsEditSchema>>;
}

const MapLocationForm = ({ form }: MapLocationFormProps) => {
  const [searchValue, setSearchValue] = useState<string | undefined>(undefined);
  const { setValue, watch } = form;

  return (
    <APIProvider
      apiKey={env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
      libraries={["places", "marker"]}
    >
      <div className="space-y-4">
        <div className="relative">
          <p>Default location</p>
          <AutocompleteCustomInput
            value={searchValue}
            onValueChange={setSearchValue}
            locationTypes={["(regions)"]}
            // limit={3}
            classNames={{
              scrollArea: "max-h-24", // Custom height
              predictions: "max-h-24", // Custom max height for predictions
              container: "w-full", // Custom width
            }}
            onSelect={(pred, details) => {
              setValue("lat", details?.location.lat ?? null);
              setValue("lng", details?.location.lng ?? null);
              setValue("bounds", details?.bounds ?? null);
            }}
          />
        </div>

        {/* Map Preview Container */}
        <div className="h-[200px] w-full rounded-md border bg-muted">
          {/* Map component will be added here */}
          <GoogleMap
            defaultZoom={4}
            defaultCenter={{ lat: 40.7128, lng: -74.006 }}
            mapId={env.NEXT_PUBLIC_GOOGLE_MAPS_MAPID}
            disableDefaultUI={true}
            gestureHandling="greedy"
            reuseMaps
          >
            {form.getValues("lat") && form.getValues("lng") && (
              <AdvancedMarker
                position={{
                  lat: form.getValues("lat") as number,
                  lng: form.getValues("lng") as number,
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
