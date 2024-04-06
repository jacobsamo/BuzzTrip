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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { Share } from "lucide-react";
import * as React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Tables } from "../../../../../database.types";

export interface ShareMapProps {
  map_id: string;
}

export default function ShareModal({ map_id }: ShareMapProps) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <Button variant="outline">
            <Share /> Share
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Share Map</DialogTitle>
            <DialogDescription>Start your travel plans here</DialogDescription>
          </DialogHeader>
          <ShareMapForm map_id={map_id} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">
          <Share /> Share
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Share Map</DrawerTitle>
          <DrawerDescription>Start your travel plans here</DrawerDescription>
        </DrawerHeader>
        <ShareMapForm map_id={map_id} />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function ShareMapForm({ map_id }: ShareMapProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Tables<"shared_map">>({
    defaultValues: {
      permission: "editor",
      map_id: map_id,
    },
  });

  const onSubmit: SubmitHandler<Tables<"shared_map">> = async (data) => {
    try {
      const share = fetch(`/api/map/${map_id}/share`, {
        method: "PUT",
        body: JSON.stringify(data),
      });

      toast.promise(share, {
        loading: "Updating map...",
        success: "Map updated successfully",
        error: "Failed to update map",
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form
      className={cn("grid items-start gap-4")}
      method="post"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Label htmlFor="email">Email</Label>
      <Input
        type="email"
        id="email"
        {...register("user_id", { required: "Email is required" })}
      />

      <Label htmlFor="permission">Access Type</Label>
      <Select {...register("permission")}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="viewer">Viewer</SelectItem>
          <SelectItem value="editor">Editor</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
        </SelectContent>
      </Select>

      <DialogClose asChild>
        <DrawerClose asChild>
          <Button aria-label="Share map" type="submit">
            Share
          </Button>
        </DrawerClose>
      </DialogClose>
    </form>
  );
}
