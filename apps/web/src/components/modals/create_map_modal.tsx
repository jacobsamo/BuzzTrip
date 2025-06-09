"use client";
import MapStepperForm from "@/components/map-form/map-stepper";
import { Button } from "@/components/ui/button";
import {
  Dialog,
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
import { api } from "@buzztrip/backend/api";
import { Id } from "@buzztrip/backend/dataModel";
import { mapsEditSchema } from "@buzztrip/backend/zod-schemas";
import { useMediaQuery } from "@uidotdev/usehooks";
import { useMutation } from "convex/react";
import { Plus } from "lucide-react";
import * as React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import {
  MapFormProvider,
  RefinedUserWithPermission,
} from "../map-form/provider";

export interface CreateMapModalProps {
  trigger?: React.ReactNode;
}

export default function CreateMapModal({ trigger }: CreateMapModalProps) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {trigger ? (
            trigger
          ) : (
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" /> Create Map
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="relative h-10/12 justify-start items-start space-y-2">
          <DialogHeader>
            <DialogTitle>Create Map</DialogTitle>
            <DialogDescription>Start your travel plans here</DialogDescription>
          </DialogHeader>
          <MapForm setOpen={setOpen} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
      activeSnapPoint={0.9}
      snapPoints={[0.5, 0.75, 0.9]}
    >
      <DrawerTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" /> Create Map
          </Button>
        )}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Create Map</DrawerTitle>
          <DrawerDescription>Start your travel plans here</DrawerDescription>
        </DrawerHeader>
        <MapForm setOpen={setOpen} />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function MapForm({
  setOpen,
}: CreateMapModalProps & { setOpen: (open: boolean) => void }) {
  const [users, setUsers] = useState<RefinedUserWithPermission[] | null>(null);
  const createMap = useMutation(api.maps.index.createMap);

  const onSubmit = async (data: z.infer<typeof mapsEditSchema>) => {
    try {
      const newUsers =
        users?.map((user) => {
          return {
            user_id: user._id as Id<"users">,
            permission: user.permission,
          };
        }) ?? undefined;

      const create = createMap({
        users: newUsers,
        map: {
          ...data,
          description: data.description ?? undefined,
          title: data.title ?? undefined,
          image: data.image ?? undefined,
          icon: data.icon ?? "Map",
          color: data.color ?? undefined,
          visibility: data.visibility ?? "private",
          lat: data.lat ?? undefined,
          lng: data.lng ?? undefined,
          location_name: data.location_name ?? undefined,
          bounds: data.bounds ?? undefined,
        },
      });

      toast.promise(create, {
        loading: "Creating map...",
        success: async (res) => {
          return "Map created successfully!";
        },
        error: "Failed to create map",
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <MapFormProvider onSubmit={onSubmit} setExternalUsers={setUsers}>
      <MapStepperForm />
    </MapFormProvider>
  );
}
