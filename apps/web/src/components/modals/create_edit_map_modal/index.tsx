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
import { CreateMapSchema } from "@buzztrip/api/src/routes/map/schema";
import { Map } from "@buzztrip/db/types";
import { useAuth } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMediaQuery } from "@uidotdev/usehooks";
import { Plus } from "lucide-react";
import * as React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { mapsEditSchema } from "@buzztrip/db/zod-schemas";

type EditMap = {
  mode: "edit";
  map: Map;
  updateMap: (map: Partial<Map>) => void;
};

type CreateMap = {
  mode: "create";
  setMap: (map: Map | null) => void;
};

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
          <MapForm
            mode={mode}
            map={map}
            setMap={setMap}
            updateMap={updateMap}
          />
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
        <MapForm mode={mode} map={map} setMap={setMap} updateMap={updateMap} />
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
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return isDesktop ? (
    <DialogClose asChild>{children}</DialogClose>
  ) : (
    <DrawerClose asChild>{children}</DrawerClose>
  );
};

function MapForm({ mode, map, setMap, updateMap }: MapModalProps) {
  const { userId } = useAuth();
  const form = useForm<z.infer<typeof mapsEditSchema>>({
    resolver: zodResolver(mapsEditSchema),
    defaultValues: {
      title: map?.title ?? "",
      description: map?.description ?? undefined,
      owner_id: userId!,
    },
    shouldUnregister: true,
  });

  const {
    register,
    handleSubmit,
    getValues,
    control,
    formState: { errors },
  } = form;

  React.useEffect(() => {
    console.log("Errors: ", {
      errors,
      values: getValues(),
      ui: userId,
    });
  }, [errors]);

  const onSubmit: SubmitHandler<z.infer<typeof mapsEditSchema>> = async (
    data
  ) => {
    try {
      console.log("data: ", data);
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
            if (res.status == 200 && setMap) {
              const d = await res.json();
              setMap(d.map);
            }
            return "Map created successfully!";
          },
          error: "Failed to create map",
        });
      }

      if (mode === "edit" && map) {
        console.log("map: ", map);
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
            if (res.status == 200 && updateMap) {
              const d = await res.json();
              console.log("updated", d);
              updateMap(d);
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
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <input type="hidden" {...register("owner_id", { value: userId! })} />

        <FormField
          control={control}
          name="title"
          rules={{ required: true }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl className="flex">
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl className="flex">
                <Textarea {...field} value={field?.value ?? undefined} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Close>
          <Button
            aria-label="create map"
            type="submit"
            onClick={handleSubmit(onSubmit)}
          >
            {mode == "create" ? "Create" : "Update"} Map
          </Button>
        </Close>
      </form>
    </Form>
  );
}
