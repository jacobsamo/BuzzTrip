"use client";
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
import { cn } from "@/lib/utils";
import { Map } from "@/types";
import { Plus } from "lucide-react";
import * as React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

export interface MapModalProps {
  mode?: "create" | "edit";
  map?: Map | null;
}

export default function MapModal({
  mode = "create",
  map = null,
}: MapModalProps) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Plus /> {mode == "create" ? "Create" : "Edit"} Map
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {mode == "create" ? "Create" : "Edit"} Map
            </DialogTitle>
            <DialogDescription>Start your travel plans here</DialogDescription>
          </DialogHeader>
          <MapForm mode={mode} map={map} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">
          <Plus /> {mode == "create" ? "Create" : "Edit"} Map
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{mode == "create" ? "Create" : "Edit"} Map</DrawerTitle>
          <DrawerDescription>Start your travel plans here</DrawerDescription>
        </DrawerHeader>
        <MapForm mode={mode} map={map} />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function MapForm({ mode, map }: MapModalProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Map>({
    defaultValues: {
      title: map?.title || "",
      description: map?.description || "",
    },
  });

  const onSubmit: SubmitHandler<Map> = async (data) => {
    try {
      if (mode === "create") {
        const create = fetch("/api/map", {
          method: "POST",
          body: JSON.stringify(data),
        });

        toast.promise(create, {
          loading: "Creating map...",
          success: "Map created successfully!",
          error: "Failed to create map",
        });
      }

      if (mode === "edit" && map) {
        const edit = fetch(`/api/map/${map.uid}`, {
          method: "PUT",
          body: JSON.stringify(data),
        });

        toast.promise(edit, {
          loading: "Updating map...",
          success: "Map updated successfully",
          error: "Failed to update map",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form
      className={cn("grid items-start gap-4")}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid gap-2">
        <Label htmlFor="title">Title</Label>
        <Input type="text" placeholder="Roadtrip" {...register("title")} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea placeholder="epic roadtrip!!" {...register("description")} />
      </div>

      <div>
        <Label htmlFor="location">Location</Label>
        <Input type="search" value={'test'} onChange={() => {}} />
      </div>

      <DialogClose asChild>
        <DrawerClose asChild>
          <Button aria-label="create map" type="submit">
            Create Map
          </Button>
        </DrawerClose>
      </DialogClose>
    </form>
  );
}
