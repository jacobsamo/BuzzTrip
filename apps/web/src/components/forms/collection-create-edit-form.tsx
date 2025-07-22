import { useMapStore } from "@/components/providers/map-state-provider";
import { Button } from "@/components/ui/button";
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
import { cn } from "@/lib/utils";
import { api } from "@buzztrip/backend/api";
import { Id } from "@buzztrip/backend/dataModel";
import { Collection } from "@buzztrip/backend/types";
import { useMutation } from "convex/react";
import { SubmitHandler, useForm } from "react-hook-form";
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

    const form = useForm<Collection>({
      defaultValues: {
        title: collection?.title || "",
        description: collection?.description || "",
        icon: collection?.icon || "Folder",
        color: collection?.color || "#fff",
      },
    });

    const { control, handleSubmit } = form;

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
            collection: data,
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
      <div className="p-2 z-10  ">
        <Form {...form}>
          <form
            method="post"
            className={cn("flex flex-col gap-4")}
            onSubmit={handleSubmit(onSubmit)} // Listen to form submission event
          >
            <FormField
              control={control}
              name="title"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input {...field} placeholder="Title" />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value ?? undefined}
                      placeholder="Description"
                    />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button aria-label="Create collection" type="submit">
              Submit
            </Button>
          </form>
        </Form>
      </div>
    );
  }

  return null;
}
