import ConfirmDeleteModal from "@/components/shared/modals/comfirm_delete_modal";
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
import Icon from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMediaQuery } from "@/hooks/use-media-query";
import { iconsList } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Collection } from "@/types";
import { Edit, Plus } from "lucide-react";
import * as React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useMapContext } from "../providers/map_provider";

interface CollectionModalProps {
  triggerType?: "icon" | "text";
  mode?: "create" | "edit";
  collection?: Collection | null;
  map_id: string;
}

export default function CollectionModal({
  mode = "create",
  collection = null,
  triggerType = "text",
  map_id,
}: CollectionModalProps) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            {triggerType == "text" && mode == "create" ? (
              <>
                <Plus /> Create Collection
              </>
            ) : (
              <Edit />
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
          <CollectionForm mode={mode} collection={collection} map_id={map_id} />
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
        <CollectionForm mode={mode} collection={collection} map_id={map_id} />
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
  return (
    <DialogClose asChild>
      <DrawerClose asChild>{children}</DrawerClose>
    </DialogClose>
  );
};

function CollectionForm({ mode, collection, map_id }: CollectionModalProps) {
  const { setCollections } = useMapContext();

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<Collection>({
    defaultValues: {
      title: collection?.title || "",
      description: collection?.description || "",
      icon: collection?.icon || "map-pin",
      color: collection?.color || "#fff",
    },
  });

  const onSubmit: SubmitHandler<Collection> = async (data: Collection) => {
    try {
      if (mode === "create") {
        const newCollection = {
          ...data,
          color: "#fff",
          map_id: map_id,
        };

        const create = fetch("/api/collection", {
          method: "POST",
          body: JSON.stringify(newCollection),
        });

        toast.promise(create, {
          loading: "Create collection...",
          success: (res) => {
            if (res.ok) {
              res.json().then((val) => {
                console.log("returned val: ", val);
                setCollections((prev) => [
                  (val as { data: any }).data,
                  ...(prev || []),
                ]);
              });
            }

            return "Collection created successfully!";
          },
          error: "Failed to created collection",
        });
      }

      if (mode === "edit" && collection) {
        const edit = fetch(`/api/collection/${collection.uid}/edit`, {
          method: "PUT",
          body: JSON.stringify(data),
        });

        toast.promise(edit, {
          loading: "Editing collection...",
          success: (res) => {
            if (res.ok) {
              res.json().then((val) => {
                setCollections((prev) => {
                  if (prev) {
                    const index = prev.findIndex(
                      (c) => c.uid === collection!.uid
                    );
                    const updatedCollection = {
                      ...prev[index],
                      ...(val as { data: any }).data,
                    };
                    prev[index] = updatedCollection;
                    return [...prev];
                  }
                  return [];
                });
              });
            }

            return "Collection edited successfully!";
          },
          error: "Failed to edit collection",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = () => {
    const deleteCollection = fetch(
      `/api/collection/${collection?.uid}/delete`,
      {
        method: "DELETE",
      }
    );

    toast.promise(deleteCollection, {
      loading: "Deleting collection...",
      success: "Collection deleted successfully",
      error: "Failed to delete collection",
    });
  };

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
              {iconsList.map((icon, index) => {
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
        <ConfirmDeleteModal type="collection" handleDelete={handleDelete} />
      )}
    </div>
  );
}
