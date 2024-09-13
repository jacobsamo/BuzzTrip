import { popularIconsList } from "@/components/icon";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { colors } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Marker, NewMarker } from "@/types";
import { useMediaQuery } from "@uidotdev/usehooks";
import { Edit, Plus } from "lucide-react";
import * as React from "react";
import { lazy } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import IconPickerModal from "../icon-picker-modal";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createMarker } from "@/actions/map/marker/create-marker";
import { toast } from "sonner";

const Icon = lazy(() => import("@/components/icon"));

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
          <Button variant="ghost">
            {mode == "create" ? (
              <>
                <Plus className="h-6 w-6" /> Marker
              </>
            ) : (
              <Edit className="h-6 w-6" />
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
        <Button variant="ghost">
          {mode == "create" ? (
            <>
              <Plus className="h-6 w-6" /> Marker
            </>
          ) : (
            <Edit className="h-6 w-6" />
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
  const { collections, setMarkers, map } = useMapStore((store) => store);

  const form = useForm<Marker>({
    defaultValues: {
      title: marker?.title ?? "",
      note: marker?.note ?? undefined,
      icon: marker?.icon ?? "MapPin",
      color: marker?.color ?? "#00000",
      collection_id: marker?.collection_id ?? undefined,
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = form;

  const onSubmit: SubmitHandler<Marker> = async (data) => {
    try {
      if (mode === "create") {
        const create = createMarker({ marker: data });

        toast.promise(create, {
          loading: "Creating marker...",
          success: (data) => {
            if (data && data.data) {
              setMarkers(data.data.markers);
            }
            return "Marker created successfully!";
          },
          error: "Failed to create marker",
        });
      } else {
        // const edit = fetch(`/api/map/${map!.uid}/marker/${marker!.uid}/edit`, {
        //   method: "PUT",
        //   body: JSON.stringify(data),
        // });
        // toast.promise(edit, {
        //   loading: "Editing marker...",
        //   success: (res) => {
        //     if (res.ok) {
        //       res.json().then((val) => {
        //         setMarkers((prev) => {
        //           if (prev) {
        //             const index = prev.findIndex((m) => m.uid === marker!.uid);
        //             const updatedCollection = {
        //               ...prev[index],
        //               ...(val as { data: any })!.data,
        //             };
        //             prev[index] = updatedCollection;
        //             return [...prev];
        //           }
        //           return [];
        //         });
        //       });
        //     }
        //     return "Marker edited successfully!";
        //   },
        //   error: "Failed to edit marker",
        // });
      }
    } catch (error) {
      console.error(error);
    }
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

  return (
    <div>
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
            name="icon"
            render={({ field }) => {
              const selectedIcon = watch("icon");

              return (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <div className="flex flex-wrap gap-2">
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
                        selectedIcon={watch("icon")}
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

          <FormField
            control={control}
            name="collection_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Collection</FormLabel>
                <FormControl>
                  <Select
                    name="collection_id"
                    defaultValue={field.value ?? undefined}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a collections" />
                    </SelectTrigger>
                    <SelectContent>
                      {collections &&
                        collections.map((collection, index) => {
                          return (
                            <SelectItem
                              key={index}
                              value={collection.collection_id!}
                            >
                              {collection.title}
                            </SelectItem>
                          );
                        })}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="note"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} value={field.value ?? undefined} />
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />

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
      </Form>
    </div>
  );
}
