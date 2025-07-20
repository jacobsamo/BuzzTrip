import { useMapStore } from "@/components/providers/map-state-provider";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { colors } from "@/lib/data";
import { cn } from "@/lib/utils";
import { api } from "@buzztrip/backend/api";
import { Id } from "@buzztrip/backend/dataModel";
import type { IconType } from "@buzztrip/backend/types";
import { combinedMarkersSchema } from "@buzztrip/backend/zod-schemas";
import { popularIconsList } from "@buzztrip/components/icon";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { Circle, CircleCheck } from "lucide-react";
import dynamic from "next/dynamic";
import * as React from "react";
import { useEffect, useMemo } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { IconPicker } from "../icon-picker";

const Icon = dynamic(() => import("@buzztrip/components/icon"), { ssr: false });

const editSchema = z.object({
  ...combinedMarkersSchema.shape,
  collection_ids: z.array(z.string()).nullish(),
});

export default function MarkerForm() {
  const {
    map,
    activeState,
    setActiveState,
    setActiveLocation,
    collections,
    markers,
    getCollectionsForMarker,
    collectionLinks,
  } = useMapStore((store) => store);
  if (
    activeState &&
    (activeState.event === "markers:create" ||
      activeState.event === "markers:update")
  ) {
    const createMarker = useMutation(api.maps.markers.createMarker);
    const updateMarker = useMutation(api.maps.markers.editMarker);
    const deleteMarker = useMutation(api.maps.markers.deleteMarker);

    const marker = activeState.payload;
    const [inCollections, setInCollections] = React.useState<string[] | null>(
      null
    );
    const [isLoading, setIsLoading] = React.useState(false);

    const form = useForm<z.infer<typeof editSchema>>({
      resolver: zodResolver(editSchema),
      defaultValues: {
        ...marker,
        icon: marker?.icon ?? "MapPin",
        color: marker?.color ?? "#0B7138",
        map_id: map._id as Id<"maps">,
      },
    });

    const {
      register,
      handleSubmit,
      watch,
      control,
      setValue,
      reset,
      formState: { errors },
    } = form;

    const isSaved = useMemo(() => {
      if (!markers || !marker || !marker._id) return false;
      return markers.find((m) => m._id == marker._id) ?? false;
    }, [marker, markers]);

    useEffect(() => {
      if (!isSaved || !marker) return;
      const collectionsForMarker = getCollectionsForMarker(isSaved._id ?? null);
      if (!collectionsForMarker) return;

      const inCols =
        collectionsForMarker.map((collection) => collection._id) ?? null;

      setInCollections(inCols);
      setValue("collection_ids", inCols, {
        shouldDirty: true,
        shouldTouch: true,
      });
    }, [markers, collections]);

    useEffect(() => {
      console.log("Errors: ", errors);
    }, [errors]);

    const clearForm = () => {
      reset();
      setActiveState(null);
    };

    const onSubmit: SubmitHandler<z.infer<typeof editSchema>> = async (
      data
    ) => {
      try {
        setIsLoading(true);
        const cols = data.collection_ids ?? null;

        if (activeState.event === "markers:update") {
          const markerId = marker!._id!;
          const selectedCollections = cols ?? [];

          // Collections to add are those in the selected list but not in the current list
          const collectionsToAdd = selectedCollections.filter(
            (collectionId) => !inCollections!.includes(collectionId)
          );

          // Collections to remove are those in the current list but not in the selected list
          const collectionsToRemove = inCollections!.filter(
            (collectionId) => !selectedCollections.includes(collectionId)
          );

          delete data.collection_ids;
          delete data._id;
          delete data._creationTime;

          const updatedMarker = updateMarker({
            marker_id: markerId as Id<"markers">,
            marker: {
              title: data.title,
              note: data.note,
              lat: data.lat,
              lng: data.lng,
              icon: data.icon,
              color: data.color,
            },
            collectionIds_to_add: collectionsToAdd as Id<"collections">[],
            collectionIds_to_remove: collectionsToRemove as Id<"collections">[],
            mapId: map._id as Id<"maps">,
          });

          setActiveLocation(null);

          toast.promise(updatedMarker, {
            loading: "Updating marker...",
            success: async (res) => {
              return "Marker updated successfully!";
            },
            error: "Failed to update marker",
          });
        }

        if (activeState.event === "markers:create") {
          // remove collection_ids from data
          delete data.collection_ids;
          const createdMarker = createMarker({
            mapId: map._id as Id<"maps">,
            marker: data,
            collectionIds: cols,
          });
          setActiveLocation(null);

          toast.promise(createdMarker, {
            loading: "Creating marker...",
            success: "Marker created successfully!",
            error: "Failed to create marker",
          });
        }

        clearForm();
      } catch (error) {
        console.error(error);
      }
      setIsLoading(false);
    };

    const handleDelete = () => {
      const deletedMarker = deleteMarker({
        markerId: marker!._id as Id<"markers">,
      });

      toast.promise(deletedMarker, {
        loading: "Deleting marker...",
        success: () => {
          clearForm();
          return "Marker deleted successfully";
        },
        error: "Failed to delete marker",
      });
    };

    const handleChange = (id: string) => {
      const selected = watch("collection_ids") ?? [];
      setValue(
        "collection_ids",
        selected.includes(id)
          ? selected.filter((cId) => cId !== id)
          : [...selected, id],
        {
          shouldDirty: true,
          shouldTouch: true,
        }
      );
    };

    return (
      <div className="p-2 z-10">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormField
              control={control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Roadtrip" />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="color"
              render={({ field }) => {
                const selectedColor = watch("color");

                return (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <div className="flex flex-wrap gap-2">
                        {colors.map((color, index) => (
                          <button
                            onClick={() => field.onChange(color.hex)}
                            key={index}
                            className={cn(
                              "group h-8 w-8 scale-100 rounded-md",
                              {
                                "h-9 w-9 scale-110 border border-gray-500 shadow-lg":
                                  selectedColor == color.hex,
                              }
                            )}
                            style={{ backgroundColor: color.hex }}
                            type="button"
                          ></button>
                        ))}
                        <Input
                          type="color"
                          value={field.value ?? "#000"}
                          onChange={field.onChange}
                        />
                      </div>
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea {...field} value={field.value ?? undefined} />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="icon"
              render={({ field }) => {
                const selectedIcon = watch("icon");

                return (
                  <FormItem>
                    <FormLabel>Icon</FormLabel>
                    <FormControl>
                      <div className="flex flex-wrap gap-2">
                        {!popularIconsList.includes(selectedIcon as any) && (
                          <div
                            className={buttonVariants({
                              variant: "ghost",
                              className:
                                "scale-105 border border-gray-500 text-black shadow-lg",
                            })}
                          >
                            <Icon
                              name={(selectedIcon ?? "MapPin") as IconType}
                              size={24}
                            />
                          </div>
                        )}
                        {popularIconsList.map((icon, index) => (
                          <Button
                            key={index}
                            type="button"
                            variant="ghost"
                            onClick={() => field.onChange(icon)} // Handle icon selection
                            className={cn("group text-black", {
                              "scale-105 border border-gray-500 shadow-lg":
                                selectedIcon == icon,
                            })}
                          >
                            <Icon name={icon} size={24} />
                          </Button>
                        ))}
                        {/* <IconPickerModal
                          selectedIcon={watch("icon") ?? "MapPin"}
                          setSelectedIcon={field.onChange}
                        /> */}
                        <IconPicker
                          value={(watch("icon") ?? "MapPin") as IconType}
                          onChange={field.onChange}
                        />
                      </div>
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <ScrollArea className="h-36 w-full">
              {collections &&
                collections.map((collection, index) => {
                  const isChecked =
                    watch("collection_ids")?.includes(collection._id) ?? false;
                  return (
                    <Button
                      onClick={() => handleChange(collection._id!)}
                      key={index}
                      className={cn(
                        "group h-fit w-full flex-row items-start justify-start gap-2",
                        {
                          "scale-105 border border-gray-500 shadow-lg":
                            isChecked,
                        }
                      )}
                      type="button"
                      variant="ghost"
                    >
                      {isChecked ? <CircleCheck /> : <Circle />}
                      <Icon name={collection.icon as IconType} size={32} />
                      <div className="flex-col">
                        <h2>{collection.title}</h2>
                        {/* <p>
                                Markers:
                                {typeof collectionsMarkerCount == "object" &&
                                  collectionsMarkerCount.find(
                                    (col) =>
                                      collection.collection_id ==
                                      col.collection_id
                                  )?.markerCount}
                              </p> */}
                      </div>
                    </Button>
                  );
                })}
            </ScrollArea>

            <div className="absolute bottom-2 right-2 mt-4 inline-flex items-center justify-end gap-2">
              {activeState.event === "markers:update" && marker && (
                <Button
                  aria-label="delete marker"
                  variant="destructive"
                  type="button"
                  onClick={() => handleDelete()}
                >
                  Delete
                </Button>
              )}
              <Button aria-label="Create Marker" type="submit">
                {activeState.event === "markers:create"
                  ? "Create"
                  : "Save changes"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    );
  }
  return null;
}
