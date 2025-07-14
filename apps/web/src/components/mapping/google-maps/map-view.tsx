"use client";
import { useMapStore } from "@/components/providers/map-state-provider";
import { cn } from "@/lib/utils";
import { Id } from "@buzztrip/backend/dataModel";
import {
  AdvancedMarker,
  Map as GoogleMap,
  useMap,
  useMapsLibrary,
  type MapMouseEvent,
} from "@vis.gl/react-google-maps";
import { env } from "env";
import { lazy, memo, useEffect, useMemo, useState } from "react";
import AddMarkerButton from "./actions/add-marker";
import ChangeMapStyle from "./actions/change-map-style";
import DisplayMarkerInfo from "./display-marker-info";
import { AutocompleteCustomInput, detailsRequestCallback } from "./search";
const MarkerPin = lazy(() => import("./marker_pin"));

const Mapview = () => {
  const googleMap = useMap();
  const places = useMapsLibrary("places");
  const {
    activeLocation,
    activeState,
    setActiveLocation,
    markers,
    setSearchValue,
    map,
    isMobile,
    setActiveState,
  } = useMapStore((state) => state);

  if (!map) return null;

  const [zoom, setZoom] = useState(4);

  useEffect(() => {
    if (!googleMap) return;
    const listener = googleMap.addListener("zoom_changed", () => {
      setZoom(googleMap.getZoom() ?? 4);
    });
    return () => listener.remove();
  }, [googleMap]);

  // Handle directions for routes
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

  const mapOptions = useMemo(() => {
    return {
      center: {
        lat: map.lat ?? -25.2744,
        lng: map.lng ?? 133.7751,
      },
      bounds: map.bounds ?? null,
      zoom: 4,
    };
  }, []);

  useEffect(() => {
    if (!places || !googleMap) return;

    const service = new places.PlacesService(googleMap);
    setPlacesService(service);
  }, [places, googleMap]);

  // useEffect(() => {
  //   if (!routesLibrary || !routeStops || !routes || !googleMap) return;
  //   setDirectionsService(new routesLibrary.DirectionsService());
  //   setDirectionsRenderer(
  //     new routesLibrary.DirectionsRenderer({ map: googleMap })
  //   );
  // }, [routesLibrary, googleMap]);

  // useEffect(() => {
  //   if (!directionsService || !directionsRenderer || !routeStops || !routes)
  //     return;

  //   routes.forEach((route) => {
  //     const stops = routeStops
  //       .filter((stop) => stop.route_id === route.route_id)
  //       .sort((a, b) => a.stop_order - b.stop_order);
  //     const start = stops[0];
  //     const end = stops[stops.length - 1];
  //     const mid = stops.slice(1, stops.length - 1);

  //     if (!stops || !start || !end) return;

  //     directionsService
  //       .route({
  //         origin: { lat: start.lat, lng: start.lng },
  //         destination: { lat: end.lat, lng: end.lng },
  //         waypoints: mid.map((stop) => ({
  //           location: { lat: stop.lat, lng: stop.lng },
  //           stopover: true,
  //         })),
  //         travelMode: getGoogleMapsTravelMode(route.travel_type),
  //         provideRouteAlternatives: false,
  //       })
  //       .then((response) => {
  //         directionsRenderer.setDirections(response);
  //         setGoogleRoutes(response.routes);
  //       });
  //   });

  //   return () => {
  //     directionsRenderer.setMap(null);
  //     setGoogleRoutes([]);
  //   };
  // }, [directionsService, directionsRenderer, routes, routeStops]);

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

    const inAddMarkerMode = activeState?.event === "add-marker";

    // ========================
    // ADD MARKER MODE
    // ========================
    if (inAddMarkerMode) {
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
        const response = await new Promise<
          google.maps.GeocoderResult[] | null
        >((resolve) => {
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
        });
        
        const bestMatch = response?.find(result => {
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
        "cursor-crosshair": activeState?.event === "add-marker",
      })}
    >
      {!isMobile && <AutocompleteCustomInput />}
      <ChangeMapStyle />
      <AddMarkerButton />
      <GoogleMap
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
        mapId={env.NEXT_PUBLIC_GOOGLE_MAPS_MAPID}
        disableDefaultUI={true}
        onClick={(e) => handleClick(e)}
        gestureHandling="greedy"
        reuseMaps
      >
        {activeLocation && (
          // !markers?.some(
          //   (marker) =>
          //     marker.lat === activeLocation.lat &&
          //     marker.lng === activeLocation.lng
          // ) &&
          <>
            <DisplayMarkerInfo location={activeLocation} />
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
                icon={marker.icon!}
                size={zoom > 8 ? 16 : 8} // Smaller when zoomed out
                showIcon={zoom > 8} // Only show icon when zoomed in
              />
            </AdvancedMarker>
          ))}
      </GoogleMap>
    </div>
  );
};

export default memo(Mapview);
