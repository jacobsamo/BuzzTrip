"use client";
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
import * as React from "react";
import { use } from "react";
import { toast } from "sonner";
import { z } from "zod";
import MapTabForm from "../map-form/map-tab-form";
import { MapFormProvider } from "../map-form/provider";

export interface EditMapModalProps {
  map: Map;
  updateMap?: (map: Partial<Map>) => void;
}

export default function EditMapModal({ updateMap, map }: EditMapModalProps) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-hidden transition-colors focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50">
          Edit Map
        </DialogTrigger>
        <DialogContent className="sm:max-w-8/12 h-8/12">
          <DialogHeader>
            <DialogTitle>Edit Map</DialogTitle>
            <DialogDescription>Start your travel plans here</DialogDescription>
          </DialogHeader>
          <MapForm updateMap={updateMap} setOpen={setOpen} map={map} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen} activeSnapPoint={0.9}>
      <DrawerTrigger className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-hidden transition-colors focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50">
        Edit Map
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Edit Map</DrawerTitle>
          <DrawerDescription>Start your travel plans here</DrawerDescription>
        </DrawerHeader>
        <MapForm updateMap={updateMap} setOpen={setOpen} map={map} />
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
  updateMap,
  setOpen,
  map,
}: EditMapModalProps & { setOpen: (open: boolean) => void }) {
  const { data } = useSession();
  const userId = data?.session.userId;
  const getMapUsersPromise = apiClient.map[":mapId"].users.$get({
    param: { mapId: map.map_id },
  });
  const getMapLabelsPromise = apiClient.map[":mapId"].labels.$get({
    param: { mapId: map.map_id },
  });

  const [mapUsers, mapLabels] = use(
    Promise.all([
      getMapUsersPromise.then((res) => {
        if (res.ok) return res.json();
      }),
      getMapLabelsPromise.then((res) => {
        if (res.ok) return res.json();
      }),
    ])
  );

  const onSubmit = async (data: z.infer<typeof mapsEditSchema>) => {
    try {
      const edit = apiClient.map[":mapId"].$put({
        param: { mapId: map.map_id },
        json: {
          ...data,
          title: data.title,
          description: data.description,
          map_id: map.map_id,
          image: data.image ?? undefined,
        },
      });

      toast.promise(edit, {
        loading: "Updating map...",
        success: async (res) => {
          if (res.status === 200 && updateMap) {
            const d = await res.json();
            updateMap(d);
            setOpen(false);
          }
          return "Map updated successfully";
        },
        error: "Failed to update map",
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <MapFormProvider
      onSubmit={onSubmit}
      initialLabels={mapLabels ?? null}
      initialUsers={
        mapUsers?.map((user) => ({
          ...user.user,
          permission: user.permission,
        })) ?? null
      }
    >
      <MapTabForm />
    </MapFormProvider>
  );
}
