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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { apiClient } from "@/server/api.client";
import { Map } from "@buzztrip/db/types";
import { mapsEditSchema } from "@buzztrip/db/zod-schemas";
import { useAuth } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMediaQuery } from "@uidotdev/usehooks";
import { Plus } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import MapStepperForm from "@/components/map-form";
//   mode: "edit";
//   map: Map;
//   updateMap: (map: Partial<Map>) => void;
// };

// type CreateMap = {
//   mode: "create";
//   setMap: (map: Map | null) => void;
// };

export interface MapModalProps {
  mode?: "create" | "edit";
  map?: Map | null;
  setMap?: (map: Map | null) => void;
  updateMap?: (map: Partial<Map>) => void;
}

export default function MapModal({
  mode = "create",
  map = null,
  setMap,
  updateMap,
}: MapModalProps) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" />{" "}
            {mode === "create" ? "Create" : "Edit"} Map
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {mode === "create" ? "Create" : "Edit"} Map
            </DialogTitle>
            <DialogDescription>Start your travel plans here</DialogDescription>
          </DialogHeader>
          <MapForm
            mode={mode}
            map={map}
            setMap={setMap}
            updateMap={updateMap}
            setOpen={setOpen}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">
          <Plus className="mr-2 h-4 w-4" />{" "}
          {mode === "create" ? "Create" : "Edit"} Map
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{mode === "create" ? "Create" : "Edit"} Map</DrawerTitle>
          <DrawerDescription>Start your travel plans here</DrawerDescription>
        </DrawerHeader>
        <MapForm
          mode={mode}
          map={map}
          setMap={setMap}
          updateMap={updateMap}
          setOpen={setOpen}
        />
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
  mode,
  map,
  setMap,
  updateMap,
  setOpen,
}: MapModalProps & { setOpen: (open: boolean) => void }) {
  const { userId } = useAuth();
  const form = useForm<z.infer<typeof mapsEditSchema>>({
    resolver: zodResolver(mapsEditSchema),
    defaultValues: {
      title: map?.title ?? "",
      description: map?.description ?? undefined,
      owner_id: userId!,
    },
  });

  const onSubmit = async (data: z.infer<typeof mapsEditSchema>) => {
    try {
      if (mode === "create") {
        const create = apiClient.map.create.$post({
          json: {
            ...data,
            userId: userId!,
          },
        });

        toast.promise(create, {
          loading: "Creating map...",
          success: async (res) => {
            if (res.status === 200 && setMap) {
              const d = await res.json();
              setMap(d.map);
              setOpen(false);
            }
            return "Map created successfully!";
          },
          error: "Failed to create map",
        });
      }

      if (mode === "edit" && map) {
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
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <MapStepperForm
      form={form}
      map_id={map?.map_id}
      onSubmit={form.handleSubmit(onSubmit)}
    />
  );
}
