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
import { useMediaQuery } from "@/hooks/use-media-query";
import { Marker } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Form, useSubmit } from "@remix-run/react";
import { Edit, Plus } from "lucide-react";
import * as React from "react";
import { INTENTS } from "../intents";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMapContext } from "../providers/map_provider";
import { lazy, useState } from "react";
import { colors, iconsList } from "@/lib/data";

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
  const { collections, setMarkers, markers } = useMapContext();
  const submit = useSubmit();

  const [selectedIcon, setSelectedIcon] = useState<string>(
    marker?.icon ?? "MdOutlineFolder"
  );

  const [selectedColor, setSelectedColor] = useState(
    marker?.color ?? "#E65200"
  );

  // Function to handle icon selection
  const handleIconSelection = (icon: string) => {
    setSelectedIcon(icon);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Create FormData object
    const formData = new FormData(event.target);

    // Append selected icon value to FormData
    formData.append("color", selectedColor);

    if (mode === "edit" && marker) {
      formData.append("uid", marker.uid);
      formData.append("map_id", marker.map_id);
      formData.append("icon", selectedIcon);
      formData.append("intent", INTENTS.updateMarker);
    } else {
      formData.append("intent", INTENTS.createCollection);
    }

    // Perform your form submission
    submit(formData, {
      method: "post",
      fetcherKey: `collection`,
      navigate: false,
      unstable_flushSync: true,
    });

    const values = Object.fromEntries(formData.entries());
    console.log("Values: ", values);
    if (mode === "edit") {
      // Update collections state
      setMarkers((prev) => {
        const index = prev.findIndex((m) => m.uid === marker!.uid);
        const updated = { ...prev[index], ...values };
        prev[index] = updated;
        return [...prev];
      });
      return;
    } else {
      setMarkers((prev) => [values, ...(prev || [])]);
    }
  };

  const handleDelete = (event) => {
    event.preventDefault();

    // Create FormData object
    const formData = new FormData(event.target);
    formData.append("intent", INTENTS.deleteMarker);
    console.log("Delete: ", formData);
    // Perform your form submission
    submit(formData, {
      method: "delete",
      fetcherKey: `marker:${marker?.uid}`,
      navigate: false,
      unstable_flushSync: true,
    });

    // Delete the marker
    setMarkers((prev) => {
      const index = prev.findIndex((m) => m.uid === marker!.uid);
      prev.splice(index, 1);
      return [...prev];
    });
  };

  return (
    <div>
      <Form
        className={cn("grid items-start gap-4")}
        method="post"
        onSubmit={handleSubmit}
      >
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
          {colors.map((color, index) => {
            return (
              <button
                onClick={() => setSelectedColor(color.hex)}
                key={index}
                className={cn("group h-8 w-8 scale-100 rounded-md", {
                  "h-9 w-9 scale-110 border border-gray-500 shadow-lg":
                    selectedColor == color.hex,
                })}
                style={{ backgroundColor: color.hex }}
                type="button"
              ></button>
            );
          })}
          <Input type="color" name="color" defaultValue={selectedColor} />
        </div>

        <Label htmlFor="icon">Icon</Label>
        <div className="flex flex-wrap gap-2">
          {iconsList.map((icon, index) => (
            <Button
              key={index}
              type="button"
              variant="ghost"
              onClick={() => handleIconSelection(icon)} // Handle icon selection
              className={cn("group text-black", {
                "scale-105 border border-gray-500 shadow-lg":
                  selectedIcon == icon,
              })}
              name="icon"
            >
              <Icon name={icon} size={24} />
            </Button>
          ))}
        </div>

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
          <Button
            aria-label="Create Marker"
            type="submit"
            name="intent"
            value={
              mode == "create" ? INTENTS.createMarker : INTENTS.updateMarker
            }
          >
            {mode === "create" ? "Create" : "Save changes"}
          </Button>
        </Close>
      </Form>

      {mode === "edit" && marker && (
        <Form method="delete" onSubmit={handleDelete}>
          <input type="hidden" name="uid" value={marker.uid} />
          <Close>
            <Button
              aria-label="delete marker"
              variant="destructive"
              type="submit"
            >
              Delete
            </Button>
          </Close>
        </Form>
      )}
    </div>
  );
}
