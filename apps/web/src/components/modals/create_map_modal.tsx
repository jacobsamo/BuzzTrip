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
import { useSession } from "@/lib/auth-client";
import { apiClient } from "@/server/api.client";
import { Map } from "@buzztrip/db/types";
import { mapsEditSchema } from "@buzztrip/db/zod-schemas";
import { useMediaQuery } from "@uidotdev/usehooks";
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
  setMap?: (map: Map | null) => void;
  trigger?: React.ReactNode;
}

export default function CreateMapModal({
  setMap,
  trigger,
}: CreateMapModalProps) {
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
          <MapForm setMap={setMap} setOpen={setOpen} />
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
          <MapForm setMap={setMap} setOpen={setOpen} />
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
  setMap,
  setOpen,
}: CreateMapModalProps & { setOpen: (open: boolean) => void }) {
  const { data } = useSession();
  const userId = data?.session.userId;
  const [users, setUsers] = useState<RefinedUserWithPermission[] | null>(null);

  const onSubmit = async (data: z.infer<typeof mapsEditSchema>) => {
    if (!userId) {
      toast.error("Please sign in to create a map");
      return;
    }
    try {
      const newUsers =
        users?.map((user) => {
          return {
            user_id: user.id,
            permission: user.permission,
          };
        }) ?? null;

      const create = apiClient.map.create.$post({
        json: {
          map: {
            ...data,
            owner_id: userId!,
          },
          users: newUsers,
        },
      });

      toast.promise(create, {
        loading: "Creating map...",
        success: async (res) => {
          if (res.status === 200 && setMap) {
            const d = await res.json();
            setMap(d.map ?? null);
            setOpen(false);
          }
          return "Map created successfully!";
        },
        error: "Failed to create map",
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <MapFormProvider
      formProps={{
        defaultValues: {
          icon: "Map",
          owner_id: userId!,
        },
      }}
      onSubmit={onSubmit}
      setExternalUsers={setUsers}
    >
      <MapStepperForm />
    </MapFormProvider>
  );
}
