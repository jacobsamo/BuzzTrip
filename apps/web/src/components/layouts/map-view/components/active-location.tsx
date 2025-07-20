import MarkerPin from "@/components/mapping/google-maps/marker_pin";
import { useMapStore } from "@/components/providers/map-state-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import { getCollectionsForMarker } from "@/lib/utils";
import { ExternalLink, Globe, Pencil, Phone, Plus } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import CloseButton from "./close-button";
import { IconType } from "@buzztrip/backend/types";

const ActiveLocation = () => {
  const {
    markers,
    activeLocation,
    setActiveLocation,
    setActiveState,
    collections,
    collectionLinks,
  } = useMapStore((state) => state);
  const [showMore, setShowMore] = useState(false);

  if (!activeLocation) return null;

  const isSaved = useMemo(() => {
    if (!activeLocation.place.gm_place_id || !markers) return false;
    return markers.find(
      (marker) => marker.place.gm_place_id === activeLocation.place.gm_place_id
    );
  }, [markers, activeLocation]);

  const collectionsForLocation = useMemo(() => {
    if (!activeLocation._id || !collections || !collectionLinks) return null;
    return getCollectionsForMarker(
      collections,
      collectionLinks,
      activeLocation._id
    );
  }, [collections, collectionLinks, activeLocation]);

  return (
    <div className="bg-white rounded-lg overflow-hidden w-full sm:max-w-md mx-auto">
      {/* Header with photos */}
      <CloseButton />
      {activeLocation.place.photos && activeLocation.place.photos.length > 0 ? (
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {activeLocation.place.photos.map((photo, index) => (
              <CarouselItem key={index} className="basis-full">
                <div className="relative h-48 w-full">
                  <Image
                    src={photo || "/placeholder.svg"}
                    fill
                    alt="location photo"
                    className="object-cover"
                    priority
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2 bg-white/80 hover:bg-white" />
          <CarouselNext className="right-2 bg-white/80 hover:bg-white" />
        </Carousel>
      ) : (
        <div className="h-32 bg-gray-100 flex items-center justify-center">
          <MarkerPin color={activeLocation.color} icon={activeLocation.icon as IconType} />
        </div>
      )}

      {/* Main content */}
      <div className="p-4">
        {/* Title and location info */}
        <div className="flex items-start gap-3 mb-2">
          <div className="mt-1">
            <MarkerPin
              color={activeLocation.color}
              icon={activeLocation.icon as IconType}
            />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-medium text-gray-900">
              {activeLocation.title}
            </h1>
            <p className="text-sm text-gray-600">
              {activeLocation.place.address
                ? activeLocation.place.address
                : `${activeLocation.lat}, ${activeLocation.lng}`}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 my-3">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 h-10"
            onClick={() => {
              if (isSaved) {
                setActiveState({
                  event: "markers:update",
                  payload: activeLocation,
                });
              } else {
                setActiveState({
                  event: "markers:create",
                  payload: activeLocation,
                });
              }
            }}
          >
            {isSaved ? (
              <>
                <Pencil className="h-4 w-4 mr-1" /> Edit
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-1" /> Save
              </>
            )}
          </Button>

          {/* <Button variant="outline" size="sm" className="h-10">
          <Share2 className="h-4 w-4" />
          <span className="sr-only">Share</span>
        </Button>

        <Button variant="outline" size="sm" className="h-10">
          <Navigation className="h-4 w-4" />
          <span className="sr-only">Directions</span>
        </Button> */}
        </div>

        {/* Contact information */}
        <div className="space-y-3 text-sm">
          {/* Website */}
          {activeLocation.place.website && (
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-gray-500" />
              <a
                href={activeLocation.place.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline flex items-center gap-1"
              >
                {new URL(activeLocation.place.website).hostname}
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          )}

          {/* Phone */}
          {activeLocation.place.phone && (
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-gray-500" />
              <a
                href={`tel:${activeLocation.place.phone}`}
                className="text-blue-600 hover:underline"
              >
                {activeLocation.place.phone}
              </a>
            </div>
          )}

          {/* Opening hours */}
          {/* <div>
          <button onClick={() => setShowMore(!showMore)} className="flex items-center gap-3 w-full text-left">
            <Clock className="h-5 w-5 text-gray-500" />
            <div className="flex justify-between w-full">
              <span>Opening hours</span>
              {showMore ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
          </button>

          {showMore && (
            <div className="mt-2 ml-8 space-y-1">
              {openingHours.map((item, index) => (
                <div key={index} className="flex justify-between text-xs">
                  <span className="font-medium">{item.day}</span>
                  <span className="text-gray-600">{item.hours}</span>
                </div>
              ))}
            </div>
          )}
        </div> */}
        </div>

        <Separator className="my-3" />

        {/* Collections section */}
        {isSaved &&
          collectionsForLocation &&
          collectionsForLocation.length > 0 && (
            <div className="mb-3">
              <p className="text-sm font-medium text-gray-700 mb-1">
                In collections:
              </p>
              <div className="flex flex-wrap gap-1">
                {collectionsForLocation.map((col) => (
                  <Badge key={col._id} variant="outline" className="bg-gray-50">
                    {col.title}
                  </Badge>
                ))}
              </div>
            </div>
          )}

        {/* Notes section */}
        {activeLocation.note && (
          <div className="mb-3">
            <p className="text-sm font-medium text-gray-700 mb-1">Notes:</p>
            <div className="rounded-md w-full border border-gray-200 bg-gray-50 p-3 text-sm">
              {activeLocation.note}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveLocation;
