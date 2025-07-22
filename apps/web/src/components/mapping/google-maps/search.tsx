"use client";
import { Command, CommandInputProps } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { Command as CommandPrimitive } from "cmdk";
import { SearchIcon, X } from "lucide-react";
import * as React from "react";
import {
  detailsRequestCallback,
  type DetailsRequestCallbackReturn,
} from "./helpers";

interface SearchContextProps {
  // Input state
  value: string;
  onValueChange: (value: string) => void;

  // Selection handling
  onSelect?: (
    prediction: google.maps.places.AutocompletePrediction | null,
    details: DetailsRequestCallbackReturn | null
  ) => void;

  // Configuration
  locationTypes?: string[];
  isMobile?: boolean;

  // Internal state
  predictions: google.maps.places.AutocompletePrediction[];
  setPredictions: (
    predictions: google.maps.places.AutocompletePrediction[]
  ) => void;
  fetching: boolean;
  setFetching: (fetching: boolean) => void;

  // Google Maps services
  setSessionToken: (token: google.maps.places.AutocompleteSessionToken) => void;
  sessionToken: google.maps.places.AutocompleteSessionToken | null;
  autocompleteService: google.maps.places.AutocompleteService | null;
  placesService: google.maps.places.PlacesService | null;
}

const SearchContext = React.createContext<SearchContextProps | null>(null);

function useSearch() {
  const context = React.useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a Search component");
  }
  return context;
}

// Main Search component
export interface SearchProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  value: string;
  onValueChange: (value: string) => void;
  onSelect?: (
    prediction: google.maps.places.AutocompletePrediction | null,
    details: DetailsRequestCallbackReturn | null
  ) => void;
  locationTypes?: string[];
  isMobile?: boolean;
}

export const Search = React.forwardRef<HTMLDivElement, SearchProps>(
  (
    {
      className,
      value,
      onValueChange,
      onSelect,
      locationTypes,
      isMobile = false,
      children,
      ...props
    },
    ref
  ) => {
    const map = useMap();
    const places = useMapsLibrary("places");

    // Internal state
    const [predictions, setPredictions] = React.useState<
      google.maps.places.AutocompletePrediction[]
    >([]);
    const [fetching, setFetching] = React.useState(false);
    const [sessionToken, setSessionToken] =
      React.useState<google.maps.places.AutocompleteSessionToken | null>(null);
    const [autocompleteService, setAutocompleteService] =
      React.useState<google.maps.places.AutocompleteService | null>(null);
    const [placesService, setPlacesService] =
      React.useState<google.maps.places.PlacesService | null>(null);

    // Initialize Google Maps services
    React.useEffect(() => {
      if (!places || !map) return;

      setAutocompleteService(new places.AutocompleteService());
      setPlacesService(new places.PlacesService(map));
      setSessionToken(new places.AutocompleteSessionToken());

      return () => {
        setAutocompleteService(null);
        setPlacesService(null);
        setSessionToken(null);
      };
    }, [map, places]);

    // Clear predictions when value is empty
    React.useEffect(() => {
      if (!value) {
        setPredictions([]);
      }
    }, [value]);

    const contextValue = React.useMemo<SearchContextProps>(
      () => ({
        value,
        onValueChange,
        onSelect,
        locationTypes,
        isMobile,
        predictions,
        setPredictions,
        fetching,
        setFetching,
        setSessionToken,
        sessionToken,
        autocompleteService,
        placesService,
      }),
      [
        value,
        onValueChange,
        onSelect,
        locationTypes,
        isMobile,
        predictions,
        fetching,
        sessionToken,
        autocompleteService,
        placesService,
      ]
    );

    return (
      <SearchContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(
            "flex items-center justify-center rounded-xl bg-white p-1",
            className
          )}
          {...props}
        >
          <Command loop className="size-full">
            {children}
          </Command>
        </div>
      </SearchContext.Provider>
    );
  }
);

Search.displayName = "Search";

// SearchInput component
export interface SearchInputProps
  extends Omit<CommandInputProps, "value" | "onValueChange"> {
  placeholder?: string;
  showClearButton?: boolean;
  autoFocus?: boolean;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      placeholder = "Search locations",
      showClearButton = true,
      className,
      ...props
    },
    ref
  ) => {
    const {
      value,
      onValueChange,
      onSelect,
      setPredictions,
      setFetching,
      autocompleteService,
      sessionToken,
      locationTypes,
    } = useSearch();

    // Fetch predictions from Google Places API
    const fetchPredictions = React.useCallback(
      async (searchValue: string) => {
        if (!autocompleteService || !sessionToken || !searchValue.trim()) {
          setPredictions([]);
          return;
        }

        setFetching(true);

        try {
          const request: google.maps.places.AutocompletionRequest = {
            input: searchValue,
            sessionToken,
            ...(locationTypes && { types: locationTypes }),
          };

          const response =
            await autocompleteService.getPlacePredictions(request);
          setPredictions(response.predictions || []);
        } catch (error) {
          console.error("Error fetching predictions:", error);
          setPredictions([]);
        } finally {
          setFetching(false);
        }
      },
      [
        autocompleteService,
        sessionToken,
        locationTypes,
        setPredictions,
        setFetching,
      ]
    );

    // Handle input change
    const handleValueChange = React.useCallback(
      (newValue: string) => {
        onValueChange(newValue);
        fetchPredictions(newValue);
      },
      [onValueChange, fetchPredictions]
    );

    // Handle clear button
    const handleClear = React.useCallback(() => {
      onValueChange("");
      setPredictions([]);
      onSelect?.(null, null);
    }, [onValueChange, setPredictions, onSelect]);

    return (
      <div className="flex w-full items-center gap-2 px-3">
        <SearchIcon className="h-4 w-4 shrink-0 opacity-50" />
        <CommandPrimitive.Input
          ref={ref}
          value={value}
          onValueChange={handleValueChange}
          placeholder={placeholder}
          className={cn(
            "flex h-10 w-full rounded-md bg-white py-2 text-base placeholder:text-slate-500 focus:outline-hidden dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300",
            className
          )}
          {...props}
        />
        {showClearButton && value && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={handleClear}
            className="h-4 w-4 shrink-0 opacity-50 hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";

// SearchResults component
export interface SearchResultsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  emptyMessage?: string;
  loadingMessage?: string;
}

export const SearchResults = React.forwardRef<
  HTMLDivElement,
  SearchResultsProps
>(
  (
    {
      className,
      emptyMessage = "No places found",
      loadingMessage = "Searching...",
      ...props
    },
    ref
  ) => {
    const map = useMap();
    const places = useMapsLibrary("places");
    const {
      predictions,
      fetching,
      onSelect,
      onValueChange,
      setPredictions,
      setFetching,
      setSessionToken,
      sessionToken,
      placesService,
      isMobile,
    } = useSearch();

    // Handle prediction selection
    const handleSelect = React.useCallback(
      (prediction: google.maps.places.AutocompletePrediction) => {
        if (!places || !placesService || !sessionToken || !map) return;

        setFetching(true);

        const detailRequestOptions: google.maps.places.PlaceDetailsRequest = {
          placeId: prediction.place_id,
          fields: [
            "geometry",
            "name",
            "formatted_address",
            "place_id",
            "photos",
            "rating",
            "types",
            "website",
            "formatted_phone_number",
          ],
          sessionToken,
        };

        placesService.getDetails(detailRequestOptions, (placeDetails) => {
          const result = detailsRequestCallback(map, placeDetails, isMobile);

          if (result) {
            onSelect?.(prediction, result);
            onValueChange(result.location.title);
            setPredictions([]);

            // Create new session token for next search
            const newSessionToken = new places.AutocompleteSessionToken();
            setSessionToken(newSessionToken);
          }

          setFetching(false);
        });
      },
      [
        places,
        placesService,
        sessionToken,
        map,
        isMobile,
        onSelect,
        onValueChange,
        setPredictions,
        setFetching,
      ]
    );

    if (!predictions.length && !fetching) {
      return null;
    }

    return (
      <CommandPrimitive.List
        ref={ref}
        className={cn("max-h-[200px] overflow-x-auto", className)}
        {...props}
      >
        {fetching && (
          <div className="px-3 py-2 text-sm text-muted-foreground">
            {loadingMessage}
          </div>
        )}

        {!fetching && predictions.length === 0 && (
          <CommandPrimitive.Empty className="px-3 py-2 text-sm text-muted-foreground">
            {emptyMessage}
          </CommandPrimitive.Empty>
        )}

        {!fetching &&
          predictions.map((prediction) => (
            <CommandPrimitive.Item
              key={prediction.place_id}
              value={prediction.description}
              onSelect={() => handleSelect(prediction)}
              className={cn(
                "data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                className
              )}
            >
              <div className="flex flex-col">
                <span className="font-medium">
                  {prediction.structured_formatting.main_text}
                </span>
                <span className="text-xs text-muted-foreground">
                  {prediction.structured_formatting.secondary_text}
                </span>
              </div>
            </CommandPrimitive.Item>
          ))}
      </CommandPrimitive.List>
    );
  }
);

SearchResults.displayName = "SearchResults";

// Export everything
export { useSearch };
