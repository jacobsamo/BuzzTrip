"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { CombinedMarker } from "@buzztrip/backend/types";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
// import { Command, CommandLoading } from "cmdk";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Id } from "@buzztrip/backend/dataModel";
import { CommandLoading } from "cmdk";
import { X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface DetailsRequestCallbackReturn {
  placeDetails: google.maps.places.PlaceResult;
  location: CombinedMarker;
  bounds: google.maps.LatLngBounds;
}

export const detailsRequestCallback = (
  map: google.maps.Map,
  placeDetails: google.maps.places.PlaceResult | null
): DetailsRequestCallbackReturn | null => {
  if (
    placeDetails == null ||
    !placeDetails.geometry ||
    !placeDetails.geometry.location
  ) {
    console.warn("Returned place contains no geometry");
    return null;
  }

  const bounds = new google.maps.LatLngBounds();

  if (placeDetails.geometry.viewport) {
    bounds.union(placeDetails.geometry.viewport);
    map!.fitBounds(placeDetails.geometry.viewport);
  } else {
    bounds.extend(placeDetails.geometry.location);
    map!.setCenter(placeDetails.geometry.location);
    map!.setZoom(8);
  }

  const location: CombinedMarker = {
    note: undefined,
    color: "#0b7138",
    map_id: "" as Id<"maps">,
    gm_place_id: placeDetails.place_id ?? undefined,
    lat: placeDetails.geometry.location.lat(),
    lng: placeDetails.geometry.location.lng(),
    bounds: bounds.toJSON(),
    icon: "MapPin",
    title: placeDetails.name
      ? placeDetails.name
      : `${placeDetails.geometry.location.lat()}, ${placeDetails.geometry.location.lng()}`,
    description: placeDetails?.html_attributions?.[0] ?? undefined,
    plus_code: placeDetails.plus_code?.global_code ?? undefined,
    address: placeDetails.formatted_address ?? undefined,
    photos: placeDetails?.photos?.map((photo) => photo.getUrl({})) ?? undefined,
    rating: placeDetails.rating ?? 0,
    types: placeDetails.types ?? undefined,
    website: placeDetails.website ?? undefined,
    phone: placeDetails.formatted_phone_number ?? undefined,
  };

  return {
    placeDetails,
    location,
    bounds,
  };
};

export type AutocompleteCustomInputProps = {
  /**
   * The value of the input
   */
  value: string | undefined;
  /**
   * Handle on change event for the AutocompleteCustomInput component
   * @param value {string} - The value of the input
   */
  onValueChange: (value: string) => void;
  /**
   * Handle the onSelect event for the AutocompleteCustomInput component
   * @param prediction {string | google.maps.places.AutocompletePrediction} - The selected prediction
   * @param details {DetailsRequestCallbackReturn} - Details of the selected location
   */
  onSelect?: (
    prediction: google.maps.places.AutocompletePrediction | string | null,
    details: DetailsRequestCallbackReturn | null
  ) => void;
  /**
   * @link
   */
  locationTypes?: string[] | undefined;
  autoFocus?: boolean;
  classNames?: {
    predictions?: string;
    scrollArea?: string;
    container?: string;
  };
};

export const AutocompleteCustomInput = ({
  onSelect,
  locationTypes,
  value,
  onValueChange,
  classNames,
  autoFocus = false,
}: AutocompleteCustomInputProps) => {
  const map = useMap();
  const places = useMapsLibrary("places");
  // https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service#AutocompleteSessionToken
  const [sessionToken, setSessionToken] =
    useState<google.maps.places.AutocompleteSessionToken>();

  // https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service
  const [autocompleteService, setAutocompleteService] =
    useState<google.maps.places.AutocompleteService | null>(null);

  // https://developers.google.com/maps/documentation/javascript/reference/places-service
  const [placesService, setPlacesService] =
    useState<google.maps.places.PlacesService | null>(null);

  const [predictionResults, setPredictionResults] = useState<
    Array<google.maps.places.AutocompletePrediction>
  >([]);

  const [fetchingData, setFetchingData] = useState<boolean>(false);

  useEffect(() => {
    if (!places || !map) return;

    setAutocompleteService(new places.AutocompleteService());
    setPlacesService(new places.PlacesService(map));
    setSessionToken(new places.AutocompleteSessionToken());

    return () => setAutocompleteService(null);
  }, [map, places]);

  useEffect(() => {
    if (value == "") {
      setPredictionResults([]);
    }
  }, [value]);

  const fetchPredictions = useCallback(
    async (value: string) => {
      if (!autocompleteService || !value) {
        return;
      }

      setFetchingData(true);

      const request: google.maps.places.AutocompletionRequest = {
        input: value,
        sessionToken,
        types: locationTypes,
      };
      const response = await autocompleteService.getPlacePredictions(request);

      setPredictionResults(response.predictions);
      setFetchingData(false);
    },

    [autocompleteService, sessionToken, value]
  );

  const onInputChange = useCallback(
    (value: string) => {
      if (typeof value === "string") {
        onValueChange(value);
        fetchPredictions(value);
      }
    },
    [fetchPredictions, onValueChange]
  );

  const onSearchItemSelect = useCallback(
    (prediction: google.maps.places.AutocompletePrediction | string) => {
      if (!places || typeof prediction === "string") return;

      setFetchingData(true);

      const detailRequestOptions: google.maps.places.PlaceDetailsRequest = {
        placeId: prediction.place_id,
        fields: [
          "geometry",
          "name",
          "formatted_address",
          "place_id",
          "photos",
          "rating",
          "price_level",
          "types",
          "website",
          "formatted_phone_number",
          "opening_hours",
          "reviews",
        ],
        sessionToken,
      };

      placesService?.getDetails(detailRequestOptions, (data) => {
        const res = detailsRequestCallback(map!, data);
        if (res) {
          onSelect && onSelect(prediction, res);
          onValueChange(
            res.placeDetails?.name ?? res.placeDetails?.formatted_address ?? ""
          );
          setPredictionResults([]);
          setSessionToken(new places.AutocompleteSessionToken());
        }
        setFetchingData(false);
      });
    },
    [map, places, placesService, sessionToken, onValueChange]
  );

  return (
    <div className="rounded-xlp-1 flex resize items-center justify-center pr-5">
      <Command loop className="h-full w-full">
        <CommandInput
          value={value}
          onValueChange={onInputChange}
          autoFocus={autoFocus}
          // className="w-full"
          placeholder="Search locations"
          id="search"
          after={
            value ? (
              <button
                aria-label="clear search results"
                onClick={() => {
                  onValueChange("");
                  setPredictionResults([]);
                  onSelect && onSelect(null, null);
                }}
              >
                <X className="h-5 w-5" />
              </button>
            ) : (
              <></>
            )
          }
        />

        <CommandList className={cn("relative", classNames?.predictions)}>
          <ScrollArea className={cn("h-[200px]", classNames?.scrollArea)}>
            {fetchingData && <CommandLoading>Loading...</CommandLoading>}
            <CommandGroup className="px-2">
              {predictionResults.length != 0 || !fetchingData ? (
                predictionResults.map((pred) => (
                  <CommandItem
                    key={pred.place_id}
                    value={pred.description}
                    onSelect={() => {
                      onSearchItemSelect(pred);
                    }}
                  >
                    {pred.description}
                  </CommandItem>
                ))
              ) : (
                <CommandEmpty>No place found</CommandEmpty>
              )}
            </CommandGroup>
          </ScrollArea>
        </CommandList>
      </Command>
    </div>
  );
};
