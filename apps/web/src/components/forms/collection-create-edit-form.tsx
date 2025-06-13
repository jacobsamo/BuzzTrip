import { useMapStore } from "@/components/providers/map-state-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { api } from "@buzztrip/backend/api";
import { Id } from "@buzztrip/backend/dataModel";
import { Collection } from "@buzztrip/backend/types";
import Icon, { otherIconsList } from "@buzztrip/components/icon";
import { useMutation } from "convex/react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

export default function CollectionForm() {
  const { map, activeState, setActiveState } = useMapStore((state) => state);
  if (
    activeState &&
    (activeState.event === "collections:create" ||
      activeState.event === "collections:update")
  ) {
    const collection = activeState.payload;
    const createCollection = useMutation(api.maps.collections.createCollection);
    const editCollection = useMutation(api.maps.collections.editCollection);

    const { register, handleSubmit, watch, control } = useForm<Collection>({
      defaultValues: {
        title: collection?.title || "",
        description: collection?.description || "",
        icon: collection?.icon || "Folder",
        color: collection?.color || "#fff",
      },
    });

    const onSubmit: SubmitHandler<Collection> = async (data: Collection) => {
      try {
        setActiveState(null);
        if (activeState.event === "collections:create") {
          const create = createCollection({
            ...data,
            map_id: map._id as Id<"maps">,
          });

          toast.promise(create, {
            loading: "Creating collection...",
            success: async (res) => {
              return "Collection created successfully!";
            },
            error: "Failed to create collection",
          });
        }

        if (activeState.event === "collections:update" && collection) {
          const edit = editCollection({
            collectionId: collection._id as Id<"collections">,
            collection: {
              ...data,
            },
          });

          toast.promise(edit, {
            loading: "Editing collection...",
            success: async (res) => {
              if (res) {
                return "Collection edited successfully!";
              }
              return "Failed to edit collection";
            },
          });
        }
      } catch (error) {
        console.error(error);
      }
    };

    // const handleDelete = () => {
    //   const deleteCollection = fetch(
    //     `/api/map/${map_id}/collection/${collection?.uid}/delete`,
    //     {
    //       method: "DELETE",
    //     }
    //   );
    //   toast.promise(deleteCollection, {
    //     loading: "Deleting collection...",
    //     success: "Collection deleted successfully",
    //     error: "Failed to delete collection",
    //   });
    // };

    return (
      <div className="p-2">
        <form
          method="post"
          className={cn("flex flex-col gap-4")}
          onSubmit={handleSubmit(onSubmit)} // Listen to form submission event
        >
          <Label htmlFor="title">Title</Label>
          <Input placeholder="Title" {...register("title")} />

          <Controller
            control={control}
            name="icon"
            render={({ field }) => (
              <div className="flex flex-wrap gap-2">
                {otherIconsList.map((icon, index) => {
                  const selectedIcon = watch("icon");

                  return (
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
                  );
                })}
              </div>
            )}
          />

          <Label htmlFor="description">Description</Label>
          <Textarea placeholder="Description" {...register("description")} />

          <Button aria-label="Create collection" type="submit">
            Submit
          </Button>
        </form>

        {activeState.event === "collections:update" && collection && (
          <div className="mt-2">
            {/* <ConfirmDeleteModal type="collection" handleDelete={handleDelete} /> */}
          </div>
        )}
      </div>
    );
  }

  return null;
}
