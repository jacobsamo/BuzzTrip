"use client";
import { Input } from "@/components//ui/input";
import { activeLocationAtom, searchStringAtom } from "@/lib/atoms";
import { Location } from "@/server/db";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useAtom } from "jotai";
import { SearchIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const PlaceAutocompleteInput = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [, setActiveLocation] = useAtom(activeLocationAtom);
  const [placeAutocomplete, setPlaceAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const places = useMapsLibrary("places");
  const map = useMap();

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
        id: place.place_id,
        latlng: place.geometry.location,
        icon: "MdOutlineLocationOn",
        title: place.name
          ? place.name
          : `${place.geometry.location.lat()}, ${place.geometry.location.lng()}`,
        address: place.formatted_address,
        photos: place.photos,
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
