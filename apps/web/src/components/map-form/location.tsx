"use client";
import { AutocompleteCustomInput } from "@/components/mapping/google-maps/search-new";
import {
  AdvancedMarker,
  APIProvider,
  Map as GoogleMap,
} from "@vis.gl/react-google-maps";
import { env } from "env";
import { useMemo, useState } from "react";
import MarkerPin from "../mapping/google-maps/marker_pin";
import { useMapFormContext } from "./provider";

const MapLocationForm = () => {
  const {
    form: { setValue, watch },
  } = useMapFormContext();
  const lat = watch("lat");
  const lng = watch("lng");
  const bounds = watch("bounds");
  const locationName = watch("location_name");

  const [searchValue, setSearchValue] = useState<string | undefined>(
    locationName
  );

  // Memoize the map center to prevent unnecessary re-renders
  const mapCenter = useMemo(
    () => ({
      lat: lat ?? 12.2891309,
      lng: lng ?? 31.6049679,
    }),
    [lat, lng]
  );

  // Memoize the marker position
  const markerPosition = useMemo(
    () => (lat && lng ? { lat, lng } : null),
    [lat, lng]
  );

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
            // autoFocus={true} // we might want to add autofocus for desktop
            // limit={3}
            classNames={{
              scrollArea: "max-h-20", // Custom height
              predictions: "max-h-20", // Custom max height for predictions
              container: "w-full", // Custom width
            }}
            onSelect={(pred, details) => {
              const locationName =
                details?.placeDetails.name ??
                details?.placeDetails?.formatted_address ??
                "";

              setSearchValue(locationName);

              // Batch setValue calls to minimize re-renders

              setValue("lat", details?.location.lat ?? undefined, {
                shouldDirty: true,
                shouldTouch: true,
              }),
                setValue("lng", details?.location.lng ?? undefined, {
                  shouldDirty: true,
                  shouldTouch: true,
                });
              setValue("bounds", details?.bounds.toJSON() ?? undefined, {
                shouldDirty: true,
                shouldTouch: true,
              });
              setValue("location_name", locationName || undefined, {
                shouldDirty: true,
                shouldTouch: true,
              });
            }}
          />
        </div>

        {/* Map Preview Container */}
        <div>
          <p>
            Map Preview of{" "}
            {locationName
              ? locationName
              : lat && lng && ` of ${lat.toFixed(4)}, ${lng.toFixed(4)}`}
            {/* {} */}
          </p>
          <div className="h-[200px] w-full rounded-lg border bg-muted">
            <GoogleMap
              mapId={env.NEXT_PUBLIC_GOOGLE_MAPS_MAPID}
              disableDefaultUI={true}
              gestureHandling="greedy"
              reuseMaps
              defaultZoom={3}
              defaultCenter={mapCenter}
              defaultBounds={bounds ?? undefined}
            >
              {markerPosition && (
                <AdvancedMarker
                  position={markerPosition}
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
