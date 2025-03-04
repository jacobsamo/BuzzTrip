"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CombinedMarker } from "@buzztrip/db/types";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { Command } from "cmdk";
import { SearchIcon, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

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
    marker_id: undefined,
    note: null,
    color: null,
    map_id: "",
    gm_place_id: placeDetails.place_id ?? null,
    lat: placeDetails.geometry.location.lat(),
    lng: placeDetails.geometry.location.lng(),
    bounds: bounds.toJSON(),
    icon: "MapPin",
    title: placeDetails.name
      ? placeDetails.name
      : `${placeDetails.geometry.location.lat()}, ${placeDetails.geometry.location.lng()}`,
    description: placeDetails?.html_attributions?.[0] ?? null,
    plus_code: placeDetails.plus_code?.global_code ?? null,
    address: placeDetails.formatted_address ?? null,
    photos: placeDetails?.photos?.map((photo) => photo.getUrl({})) ?? null,
    reviews:
      placeDetails?.reviews?.map((review) => {
        return {
          author_name: review.author_name,
          author_url: review.author_url ?? null,
          profile_photo_url: review.profile_photo_url,
          rating: review.rating ?? null,
          description: review.text,
        };
      }) ?? null,
    rating: placeDetails.rating ?? null,
    avg_price: placeDetails.price_level ?? null,
    types: placeDetails.types ?? null,
    website: placeDetails.website ?? null,
    phone: placeDetails.formatted_phone_number ?? null,
    opening_times: placeDetails.opening_hours?.weekday_text ?? null,
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

    [autocompleteService, sessionToken]
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
      <Command
        loop
        className="flex h-full w-full flex-col overflow-hidden rounded-md"
      >
        <div className="flex items-center justify-center gap-2 px-3">
          <SearchIcon className="mr-2 h-5 w-5 shrink-0" />

          <Command.Input
            className="flex h-10 w-full rounded-md py-2 text-base placeholder:text-slate-500 focus:outline-none dark:placeholder:text-slate-400"
            placeholder="Search locations"
            id="search"
            value={value ?? ""}
            onValueChange={onInputChange}
          />

          {value && (
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
          )}
        </div>

        <Command.List className={cn("relative", classNames?.predictions)}>
          {predictionResults.length === 0 ? (
            <Command.Empty>No place found</Command.Empty>
          ) : (
            <ScrollArea className={cn("h-[200px]", classNames?.scrollArea)}>
              <div className="px-1">
                {!fetchingData &&
                  predictionResults.map((pred) => (
                    <Command.Item
                      key={pred.place_id}
                      value={pred.description}
                      onSelect={() => {
                        onSearchItemSelect(pred);
                      }}
                      className="pointer-events-auto relative cursor-pointer select-all items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-slate-100 aria-selected:text-slate-900 dark:aria-selected:bg-slate-800 dark:aria-selected:text-slate-50"
                    >
                      {pred.description}
                    </Command.Item>
                  ))}
              </div>
            </ScrollArea>
          )}
        </Command.List>
      </Command>
    </div>
  );
};
