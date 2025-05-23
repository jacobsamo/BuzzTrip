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
import { Form } from "@/components/ui/form";
import { apiClient } from "@/server/api.client";
import { Map } from "@buzztrip/db/types";
import { mapsEditSchema } from "@buzztrip/db/zod-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMediaQuery } from "@uidotdev/usehooks";
import { Plus } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useSession } from "@/lib/auth-client";

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
        <DialogTrigger asChild>
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" /> Create Map
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Map</DialogTitle>
            <DialogDescription>Start your travel plans here</DialogDescription>
          </DialogHeader>
          <MapForm updateMap={updateMap} setOpen={setOpen} map={map} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">
          <Plus className="mr-2 h-4 w-4" /> Create Map
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Create Map</DrawerTitle>
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
  const {data} = useSession();
  const userId = data?.session.userId;
  const form = useForm<z.infer<typeof mapsEditSchema>>({
    resolver: zodResolver(mapsEditSchema),
    defaultValues: {
      owner_id: userId!,
    },
  });

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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}></form>
    </Form>
  );
}
