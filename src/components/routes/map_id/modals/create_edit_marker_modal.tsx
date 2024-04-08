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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useMediaQuery } from "@/hooks/use-media-query";
import { colors, iconsList } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Marker } from "@/types";
import { Edit, Plus } from "lucide-react";
import * as React from "react";
import { lazy } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useMapContext } from "../providers/map_provider";

const Icon = lazy(() => import("@/components/ui/icon"));

export interface MarkerModalProps {
  mode?: "create" | "edit";
  marker?: Marker | null;
}

export default function MarkerModal({
  mode = "create",
  marker = null,
}: MarkerModalProps) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            {mode == "create" ? (
              <>
                <Plus /> Marker
              </>
            ) : (
              <Edit />
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {mode == "create" ? "Create" : "Edit"} Marker
            </DialogTitle>
            <DialogDescription>Start your travel plans here</DialogDescription>
          </DialogHeader>
          <MarkerForm mode={mode} marker={marker} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">
          {mode == "create" ? (
            <>
              <Plus /> Marker
            </>
          ) : (
            <Edit />
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>
            {mode == "create" ? "Create" : "Edit"} Marker
          </DrawerTitle>
          <DrawerDescription>Start your travel plans here</DrawerDescription>
        </DrawerHeader>
        <MarkerForm mode={mode} marker={marker} />
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

function MarkerForm({ mode, marker }: MarkerModalProps) {
  const { collections, setMarkers } = useMapContext();

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<Marker>({
    defaultValues: {
      title: marker?.title ?? "",
      description: marker?.description ?? undefined,
      icon: marker?.icon ?? "MdOutlineFolder",
      color: marker?.color ?? "#00000",
      collection_id: marker?.collection_id ?? undefined,
    },
  });

  const onSubmit: SubmitHandler<Marker> = async (data) => {
    try {
      if (mode === "create") {
        const create = fetch("/api/marker", {
          method: "POST",
          body: JSON.stringify(data),
        });

        toast.promise(create, {
          loading: "Creating marker...",
          success: (res) => {
            if (res.ok) {
              res.json().then((val) => {
                console.log(val.data);
                setMarkers((prev) => [val!.data, ...(prev || [])]);
              });
            }

            return "Marker created successfully!";
          },
          error: "Failed to create marker",
        });
      } else {
        const edit = fetch(`/api/marker/${marker!.uid}/edit`, {
          method: "PUT",
          body: JSON.stringify(data),
        });

        toast.promise(edit, {
          loading: "Editing marker...",
          success: (res) => {
            if (res.ok) {
              res.json().then((val) => {
                setMarkers((prev) => {
                  const index = prev.findIndex((m) => m.uid === marker!.uid);
                  const updatedCollection = { ...prev[index], ...val!.data };
                  prev[index] = updatedCollection;
                  return [...prev];
                });
              });
            }

            return "Marker edited successfully!";
          },
          error: "Failed to edit marker",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = () => {
    const deleteCollection = fetch(`/api/marker/${marker!.uid}`, {
      method: "DELETE",
    });

    toast.promise(deleteCollection, {
      loading: "Deleting marker...",
      success: "Markker deleted successfully",
      error: "Failed to delete marker",
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          <Label htmlFor="title">Title</Label>
          <Input
            type="text"
            id="title"
            name="title"
            placeholder="Roadtrip"
            defaultValue={marker?.title}
          />
        </div>

        <Label>Color</Label>

        <div className="flex flex-wrap gap-2">
          <Controller
            control={control}
            name="color"
            render={({ field }) => {
              const selectedColor = watch("color");
              return (
                <>
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
                  <Input type="color" value={field.value ?? '#000'} onChange={field.onChange} />

                </>
              );
            }}
          />
        </div>

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

        <Label htmlFor="collection_id">Collection</Label>
        <Select name="collection_id" defaultValue={marker?.collection_id}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a collections" />
          </SelectTrigger>
          <SelectContent>
            {collections &&
              collections.map((collection, index) => {
                return (
                  <SelectItem key={index} value={collection.uid}>
                    {collection.title}
                  </SelectItem>
                );
              })}
          </SelectContent>
        </Select>

        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            placeholder=""
            defaultValue={marker?.description ?? ""}
          />
        </div>

        {marker && <input type="hidden" name="uid" value={marker.uid} />}

        <Close>
          <Button aria-label="Create Marker" type="submit">
            {mode === "create" ? "Create" : "Save changes"}
          </Button>
        </Close>
      </form>

      {mode === "edit" && marker && (
        <Close>
          <Button
            aria-label="delete marker"
            variant="destructive"
            type="submit"
            onClick={() => handleDelete()}
          >
            Delete
          </Button>
        </Close>
      )}
    </div>
  );
}
