"use client";
import { Input } from "@/components//ui/input";
// import { activeLocationAtom, searchStringAtom } from "@/lib/atoms";
import { Location } from "@/lib/types";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
// import { useAtom } from "jotai";
import { SearchIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useMapContext } from "./providers/map_provider";

export const PlaceAutocompleteInput = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [placeAutocomplete, setPlaceAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const places = useMapsLibrary("places");
  const map = useMap();
  const {setActiveLocation} = useMapContext();

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const options: google.maps.places.AutocompleteOptions = {
      fields: ["geometry", "name", "formatted_address", "geometry/location"],
    };

    setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
  }, [places]);

  useEffect(() => {
    if (!placeAutocomplete) return;

    const bounds = new google.maps.LatLngBounds();

    placeAutocomplete.addListener("place_changed", () => {
      const place = placeAutocomplete.getPlace();
      if (!place.geometry || !place.geometry.location) {
        console.log("Returned place contains no geometry");
        return;
      }

      const location: Location = {
        id: place.place_id ?? '',
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
        icon: "MdOutlineLocationOn",
        title: place.name
          ? place.name
          : `${place.geometry.location.lat()}, ${place.geometry.location.lng()}`,
        description: place?.html_attributions?.[0] ?? null,
        address: place.formatted_address ?? null,
        photos: place?.photos?.map(photo => photo.getUrl()) ?? null,
        reviews: place?.reviews?.map(review => {
            return {
                author_name: review.author_name,
                author_url: review.author_url ?? null,
                profile_photo_url: review.profile_photo_url,
                rating: review.rating ?? null,
                description: review.text
            };
        }) ?? null,
        rating: place.rating ?? null,
        avg_price: place.price_level ?? null,
        types: place.types ?? null,
        website: place.website ?? null,
        phone: place.formatted_phone_number ?? null,
        opening_times: place.opening_hours?.weekday_text ?? null,
      };


      if (place.geometry.viewport) {
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }

      if (map) map.fitBounds(bounds);

      setActiveLocation(location);
    });
  }, [map, setActiveLocation, placeAutocomplete]);

  return (
    <div className="fixed inset-x-0 top-4 z-10 mx-auto w-[95%] md:w-1/2">
      <div className=" dark:bg-grey flex resize items-center justify-center rounded-xl bg-white p-1 pr-5 dark:text-white">
        <SearchIcon className="h-5 w-5" />
        <Input
          className="mt-2  rounded-full outline-none "
          placeholder="Search maps"
          type="search"
          id="search"
          ref={inputRef}
        />
      </div>
    </div>
  );
};
