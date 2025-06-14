import { useMapStore } from "@/components/providers/map-state-provider";
import { Id } from "@buzztrip/backend/dataModel";
import { CombinedMarker } from "@buzztrip/backend/types";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { Command } from "cmdk";
import { SearchIcon, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface DetailsRequestCallbackReturn {
  placeDetails: google.maps.places.PlaceResult;
  location: CombinedMarker;
  bounds: google.maps.LatLngBounds;
}

export const detailsRequestCallback = (
  map: google.maps.Map,
  placeDetails: google.maps.places.PlaceResult | null,
  isMobile: boolean = false
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
    const viewport = placeDetails.geometry.viewport;
    if (isMobile) {
      const offsetViewport = new google.maps.LatLngBounds(
        new google.maps.LatLng(
          viewport.getSouthWest().lat() - 0.3,
          viewport.getSouthWest().lng()
        ),
        viewport.getNorthEast()
      );
      bounds.union(offsetViewport);
      map!.fitBounds(offsetViewport);
    } else {
      bounds.union(viewport);
      map!.fitBounds(viewport);
    }
  } else {
    bounds.extend(placeDetails.geometry.location);
    const center = placeDetails.geometry.location;
    if (isMobile) {
      const offset = new google.maps.LatLng(center.lat() - 0.3, center.lng());
      map!.setCenter(offset);
    } else {
      map!.setCenter(center);
    }
    map!.setZoom(8);
  }

  const title = placeDetails.name
    ? placeDetails.name
    : `${placeDetails.geometry.location.lat()}, ${placeDetails.geometry.location.lng()}`;

  const location: CombinedMarker = {
    color: "#0b7138",
    icon: "MapPin",
    lat: placeDetails.geometry.location.lat(),
    lng: placeDetails.geometry.location.lng(),
    note: undefined,
    title: title,
    map_id: "" as Id<"maps">,
    place: {
      gm_place_id: placeDetails.place_id ?? undefined,
      lat: placeDetails.geometry.location.lat(),
      lng: placeDetails.geometry.location.lng(),
      bounds: bounds.toJSON(),
      icon: "MapPin",
      title: title,
      description: placeDetails?.html_attributions?.[0] ?? undefined,
      plus_code: placeDetails.plus_code?.global_code ?? undefined,
      address: placeDetails.formatted_address ?? undefined,
      photos:
        placeDetails?.photos?.map((photo) => photo.getUrl({})) ?? undefined,
      rating: placeDetails.rating ?? 0,
      types: placeDetails.types ?? undefined,
      website: placeDetails.website ?? undefined,
      phone: placeDetails.formatted_phone_number ?? undefined,
    },
  };

  return {
    placeDetails,
    location,
    bounds,
  };
};

export const AutocompleteCustomInput = () => {
  const map = useMap();
  const places = useMapsLibrary("places");
  const {
    setActiveState,
    setActiveLocation,
    searchValue,
    setSearchValue,
    setSearchActive,
    setDrawerState,
    searchActive,
    isMobile,
  } = useMapStore((state) => state);
  const inputRef = useRef<HTMLInputElement>(null);

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
  const [pendingFocus, setPendingFocus] = useState(false);

  const handleInputInteraction = (e?: React.SyntheticEvent) => {
    if (!searchActive) {
      if (
        isMobile &&
        inputRef.current &&
        document.activeElement === inputRef.current
      ) {
        inputRef.current.blur(); // Prevent keyboard from launching immediately
      }
      setDrawerState({ snap: 0.9, dismissible: true });
      setSearchActive(true);
      setPendingFocus(true);
    } else {
      inputRef.current?.focus({ preventScroll: true });
    }
  };

  useEffect(() => {
    if (pendingFocus && searchActive) {
      const focusAfter = isMobile ? 500 : 150;
      const timeout = setTimeout(() => {
        inputRef.current?.focus({ preventScroll: true });
        setPendingFocus(false);
      }, focusAfter);
      return () => clearTimeout(timeout);
    }
  }, [pendingFocus, searchActive, isMobile]);

  useEffect(() => {
    if (!places || !map) return;

    setAutocompleteService(new places.AutocompleteService());
    setPlacesService(new places.PlacesService(map));
    setSessionToken(new places.AutocompleteSessionToken());

    return () => setAutocompleteService(null);
  }, [map, places]);

  useEffect(() => {
    if (searchValue == "") {
      setPredictionResults([]);
    }
  }, [searchValue]);

  const fetchPredictions = useCallback(
    async (searchValue: string) => {
      if (!autocompleteService || !searchValue) {
        return;
      }

      setFetchingData(true);

      const request = { input: searchValue, sessionToken };
      const response = await autocompleteService.getPlacePredictions(request);

      setPredictionResults(response.predictions);
      setFetchingData(false);
    },

    [autocompleteService, sessionToken]
  );

  const onInputChange = useCallback(
    (value: string) => {
      if (typeof value === "string") {
        setSearchValue(value);
        fetchPredictions(value);
      }
    },
    [fetchPredictions, setSearchValue]
  );

  const onSelect = useCallback(
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
        const res = detailsRequestCallback(map!, data, isMobile);
        if (res) {
          setActiveLocation(res.location);
          setPredictionResults([]);
          setSessionToken(new places.AutocompleteSessionToken());
        }
        setFetchingData(false);
      });
    },
    [map, places, placesService, sessionToken, setActiveState, setSearchValue]
  );

  return (
    <div className="fixed left-0 right-0 top-6 sm:top-4 z-10 mx-auto w-[95%] md:left-[calc(var(--sidebar-width)_+_2rem)] md:right-4 md:mx-0 md:max-w-[30rem]">
      <div className="dark:bg-grey flex resize items-center justify-center rounded-xl bg-white p-1 pr-5 dark:text-white">
        <Command
          loop
          className="flex h-full w-full flex-col overflow-hidden rounded-md bg-white text-slate-950 dark:bg-slate-950 dark:text-slate-50"
        >
          <div className="flex items-center justify-center gap-2 px-3">
            <SearchIcon className="mr-2 h-5 w-5 shrink-0" />

            <Command.Input
              ref={inputRef}
              className="flex h-10 w-full rounded-md bg-white py-2 text-base placeholder:text-slate-500 focus:outline-hidden dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
              placeholder="Search locations"
              id="search"
              value={searchValue ?? ""}
              onValueChange={onInputChange}
              onClick={handleInputInteraction}
              onFocus={handleInputInteraction}
            />

            {(searchValue || searchActive) && (
              <button
                aria-label="clear search results"
                onClick={() => {
                  setActiveLocation(null);
                  setPredictionResults([]);
                }}
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          <Command.List>
            {predictionResults.length != 0 && (
              <Command.Empty>No place found</Command.Empty>
            )}
            {fetchingData == false &&
              predictionResults.length != 0 &&
              predictionResults.map((pred) => (
                <Command.Item
                  key={pred.place_id}
                  value={pred.description}
                  onSelect={() => {
                    onSelect(pred);
                  }}
                  className="pointer-events-auto relative cursor-pointer select-all items-center rounded-sm px-2 py-1.5 text-sm outline-hidden aria-selected:bg-slate-100 aria-selected:text-slate-900 dark:aria-selected:bg-slate-800 dark:aria-selected:text-slate-50"
                >
                  {pred.description}
                </Command.Item>
              ))}
          </Command.List>
        </Command>
      </div>
    </div>
  );
};
