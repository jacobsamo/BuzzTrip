"use client";
import { mapFormSchema } from "@/components/map-form/helpers";
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
import { Form } from "@/components/ui/form";
import { apiClient } from "@/server/api.client";
import { Map } from "@buzztrip/db/types";
import { useAuth } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMediaQuery } from "@uidotdev/usehooks";
import { Plus } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export interface CreateMapModalProps {
  setMap?: (map: Map | null) => void;
}

export default function CreateMapModal({ setMap }: CreateMapModalProps) {
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
        <DialogContent className="h-10/12 justify-start items-start space-y-2">
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
    <Drawer open={open} onOpenChange={setOpen} activeSnapPoint={1}>
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
  const { userId } = useAuth();
  const form = useForm<z.infer<typeof mapFormSchema>>({
    resolver: zodResolver(mapFormSchema),
    defaultValues: {
      map: {
        owner_id: userId!,
        bounds: null,
        lat: null,
        lng: null,
        icon: "Map",
      },
    },
  });

  const {
    formState: { errors },
  } = form;

  const onSubmit = async (data: z.infer<typeof mapFormSchema>) => {
    try {
      const { map, users } = data;

      const newUsers =
        users?.map((user) => {
          return {
            user_id: user.user_id,
            permission: user.permission,
          };
        }) ?? null;

      const create = apiClient.map.create.$post({
        json: {
          map: {
            ...map,
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
            setMap(d.map);
            setOpen(false);
          }
          return "Map created successfully!";
        },
        error: "Failed to create map",
      });

      //     if (!users || users.length == 0) return;

      // const newUsers = users.map((user) => {
      //   return {
      //     user_id: user.user_id,
      //     permission: user.permission,
      //   };
      // });

      // const share = apiClient.map[":mapId"].share.$post({
      //   param: { mapId: map_id },
      //   json: {
      //     users: newUsers,
      //     mapId: map_id,
      //   },
      // });

      // toast.promise(share, {
      //   loading: "sharing map...",
      //   success: "Shared map successfully",
      //   error: (err) => {
      //     console.error(err);
      //     return "Failed to share map";
      //   },
      // });
      // };
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    console.log("errors", errors);
  }, [errors]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <MapStepperForm onSubmit={form.handleSubmit(onSubmit)} />
      </form>
    </Form>
  );
}
