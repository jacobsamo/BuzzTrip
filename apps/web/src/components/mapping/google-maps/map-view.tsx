"use client";
import { useMapStore } from "@/components/providers/map-state-provider";
import { getGoogleMapsTravelMode } from "@/lib/utils/index";
import {
  AdvancedMarker,
  Map as GoogleMap,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import { env } from "env";
import { lazy, memo, useEffect, useMemo, useState } from "react";
import DisplayMarkerInfo from "./display-marker-info";
import { AutocompleteCustomInput, detailsRequestCallback } from "./search";

const MarkerPin = lazy(() => import("./marker_pin"));

const Mapview = () => {
  const googleMap = useMap();
  const places = useMapsLibrary("places");
  const {
    activeLocation,
    markers,
    setActiveLocation,
    setSearchValue,
    routes,
    routeStops,
    map,
  } = useMapStore((store) => store);

  if (!map) return null;

  // Handle directions for routes
  const routesLibrary = useMapsLibrary("routes");
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
    if (!routesLibrary || !routeStops || !routes || !googleMap) return;
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(
      new routesLibrary.DirectionsRenderer({ map: googleMap })
    );
  }, [routesLibrary, googleMap]);

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

  const handleClick = async (e: any) => {
    if (!places || !googleMap) return;
    e.domEvent?.stopPropagation();
    e.stop();
    console.log("Clicked on area:", e);
    const placesService = new places.PlacesService(googleMap);
    const latLng = e.detail.latLng;
    let placeId = e.detail.placeId;

    if (!placeId) {
      const zoom = googleMap.getZoom();
      const radius = () => {
        if (!zoom) return 300;
        if (zoom < 6) return 1000;
        if (zoom < 8) return 100;
        if (zoom > 10) return 100;

        return 300;
      };

      try {
        placeId = await new Promise<string | undefined>((resolve, reject) => {
          placesService.nearbySearch(
            {
              location: latLng,
              radius: radius(),
              bounds: googleMap.getBounds(),
            },
            (data, status) => {
              if (
                status !== google.maps.places.PlacesServiceStatus.OK ||
                !data ||
                data.length === 0
              ) {
                reject(new Error("Nearby search failed"));
                return;
              }
              resolve(data[0]?.place_id);
            }
          );
        });
      } catch (error) {
        console.error("Error during nearby search:", error);
        return; // Exit early if search fails
      }
    }

    if (!placeId) {
      console.error("No placeId found after search");
      return;
    }

    // Handle Place Details Lookup
    try {
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
        const res = detailsRequestCallback(googleMap!, data);
        if (res) {
          setActiveLocation(res.location);
          setSearchValue(
            res.placeDetails?.name ?? res.placeDetails?.formatted_address ?? ""
          );
        }
      });
    } catch (error) {
      console.error("Error fetching place details:", error);
    }
  };

  return (
    <div className="absolute inset-0 h-screen w-full flex-1 touch-none">
      <AutocompleteCustomInput />
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
        mapTypeId="hybrid"
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
              <MarkerPin color={marker.color} icon={marker.icon!} size={16} />
            </AdvancedMarker>
          ))}
      </GoogleMap>
    </div>
  );
};

export default memo(Mapview);
