// import ConfirmDeleteModal from "@/components/shared/modals/comfirm_delete_modal";
import { useMapStore } from "@/components/providers/map-state-provider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { api } from "@buzztrip/backend/api";
import { Id } from "@buzztrip/backend/dataModel";
import { Collection } from "@buzztrip/backend/types";
import Icon, { otherIconsList } from "@buzztrip/components/icon";
import { useMediaQuery } from "@uidotdev/usehooks";
import { useMutation } from "convex/react";
import { Edit, Plus } from "lucide-react";
import * as React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

interface CollectionModalProps {
  triggerType?: "icon" | "text";
  mode?: "create" | "edit";
  collection?: Collection | null;
}

export default function CollectionModal({
  mode = "create",
  collection = null,
  triggerType = "text",
}: CollectionModalProps) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost">
            {triggerType == "text" && mode == "create" ? (
              <>
                <Plus className="h-6 w-6" /> Create Collection
              </>
            ) : (
              <Edit className="h-6 w-6" />
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {mode == "create" ? "Create" : "Edit"} Collection
            </DialogTitle>
            <DialogDescription>Start your travel plans here</DialogDescription>
          </DialogHeader>
          <CollectionForm mode={mode} collection={collection} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">
          {triggerType == "text" && mode == "create" ? (
            <>
              <Plus /> Create Collection
            </>
          ) : (
            <Edit />
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>
            {mode == "create" ? "Create" : "Edit"} Collection
          </DrawerTitle>
          <DrawerDescription>Start your travel plans here</DrawerDescription>
        </DrawerHeader>
        <CollectionForm mode={mode} collection={collection} />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

const Close = ({ children }: { children: React.ReactNode }) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return isDesktop ? (
    <DialogClose asChild>{children}</DialogClose>
  ) : (
    <DrawerClose asChild>{children}</DrawerClose>
  );
};

function CollectionForm({ mode, collection }: CollectionModalProps) {
  const { map } = useMapStore((store) => store);
  const { data } = useSession();
  const userId = data?.session.userId;
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
      if (mode === "create") {
        // const create = apiClient.map[":mapId"].collection.create.$post({
        //   param: { mapId: map!.map_id },
        //   json: {
        //     ...data,
        //     created_by: userId!,
        //     map_id: map!.map_id,
        //   },
        // });

        const create = createCollection({
          ...data,
          map_id: map._id as Id<"maps">,
          created_by: userId as Id<"users">,
        });

        toast.promise(create, {
          loading: "Creating collection...",
          success: async (res) => {
            return "Collection created successfully!";
          },
          error: "Failed to create collection",
        });
      }

      if (mode === "edit" && collection) {
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

      // if (mode === "edit" && collection) {}
      // const edit = fetch(`/api/map/${map_id}/collection/${collection.uid}/edit`, {
      //   method: "PUT",
      //   body: JSON.stringify(data),
      // });
      // toast.promise(edit, {
      //   loading: "Editing collection...",
      //   success: (res) => {
      //     if (res.ok) {
      //       res.json().then((val) => {
      //         setCollections((prev) => {
      //           if (prev) {
      //             const index = prev.findIndex(
      //               (c) => c.uid === collection!.uid
      //             );
      //             const updatedCollection = {
      //               ...prev[index],
      //               ...(val as { data: any }).data,
      //             };
      //             prev[index] = updatedCollection;
      //             return [...prev];
      //           }
      //           return [];
      //         });
      //       });
      //     }
      //     return "Collection edited successfully!";
      //   },
      //   error: "Failed to edit collection",
      // });
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
    <div>
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

        <Close>
          <Button aria-label="Create collection" type="submit">
            Submit
          </Button>
        </Close>
      </form>

      {mode === "edit" && collection && (
        <div className="mt-2">
          {/* <ConfirmDeleteModal type="collection" handleDelete={handleDelete} /> */}
        </div>
      )}
    </div>
  );
}
