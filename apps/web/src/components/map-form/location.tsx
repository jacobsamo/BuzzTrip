"use client";
import { AutocompleteCustomInput } from "@/components/mapping/google-maps/search-new";
import {
  AdvancedMarker,
  APIProvider,
  Map as GoogleMap,
} from "@vis.gl/react-google-maps";
import { env } from "env";
import { useCallback, useMemo, useState } from "react";
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

  // Memoized selection handler
  const handleLocationSelect = useCallback(
    (pred: any, details: any) => {
      const locationName =
        details?.placeDetails.name ??
        details?.placeDetails?.formatted_address ??
        "";

      setSearchValue(locationName);

      // Batch setValue calls to minimize re-renders
      const updates = [
        { name: "lat", value: details?.location.lat ?? null },
        { name: "lng", value: details?.location.lng ?? null },
        { name: "bounds", value: details?.bounds.toJSON() ?? null },
        { name: "location_name", value: locationName || null },
      ] as const;

      updates.forEach(({ name, value }) => {
        setValue(name, value, {
          shouldDirty: true,
          shouldTouch: true,
        });
      });
    },
    [setValue]
  );

  // Memoize the autocomplete props
  const autocompleteProps = useMemo(
    () => ({
      value: searchValue,
      onValueChange: setSearchValue,
      locationTypes: ["(regions)"] as const,
      autoFocus: true,
      classNames: {
        scrollArea: "max-h-20",
        predictions: "max-h-20",
        container: "w-full",
      },
      onSelect: handleLocationSelect,
    }),
    [searchValue, handleLocationSelect]
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
              setValue("lat", details?.location.lat ?? undefined, {
                shouldDirty: true,
                shouldTouch: true,
              });
              setValue("lng", details?.location.lng ?? undefined, {
                shouldDirty: true,
                shouldTouch: true,
              });
              setValue("bounds", details?.bounds.toJSON() ?? undefined, {
                shouldDirty: true,
                shouldTouch: true,
              });
              setValue(
                "location_name",
                details?.placeDetails.name ??
                  details?.placeDetails?.formatted_address ??
                  undefined,
                {
                  shouldDirty: true,
                  shouldTouch: true,
                }
              );
            }}
          />
        </div>

        {/* Map Preview Container */}
        <div>
          <p>
            Map Preview
            {lat && lng && ` of ${lat.toFixed(4)}, ${lng.toFixed(4)}`}
          </p>
          <div className="h-[200px] w-full rounded-lg border bg-muted">
            <GoogleMap
              mapId={env.NEXT_PUBLIC_GOOGLE_MAPS_MAPID}
              disableDefaultUI={true}
              gestureHandling="greedy"
              reuseMaps
              defaultZoom={3}
              defaultCenter={mapCenter}
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
