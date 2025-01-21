"use client";
import { useMapStore } from "@/components/providers/map-state-provider";
import { getGoogleMapsTravelMode } from "@/lib/utils/index";
import {
  AdvancedMarker,
  Map as GoogleMap,
  MapMouseEvent,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import { env } from "env";
import { lazy, memo, useEffect, useMemo, useState } from "react";
import DisplayMarkerInfo from "./display-marker-info";
import { AutocompleteCustomInput, detailsRequestCallback } from "./search";

const MarkerPin = lazy(() => import("./marker_pin"));

const Mapview = () => {
  const map = useMap();
  const places = useMapsLibrary("places");
  const geocoder = useMapsLibrary("geocoding");
  const {
    activeLocation,
    markers,
    setActiveLocation,
    setSearchValue,
    routes,
    routeStops,
  } = useMapStore((store) => store);

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
        lat: -25.2744,
        lng: 133.7751,
      },
      zoom: 4,
    };
  }, []);

  useEffect(() => {
    if (!routesLibrary || !map || !routeStops || !routes) return;
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }));
  }, [routesLibrary, map]);

  useEffect(() => {
    if (!directionsService || !directionsRenderer || !routeStops || !routes)
      return;

    routes.forEach((route) => {
      const stops = routeStops
        .filter((stop) => stop.route_id === route.route_id)
        .sort((a, b) => a.stop_order - b.stop_order);
      const start = stops[0];
      const end = stops[stops.length - 1];
      const mid = stops.slice(1, stops.length - 1);

      if (!stops || !start || !end) return;

      directionsService
        .route({
          origin: { lat: start.lat, lng: start.lng },
          destination: { lat: end.lat, lng: end.lng },
          waypoints: mid.map((stop) => ({
            location: { lat: stop.lat, lng: stop.lng },
            stopover: true,
          })),
          travelMode: getGoogleMapsTravelMode(route.travel_type),
          provideRouteAlternatives: false,
        })
        .then((response) => {
          directionsRenderer.setDirections(response);
          setGoogleRoutes(response.routes);
        });
    });

    return () => {
      directionsRenderer.setMap(null);
      setGoogleRoutes([]);
    };
  }, [directionsService, directionsRenderer, routes, routeStops]);

  async function handleMapClick(e: MapMouseEvent) {
    if (!places || !map || !geocoder) return;
    e.domEvent?.stopPropagation();
    e.stop();
    console.log("Clicked on area", e);
    const placesService = new places.PlacesService(map);
    const geoCoder = new geocoder.Geocoder();

    if (e.detail.placeId) {
      const requestOptions: google.maps.places.PlaceDetailsRequest = {
        placeId:
          e.detail.placeId ||
          `${e.detail.latLng?.lat}, ${e.detail.latLng?.lng}`,
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

      placesService.getDetails(requestOptions, (data) => {
        const res = detailsRequestCallback(map!, data);
        if (res) {
          setActiveLocation(res.location);
          setSearchValue(
            res.placeDetails?.name ?? res.placeDetails?.formatted_address ?? ""
          );
        }
      });
    } else if (e.detail.latLng && geocoder) {
      const requestOptions: google.maps.places.PlaceSearchRequest = {
        location: e.detail.latLng,
        radius: 1000,
      };
      placesService.nearbySearch(requestOptions, (data) => {
        console.log("search-data: ", data);
        if (!data || !data[0]) return;
        const res = detailsRequestCallback(map!, data[0]);
        if (res) {
          setActiveLocation(res.location);
          setSearchValue(
            res.placeDetails?.name ?? res.placeDetails?.formatted_address ?? ""
          );
        }
      });

      const geoCodeRequest: google.maps.GeocoderRequest = {
        location: e.detail.latLng,
        bounds: e.map.getBounds(),
        componentRestrictions: {
          
        }
      };
      geoCoder.geocode(geoCodeRequest, (results, status) => {
        console.log("geo-results: ", results);
        console.log("geo-status: ", status);
      });
    }

    if (e.detail.latLng) {
    }
  }

  return (
    <div className="absolute inset-0 h-screen w-full flex-1">
      <AutocompleteCustomInput />
      <GoogleMap
        defaultCenter={mapOptions.center}
        defaultZoom={mapOptions.zoom}
        mapId={env.NEXT_PUBLIC_GOOGLE_MAPS_MAPID}
        disableDefaultUI={true}
        onClick={(e) => handleMapClick(e)}
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
              key={marker.marker_id}
              position={{ lat: marker.lat, lng: marker.lng }}
              title={marker.title}
              onClick={() => {
                map!.panTo({ lat: marker.lat, lng: marker.lng });
                setActiveLocation(marker);
              }}
            >
              <MarkerPin marker={marker} size={16} />
            </AdvancedMarker>
          ))}
      </GoogleMap>
    </div>
  );
};

export default memo(Mapview);
