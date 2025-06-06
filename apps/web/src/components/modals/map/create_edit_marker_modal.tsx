import { useMapStore } from "@/components/providers/map-state-provider";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
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
import { CombinedMarker } from "@buzztrip/backend/types";
import { combinedMarkersSchema } from "@buzztrip/backend/zod-schemas";
import { popularIconsList } from "@buzztrip/components/icon";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMediaQuery } from "@uidotdev/usehooks";
import { useMutation } from "convex/react";
import { Circle, CircleCheck } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import * as React from "react";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import IconPickerModal from "../icon-picker-modal";

const Icon = dynamic(() => import("@buzztrip/components/icon"), { ssr: false });

export default function MarkerModal() {
  const { setMarkerOpen, markerOpen } = useMapStore((store) => store);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleClose = () => {
    setMarkerOpen(false, null, null);
  };

  const Header = () => {
    return (
      <div className="flex flex-row items-center gap-1">
        {markerOpen.marker?.photos !== undefined && (
          <Image
            src={markerOpen.marker?.photos?.[0] ?? ""}
            alt={markerOpen.marker?.title ?? "location"}
            width={64}
            height={64}
            className="h-16 w-16 rounded-md object-cover object-center"
          />
        )}

        <h1 className="w-fit text-wrap text-start text-xl font-bold">
          {markerOpen.marker?.title}
        </h1>
      </div>
    );
  };

  if (isDesktop) {
    return (
      <Dialog open={markerOpen.open} onOpenChange={handleClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <Header />
            </DialogTitle>
          </DialogHeader>
          <MarkerForm />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={markerOpen.open} onOpenChange={handleClose}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>
            <Header />
          </DrawerTitle>
        </DrawerHeader>
        <MarkerForm />
        <DrawerFooter className="pt-2">
          <DrawerClose className={buttonVariants({ variant: "outline" })}>
            Cancel
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

// const Close = ({ children }: { children: React.ReactNode }) => {
//   return (
//     <DialogClose asChild>
//       <DrawerClose asChild>{children}</DrawerClose>
//     </DialogClose>
//   );
// };

const schema = z.object({
  ...combinedMarkersSchema.shape,
  collection_ids: z.array(z.string()).nullish(),
});

function MarkerForm() {
  const createMarker = useMutation(api.maps.markers.createMarker);
  const updateMarker = useMutation(api.maps.markers.editMarker);
  const {
    collections,
    map,
    markers,
    getCollectionsForMarker,
    collectionLinks,
    setMarkerOpen,
    markerOpen,
  } = useMapStore((store) => store);

  const { mode, marker } = markerOpen;
  const [inCollections, setInCollections] = React.useState<string[] | null>(
    null
  );
  const [isSaved, setIsSaved] = React.useState<CombinedMarker | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      ...marker,
      icon: marker?.icon ?? "MapPin",
      color: marker?.color ?? "#0B7138",
      bounds: marker?.bounds ?? null,
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

  useEffect(() => {
    const saved = marker
      ? (markers?.find((marker) => marker._id == marker._id) ?? null)
      : null;
    setIsSaved(saved);

    const inCols =
      getCollectionsForMarker(saved?._id ?? null)?.map(
        (collection) => collection._id
      ) ?? null;
    setInCollections(inCols);
    setValue("collection_ids", inCols, {
      shouldDirty: true,
      shouldTouch: true,
    });
  }, [markers, collections, markerOpen]);

  useEffect(() => {
    console.log("Errors: ", errors);
  }, [errors]);

  const onSubmit: SubmitHandler<z.infer<typeof schema>> = async (data) => {
    try {
      setIsLoading(true);
      const cols = data.collection_ids ?? null;

      if (mode == "edit") {
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

        // const updatedMarker = apiClient.map[":mapId"].marker[":markerId"].$put({
        //   param: { mapId: map!.map_id, markerId: markerId! },
        //   json: {
        //     marker_id: markerId!,
        //     marker: data,
        //     collectionIds_to_add: collectionsToAdd,
        //     collectionIds_to_remove: collectionsToRemove,
        //     userId: userId!,
        //   },
        // });
        delete data.collection_ids;
        const updatedMarker = updateMarker({
          marker_id: markerId as Id<"markers">,
          marker: data,
          collectionIds_to_add: collectionsToAdd as Id<"collections">[],
          collectionIds_to_remove:
            collectionsToRemove as Id<"collection_links">[],
          mapId: map._id as Id<"maps">,
        });

        toast.promise(updatedMarker, {
          loading: "Updating marker...",
          success: async (res) => {
            return "Marker updated successfully!";
          },
          error: "Failed to update marker",
        });
      }

      if (mode == "create") {
        // remove collection_ids from data
        delete data.collection_ids;
        console.log("Data", data);
        const createdMarker = createMarker({
          mapId: map._id as Id<"maps">,
          marker: data,
          collectionIds: cols,
        });

        toast.promise(createdMarker, {
          loading: "Creating marker...",
          success: "Marker created successfully!",
          error: "Failed to create marker",
        });
      }

      reset();
      setMarkerOpen(false, null, null);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  const handleDelete = () => {
    // const deleteCollection = fetch(
    //   `/api/map/${map!.uid}/marker/${marker!.uid}`,
    //   {
    //     method: "DELETE",
    //   }
    // );
    // toast.promise(deleteCollection, {
    //   loading: "Deleting marker...",
    //   success: "Markker deleted successfully",
    //   error: "Failed to delete marker",
    // });
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
    <div className="p-2">
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
                          className={cn("group h-8 w-8 scale-100 rounded-md", {
                            "h-9 w-9 scale-110 border border-gray-500 shadow-lg":
                              selectedColor == color.hex,
                          })}
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
                          <Icon name={selectedIcon ?? "MapPin"} size={24} />
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
                      <IconPickerModal
                        selectedIcon={watch("icon") ?? "MapPin"}
                        setSelectedIcon={field.onChange}
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
                const isChecked = watch("collection_ids")?.includes(
                  collection._id
                );

                return (
                  <Button
                    onClick={() => handleChange(collection._id!)}
                    key={index}
                    className={cn(
                      "group h-fit w-full flex-row items-start justify-start gap-2",
                      {
                        "scale-105 border border-gray-500 shadow-lg": isChecked,
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

          <div className="mt-4 inline-flex items-center justify-end gap-2">
            {mode === "edit" && marker && (
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
              {mode === "create" ? "Create" : "Save changes"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
