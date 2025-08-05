import { ColorPicker } from "@/components/color-picker";
import { useMapStore } from "@/components/providers/map-state-provider";
import { Button } from "@/components/ui/button";
import { DialogHeader } from "@/components/ui/dialog";
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
import { Textarea } from "@/components/ui/textarea";
import { popularColors } from "@/lib/data";
import { cn, upperCaseFirstLetter } from "@/lib/utils";
import { api } from "@buzztrip/backend/api";
import { Id } from "@buzztrip/backend/dataModel";
import { Path } from "@buzztrip/backend/types";
import { pathsEditSchema } from "@buzztrip/backend/zod-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { Trash2 } from "lucide-react";
import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  CircleIcon,
  LineIcon,
  PolygonIcon,
  RectangleIcon,
} from "../icons/paths";
import { ShowPathIcon, fallbackStyle } from "../show-path-icon";

const editSchema = z.object({
  ...pathsEditSchema.shape,
  collection_ids: z.array(z.string()).nullish(),
});

const generateTitle = (paths: Path[] | null, pathType: Path["pathType"]) => {
  if (!paths || paths.length === 0) return `${upperCaseFirstLetter(pathType)}1`;

  switch (pathType) {
    case "circle":
      const numberOfCircles = paths.filter(
        (path) => path.pathType === "circle"
      ).length;
      return `${upperCaseFirstLetter(pathType)}${numberOfCircles + 1}`;
    case "rectangle":
      const numberOfRectangles = paths.filter(
        (path) => path.pathType === "rectangle"
      ).length;
      return `${upperCaseFirstLetter(pathType)}${numberOfRectangles + 1}`;
    case "polygon":
      const numberOfPolygons = paths.filter(
        (path) => path.pathType === "polygon"
      ).length;
      return `${upperCaseFirstLetter(pathType)}${numberOfPolygons + 1}`;
    case "line":
      const numberOfLines = paths.filter(
        (path) => path.pathType === "line"
      ).length;
      return `${upperCaseFirstLetter(pathType)}${numberOfLines + 1}`;
    default:
      return `${upperCaseFirstLetter(pathType)}1`;
  }
};

const PathsForm = () => {
  const { map, activeState, paths, setActiveState, terraDrawInstance } = useMapStore(
    (store) => store
  );
  if (
    activeState &&
    (activeState.event === "paths:create" ||
      activeState.event === "paths:update")
  ) {
    const createPath = useMutation(api.maps.paths.createPath);
    const updatePath = useMutation(api.maps.paths.editPath);
    const deletePath = useMutation(api.maps.paths.deletePath);

    const path = activeState.payload;
    const title =
      path.title.length > 0 ? path.title : generateTitle(paths, path.pathType);
    const [inCollections, setInCollections] = React.useState<string[] | null>(
      null
    );
    const [isLoading, setIsLoading] = React.useState(false);

    const form = useForm<z.infer<typeof editSchema>>({
      resolver: zodResolver(editSchema),
      defaultValues: {
        ...path,
        title: title,
        mapId: map._id as Id<"maps">,
        styles: {
          ...fallbackStyle,
          ...path.styles
        }
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

        if (activeState.event === "paths:update" && path) {
          const pathId = path!._id!;
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

          const updatedMarker = updatePath({
            pathId: pathId as Id<"paths">,
            path,
          });

          toast.promise(updatedMarker, {
            loading: "Updating marker...",
            success: async (res) => {
              return "Marker updated successfully!";
            },
            error: "Failed to update marker",
          });
        }

        if (activeState.event === "paths:create") {
          // remove collection_ids from data
          delete data.collection_ids;
          const createdMarker = createPath({
            ...data,
            mapId: map._id as Id<"maps">,
            // collectionIds: cols,
          });

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
      const deletedMarker = deletePath({
        pathId: path!._id as Id<"paths">,
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

    const selectedColor = watch("styles.strokeColor") ?? "#fff";
    const selectedStrokeOpacity = watch("styles.strokeOpacity") ?? 1;
    const selectedStrokeWidth = watch("styles.strokeWidth") ?? 1;
    const selectedFillColor = watch("styles.fillColor") ?? "";
    const selectedFillOpacity = watch("styles.fillOpacity") ?? 1;


    return (
      <div className="p-2 z-10">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader className="flex flex-row items-start justify-center py-2">
              <ShowPathIcon pathType={path.pathType} styles={{
                strokeColor: selectedColor,
                strokeOpacity: selectedStrokeOpacity,
                strokeWidth: selectedStrokeWidth,
                fillColor: selectedFillColor,
                fillOpacity: selectedFillOpacity
              }} />

              <FormField
                control={control}
                name="title"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </DialogHeader>

            <FormField
              control={control}
              name="styles.strokeColor"
              render={({ field }) => {
                let name = selectedColor;

                return (
                  <FormItem>
                    <FormLabel>Stroke Color</FormLabel>
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

            { }
            <FormField
              control={control}
              name="styles.fillColor"
              render={({ field }) => {
                let name = selectedFillColor;

                return (
                  <FormItem>
                    <FormLabel>Fill Color</FormLabel>
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
                                  selectedFillColor == color.hex,
                              }
                            )}
                            style={{ backgroundColor: color.hex }}
                          ></Button>
                        ))}

                        <span className="h-full w-[2px] rounded-md bg-gray-200"></span>

                        <ColorPicker
                          value={{ hex: selectedFillColor, name: name }}
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

            {/* <div className="space-y-2">
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
            </div> */}

            <div
              className={cn(
                "inline-flex items-center justify-between w-11/12  absolute bottom-2 mt-4 ",
                {
                  "justify-end": activeState.event === "paths:create",
                }
              )}
            >
              {activeState.event === "paths:update" && path && (
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
                {activeState.event === "paths:create"
                  ? "Add Marker"
                  : "Save changes"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    );
  }
};

export default PathsForm;
