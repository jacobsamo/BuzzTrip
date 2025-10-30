"use client";

import { useMapStore } from "@/components/providers/map-state-provider";
import { useMap } from "@vis.gl/react-google-maps";
import { useEffect, useRef } from "react";

const TravelBoundaryPolygons = () => {
  const { travelBoundaries } = useMapStore((state) => state);
  const map = useMap();
  const polygonsRef = useRef<google.maps.Polygon[]>([]);

  useEffect(() => {
    if (!map || !travelBoundaries) return;

    // Clear existing polygons
    polygonsRef.current.forEach((polygon) => polygon.setMap(null));
    polygonsRef.current = [];

    // Create polygons for visible boundaries
    travelBoundaries
      .filter((boundary) => boundary.is_visible)
      .forEach((boundary) => {
        const polygon = new google.maps.Polygon({
          paths: boundary.polygon.map((point) => ({
            lat: point.lat,
            lng: point.lng,
          })),
          strokeColor: "#4285F4",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "#4285F4",
          fillOpacity: 0.2,
          map: map,
          clickable: true,
          draggable: false,
          editable: false,
        });

        // Add click listener to show boundary info
        polygon.addListener("click", () => {
          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div style="padding: 8px;">
                <h3 style="margin: 0 0 4px 0; font-weight: 600;">${boundary.title || "Travel Boundary"}</h3>
                <p style="margin: 0; color: #666;">${boundary.duration_minutes} minutes drive time</p>
              </div>
            `,
            position: {
              lat: boundary.center_lat,
              lng: boundary.center_lng,
            },
          });

          infoWindow.open(map);
        });

        // Add center marker
        const centerMarker = new google.maps.Marker({
          position: {
            lat: boundary.center_lat,
            lng: boundary.center_lng,
          },
          map: map,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: "#4285F4",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 2,
          },
          title: boundary.title || "Travel Boundary Center",
        });

        polygonsRef.current.push(polygon);
      });

    return () => {
      // Cleanup on unmount
      polygonsRef.current.forEach((polygon) => polygon.setMap(null));
      polygonsRef.current = [];
    };
  }, [map, travelBoundaries]);

  return null; // This component doesn't render any React elements
};

export default TravelBoundaryPolygons;
