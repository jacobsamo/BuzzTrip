import { ColorPicker } from "@/components/color-picker";
import { IconPicker } from "@/components/icon-picker";
import MarkerPin from "@/components/marker-pin";
import OpenCollectionModal from "@/components/modals/open-collection-modal";
import { PhotoPicker, type PendingPhoto } from "@/components/photos";
import { useMapStore } from "@/components/providers/map-state-provider";
import { Button } from "@buzztrip/ui/components/button";
import { Checkbox } from "@buzztrip/ui/components/checkbox";
import { DialogHeader } from "@buzztrip/ui/components/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@buzztrip/ui/components/form";
import { Input } from "@buzztrip/ui/components/input";
import { Label } from "@buzztrip/ui/components/label";
import { ScrollArea } from "@buzztrip/ui/components/scroll-area";
import { Textarea } from "@buzztrip/ui/components/textarea";
import { popularColors } from "@/lib/data";
import { cn } from "@/lib/utils";
import { api } from "@buzztrip/backend/api";
import { Id } from "@buzztrip/backend/dataModel";
import type { IconType } from "@buzztrip/backend/types";
import { combinedMarkersSchema } from "@buzztrip/backend/zod-schemas";
import { popularIconsList } from "@buzztrip/ui/components/icon";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "convex/react";
import { ImageIcon, Trash2 } from "lucide-react";
import dynamic from "next/dynamic";
import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const Icon = dynamic(() => import("@buzztrip/ui/components/icon"), {
  ssr: false,
});

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
    const [pendingPhotos, setPendingPhotos] = useState<PendingPhoto[]>([]);
    const [showPhotoPicker, setShowPhotoPicker] = useState(false);

    // Mutations for photo uploads
    const generateUploadUrl = useMutation(api.photos.generateUploadUrl);
    const saveMarkerPhotos = useMutation(api.photos.saveMarkerPhotos);

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
      setPendingPhotos([]);
      setShowPhotoPicker(false);
      setActiveState(null);
    };

    // Upload photos to storage and save metadata
    const uploadPhotos = async (markerId: Id<"markers">) => {
      if (pendingPhotos.length === 0) return;

      const photosToSave = [];

      for (const photo of pendingPhotos) {
        // Generate upload URL
        const uploadUrl = await generateUploadUrl();

        // Upload the file to Convex storage
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": photo.file.type },
          body: photo.file,
        });

        const { storageId } = await result.json();

        photosToSave.push({
          storage_id: storageId,
          width: photo.width,
          height: photo.height,
          caption: photo.caption,
        });
      }

      // Batch save all photos
      await saveMarkerPhotos({
        marker_id: markerId,
        photos: photosToSave,
      });
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

          await toast.promise(
            (async () => {
              await updatedMarker;
              // Upload photos after marker is updated
              await uploadPhotos(markerId as Id<"markers">);
            })(),
            {
              loading: pendingPhotos.length > 0 ? "Updating marker and uploading photos..." : "Updating marker...",
              success: pendingPhotos.length > 0
                ? `Marker updated with ${pendingPhotos.length} photo${pendingPhotos.length > 1 ? 's' : ''}!`
                : "Marker updated successfully!",
              error: "Failed to update marker",
            }
          );
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

          await toast.promise(
            (async () => {
              const markerId = await createdMarker;
              // Upload photos after marker is created
              await uploadPhotos(markerId);
              return markerId;
            })(),
            {
              loading: pendingPhotos.length > 0 ? "Creating marker and uploading photos..." : "Creating marker...",
              success: pendingPhotos.length > 0
                ? `Marker created with ${pendingPhotos.length} photo${pendingPhotos.length > 1 ? 's' : ''}!`
                : "Marker created successfully!",
              error: "Failed to create marker",
            }
          );
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

    const selectedColor = watch("color") ?? "#fff";
    const selectedIcon = watch("icon") ?? "MapPin";

    return (
      <div className="p-2 z-10">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader className="flex flex-row items-start justify-center py-2">
              <MarkerPin
                color={selectedColor}
                icon={selectedIcon as IconType}
                size={28}
              />

              <FormField
                control={control}
                name="title"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input {...field} placeholder="Roadtrip" />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </DialogHeader>

            <FormField
              control={control}
              name="color"
              render={({ field }) => {
                let name = selectedColor;

                return (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <div className="inline-flex items-center gap-2">
                        {popularColors.map((color, index) => (
                          <Button
                            key={index}
                            type="button"
                            variant="ghost"
                            onClick={() => field.onChange(color.hex)} // Handle icon selection
                            className={cn(
                              "border-input bg-background flex size-8 items-center justify-center rounded-md border",
                              {
                                "scale-105 shadow-lg ring ring-black ring-offset-1":
                                  selectedColor == color.hex,
                              }
                            )}
                            style={{ backgroundColor: color.hex }}
                          ></Button>
                        ))}

                        <span className="h-full w-[2px] rounded-md bg-gray-200"></span>

                        <ColorPicker
                          value={{ hex: selectedColor, name: name }}
                          onChange={(val) => {
                            field.onChange(val.hex);
                            name = val.name;
                          }}
                          className="size-8"
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
              name="icon"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Icon</FormLabel>
                    <FormControl>
                      <div className="inline-flex items-center gap-2">
                        {popularIconsList.map((icon, index) => (
                          <Button
                            key={index}
                            type="button"
                            variant="ghost"
                            onClick={() => field.onChange(icon)} // Handle icon selection
                            className={cn(
                              "border-input bg-background flex size-8 items-center justify-center rounded-md border",
                              {
                                "scale-105 shadow-lg ring ring-black ring-offset-1":
                                  selectedIcon == icon,
                              }
                            )}
                          >
                            <Icon name={icon} size={24} />
                          </Button>
                        ))}

                        <span className="h-full w-[2px] rounded-md bg-gray-200"></span>

                        <IconPicker
                          value={(selectedIcon ?? "MapPin") as IconType}
                          onChange={field.onChange}
                          className="size-8"
                        />
                      </div>
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            {/* Photo Picker */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Photos</Label>
                {pendingPhotos.length > 0 && (
                  <span className="text-muted-foreground text-xs">
                    {pendingPhotos.length} photo{pendingPhotos.length > 1 ? "s" : ""} ready to upload
                  </span>
                )}
              </div>
              <PhotoPicker
                value={pendingPhotos}
                onChange={setPendingPhotos}
                maxFiles={5}
              />
              <p className="text-muted-foreground text-xs">
                Add photos to this marker. They'll be uploaded when you save.
              </p>
            </div>

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

            <div className="space-y-2">
              <div className="inline-flex items-center justify-between w-full">
                <Label className="text-sm font-medium">Collections </Label>
                <OpenCollectionModal />
              </div>
              <ScrollArea className="space-y-4 h-36 w-full">
                {collections &&
                  collections.map((collection, index) => {
                    const isChecked =
                      watch("collection_ids")?.includes(collection._id) ??
                      false;
                    return (
                      <div
                        key={collection._id}
                        className="flex items-center gap-2"
                      >
                        <Checkbox
                          id={collection._id}
                          checked={isChecked}
                          onCheckedChange={() => handleChange(collection._id!)}
                          className="rounded-full w-4 h-4"
                        />
                        <Icon name={collection.icon as IconType} size={20} />
                        <Label
                          htmlFor={collection._id}
                          className="text-sm cursor-pointer flex-1"
                        >
                          {collection.title}
                        </Label>
                      </div>
                    );
                  })}
              </ScrollArea>
            </div>

            <div
              className={cn(
                "inline-flex items-center justify-between w-11/12  absolute bottom-2 mt-4 ",
                {
                  "justify-end": activeState.event === "markers:create",
                }
              )}
            >
              {activeState.event === "markers:update" && marker && (
                <Button
                  aria-label="delete marker"
                  variant="destructive"
                  type="button"
                  onClick={() => handleDelete()}
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Delete Marker
                </Button>
              )}
              <Button aria-label="Create Marker" type="submit">
                {activeState.event === "markers:create"
                  ? "Add Marker"
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
