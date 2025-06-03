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
import { Label, Map, NewLabel } from "@buzztrip/backend/types";
import { mapsEditSchema } from "@buzztrip/backend/zod-schemas";
import { useMediaQuery } from "@uidotdev/usehooks";
import * as React from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import MapTabForm from "../map-form/map-tab-form";
import {
  MapFormProvider,
  RefinedUserWithPermission,
} from "../map-form/provider";

export interface EditMapModalProps {
  map: Map;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function EditMapModal({
  map,
  open: controlledOpen,
  onOpenChange,
}: EditMapModalProps) {
  const isControlled = controlledOpen !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const setOpen = isControlled
    ? (onOpenChange ?? (() => {}))
    : setUncontrolledOpen;
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const Trigger = () =>
    isControlled ? null : isDesktop ? (
      <DialogTrigger className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-hidden transition-colors focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50">
        Edit Map
      </DialogTrigger>
    ) : (
      <DrawerTrigger className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-hidden transition-colors focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50">
        Edit Map
      </DrawerTrigger>
    );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <Trigger />
        <DialogContent className="sm:max-w-8/12 h-8/12">
          <DialogHeader>
            <DialogTitle>Edit Map</DialogTitle>
            <DialogDescription>Start your travel plans here</DialogDescription>
          </DialogHeader>
          <MapForm setOpen={setOpen} map={map} />
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
      <Trigger />
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Edit Map</DrawerTitle>
          <DrawerDescription>Start your travel plans here</DrawerDescription>
        </DrawerHeader>
        <MapForm setOpen={setOpen} map={map} />
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
  map,
}: EditMapModalProps & { setOpen: (open: boolean) => void }) {
  const { data } = useSession();
  const userId = data?.session.userId;
  const [mapUsers, setMapUsers] = useState<RefinedUserWithPermission[] | null>(
    null
  );
  const [mapLabels, setMapLabels] = useState<Label[] | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const fetchData = async () => {
      try {
        const [mu, ml] = await Promise.all([
          apiClient.map[":mapId"].users
            .$get({
              param: { mapId: map._id },
            })
            .then((res) => {
              if (res && res.ok) return res.json();
              return null;
            }),
          apiClient.map[":mapId"].labels
            .$get({
              param: { mapId: map._id },
            })
            .then((res) => {
              if (res && res.ok) return res.json();
              return null;
            }),
        ]);

        if (!isCancelled) {
          setMapUsers(
            mu?.map((user) => ({
              ...user.user,
              permission: user.permission,
            })) ?? null
          );
          setMapLabels(ml);
        }
      } catch (error) {
        console.error("Failed to fetch map data:", error);
      }
    };

    fetchData();

    return () => {
      isCancelled = true;
    };
  }, [map.map_id]); // Add only necessary dependencies

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
          if (res.status === 200) {
            const d = await res.json();
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

  const handleUserCreate = async (user: RefinedUserWithPermission) => {
    const create = apiClient.map[":mapId"].users.$post({
      param: { mapId: map.map_id },
      json: {
        mapId: map.map_id,
        users: [{ ...user, user_id: user.id }],
      },
    });

    toast.promise(create, {
      loading: "creating user...",
      success: "User created successfully",
      error: "Failed to create user",
    });
  };

  const handleRemoveUser = async (userId: string) => {
    const remove = apiClient.map[":mapId"].users[":userId"].$delete({
      param: { mapId: map.map_id, userId: userId },
    });

    toast.promise(remove, {
      loading: "removing user...",
      success: "User removed successfully",
      error: "Failed to remove user",
    });
  };

  const handleUpdateUser = async (
    userId: string,
    user: RefinedUserWithPermission
  ) => {
    const update = apiClient.map[":mapId"].users[":userId"].$put({
      param: { mapId: map.map_id, userId: userId },
      json: {
        map_id: map.map_id,
        user_id: userId,
        permission: user.permission,
      },
    });

    toast.promise(update, {
      loading: "updating user...",
      success: "User updated successfully",
      error: "Failed to update user",
    });
  };

  const handleLabelCreate = async (label: NewLabel) => {
    const create = apiClient.map[":mapId"].labels.$post({
      param: { mapId: map.map_id },
      json: label,
    });

    toast.promise(create, {
      loading: "creating label...",
      success: "Label created successfully",
      error: "Failed to create label",
    });
  };

  const handleLabelUpdate = async (labelId: string, label: NewLabel) => {
    const update = apiClient.map[":mapId"].labels[":labelId"].$put({
      param: { mapId: map.map_id, labelId: labelId },
      json: {
        ...label,
      },
    });

    toast.promise(update, {
      loading: "updating label...",
      success: "Label updated successfully",
      error: "Failed to update label",
    });
  };

  const handleLabelDelete = async (labelId: string) => {
    const deleteLabel = apiClient.map[":mapId"].labels[":labelId"].$delete({
      param: { mapId: map.map_id, labelId: labelId },
    });

    toast.promise(deleteLabel, {
      loading: "deleting label...",
      success: "Label deleted successfully",
      error: "Failed to delete label",
    });
  };

  return (
    <MapFormProvider
      onSubmit={onSubmit}
      initialLabels={mapLabels}
      initialUsers={mapUsers}
      formProps={{
        defaultValues: {
          ...map,
        },
      }}
      onUserChange={({ event, payload }) => {
        switch (event) {
          case "user:added":
            handleUserCreate(payload);
            break;
          case "user:removed":
            handleRemoveUser(payload);
            break;
          case "user:updated":
            handleUpdateUser(payload.userId, payload.user);
            break;
        }
      }}
      onLabelChange={({ event, payload }) => {
        switch (event) {
          case "label:added":
            handleLabelCreate(payload);
            break;
          case "label:removed":
            handleLabelDelete(payload);
            break;
          case "label:updated":
            handleLabelUpdate(payload.labelId, payload.label);
            break;
        }
      }}
    >
      <MapTabForm />
    </MapFormProvider>
  );
}
