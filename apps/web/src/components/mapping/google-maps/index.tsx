"use client";
import MarkerPin from "@/components/marker-pin";
import { useMapStore } from "@/components/providers/map-state-provider";
import { cn } from "@/lib/utils";
import { Id } from "@buzztrip/backend/dataModel";
import { IconType } from "@buzztrip/backend/types";
import {
  AdvancedMarker,
  Map as GoogleMap,
  useMap,
  useMapsLibrary,
  type MapMouseEvent,
} from "@vis.gl/react-google-maps";
import { env } from "env";
import { memo, useEffect, useMemo, useState } from "react";
import AddMarkerButton from "./actions/add-marker";
import ChangeMapStyle from "./actions/change-map-styles";
import DrawingTest from "./drawing";
import { detailsRequestCallback } from "./helpers";
import DisplayMarkerInfo from "./marker-info-box";
import { Search, SearchInput, SearchResults } from "./search";

const GoogleMapsMapView = () => {
  const googleMap = useMap();
  // const drawingManager = useDrawingManager();

  const {
    searchValue,
    setSearchValue,
    activeLocation,
    setActiveLocation,
    markers,
    map,
    isMobile,
    setActiveState,
    uiState,
  } = useMapStore((state) => state);

  if (!map) return null;

  const places = useMapsLibrary("places");
  const routesLibrary = useMapsLibrary("routes");
  const [placesService, setPlacesService] =
    useState<google.maps.places.PlacesService>();
  const [directionsService, setDirectionsService] =
    useState<google.maps.DirectionsService>();
  const [directionsRenderer, setDirectionsRenderer] =
    useState<google.maps.DirectionsRenderer>();
  const [googleRoutes, setGoogleRoutes] = useState<
    google.maps.DirectionsRoute[]
  >([]);
  const [zoom, setZoom] = useState(4); // used to control marker size

  const mapOptions = useMemo(() => {
    return {
      center: {
        lat: map.lat ?? 20,
        lng: map.lng ?? 0,
      },
      bounds: map.bounds ?? {
        north: 75,
        south: -60,
        west: -150,
        east: 150,
      },
      zoom: 4,
    };
  }, []);

  console.log("Google", {
    googleMap,
    map: google.maps.Map,
  });

  // init all services needed on load
  useEffect(() => {
    if (!places || !googleMap) return;

    const service = new places.PlacesService(googleMap);
    setPlacesService(service);
  }, [places, googleMap]);

  // handle window unload
  useEffect(() => {
    if (!googleMap || !map || map.lat || map.lng || map.bounds) return;

    const handlePageUnload = async () => {
      const center = googleMap.getCenter();
      const bounds = googleMap.getBounds();
      if (!center || !bounds) return;

      navigator.sendBeacon(
        `/api/map/${map._id}/update-map-location`,
        JSON.stringify({
          lat: center.lat(),
          lng: center.lng(),
          bounds: bounds.toJSON(),
          location_name: `${center.lat()}, ${center.lng()}`,
        })
      );
    };

    window.addEventListener("beforeunload", handlePageUnload);
    return () => {
      window.removeEventListener("beforeunload", handlePageUnload);
    };
  }, [googleMap, map]);

  const handlePlaceSearch = (placeId: string) => {
    if (!placesService) return;
    const requestOptions: google.maps.places.PlaceDetailsRequest = {
      placeId: placeId,
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
    };

    placesService.getDetails(requestOptions, (data, status) => {
      if (status !== google.maps.places.PlacesServiceStatus.OK || !data) {
        console.error("Error fetching place details:", status);
        return;
      }
      const res = detailsRequestCallback(googleMap!, data, isMobile);
      if (res) {
        const newSearchValue =
          res.placeDetails?.name ?? res.placeDetails?.formatted_address ?? "";

        // Fixed: Use && instead of || to check if BOTH lat AND lng match
        if (
          activeLocation &&
          activeLocation.lat === res.location.lat &&
          activeLocation.lng === res.location.lng
        )
          return;

        setActiveLocation(res.location);
        setSearchValue(newSearchValue);
      }
    });
  };

  const handleClick = async (e: MapMouseEvent) => {
    if (!places || !googleMap || !placesService) return;

    e.domEvent?.stopPropagation();
    e.stop();

    const latLng = e.detail.latLng;
    let placeId = e.detail.placeId;

    if (!latLng) return;

    // add-marker mode
    if (uiState === "add-marker") {
      if (placeId) {
        try {
          handlePlaceSearch(placeId);
        } catch (error) {
          console.error("Error fetching place details:", error);
        }
      } else {
        const payload = activeLocation || {
          title: `${latLng.lat}, ${latLng.lng}`,
          lat: latLng.lat,
          lng: latLng.lng,
          icon: "MapPin",
          color: "#0b7138",
          map_id: map._id as Id<"maps">,
          place: {
            lat: latLng.lat,
            lng: latLng.lng,
            icon: "MapPin",
            title: `${latLng.lat}, ${latLng.lng}`,
            rating: 0,
            bounds: null,
          },
        };

        setActiveState({ event: "markers:create", payload });
        googleMap.setOptions({ draggableCursor: "" });
      }

      return;
    }

    if (!placeId) {
      try {
        const geocoder = new google.maps.Geocoder();
        const response = await new Promise<google.maps.GeocoderResult[] | null>(
          (resolve) => {
            geocoder.geocode({ location: latLng }, (results, status) => {
              if (
                status === google.maps.GeocoderStatus.OK &&
                Array.isArray(results) &&
                results.length > 0
              ) {
                resolve(results);
              } else {
                resolve(null);
              }
            });
          }
        );

        const bestMatch = response?.find((result) => {
          return result.types.includes("locality");
        });

        if (bestMatch && bestMatch.place_id) {
          placeId = bestMatch.place_id;
        }
      } catch (error) {
        console.error("Error during place lookup:", error);
        return;
      }
    }

    if (!placeId) {
      // Nothing found — do nothing
      return;
    }

    try {
      handlePlaceSearch(placeId);
    } catch (error) {
      console.error("Error fetching place details:", error);
    }
  };

  return (
    <div
      className={cn("absolute inset-0 h-screen w-full flex-1 touch-none z-0", {
        "cursor-crosshair": uiState === "add-marker",
      })}
    >
      <GoogleMap
        id="google-map-container"
        defaultCenter={mapOptions.center}
        defaultZoom={mapOptions.zoom}
        defaultBounds={
          mapOptions.bounds &&
          "north" in mapOptions.bounds &&
          "south" in mapOptions.bounds &&
          "east" in mapOptions.bounds &&
          "west" in mapOptions.bounds
            ? mapOptions.bounds
            : undefined
        }
        mapTypeId={map.mapTypeId?.toLowerCase() ?? "hybrid"}
        onZoomChanged={(z) => setZoom(z.detail.zoom)}
        mapId={env.NEXT_PUBLIC_GOOGLE_MAPS_MAPID}
        disableDefaultUI={true}
        onClick={(e) => handleClick(e)}
        gestureHandling="greedy"
        reuseMaps
      >
        <ChangeMapStyle />
        {!isMobile && (
          <div className="fixed left-0 right-0 top-6 sm:top-4 z-10 mx-auto w-[95%] md:left-[calc(var(--sidebar-width)_+_2rem)] md:right-4 md:mx-0 md:max-w-[30rem]">
            <Search
              value={searchValue ?? ""}
              onValueChange={setSearchValue}
              isMobile={isMobile}
              className="flex h-full w-full flex-col overflow-hidden rounded-lg bg-white text-slate-950"
              onSelect={(pred, details) => {
                if (details?.location) setActiveLocation(details.location);
              }}
            >
              <SearchInput
                placeholder="Where do you want to go?"
                autoFocus={false} // Prevent immediate keyboard on mobile
              />
              <SearchResults className="z-50" />
            </Search>
          </div>
        )}
        {uiState !== "paths" && <AddMarkerButton />}
        <DrawingTest />

        {activeLocation && (
          <>
            <DisplayMarkerInfo />
          </>
        )}

        {markers &&
          markers.map((marker) => (
            <AdvancedMarker
              key={marker._id}
              position={{ lat: marker.lat, lng: marker.lng }}
              title={marker.title}
              onClick={() => {
                googleMap!.panTo({ lat: marker.lat, lng: marker.lng });
                setActiveLocation(marker);
              }}
            >
              <MarkerPin
                color={marker.color}
                icon={marker.icon as IconType}
                size={zoom > 8 ? 16 : 8} // Smaller when zoomed out
                showIcon={zoom > 8} // Only show icon when zoomed in
              />
            </AdvancedMarker>
          ))}
      </GoogleMap>
    </div>
  );
};

export default memo(GoogleMapsMapView);
