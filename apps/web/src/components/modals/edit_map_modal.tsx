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
import { api } from "@buzztrip/backend/api";
import { Id } from "@buzztrip/backend/dataModel";
import { Map, NewLabel } from "@buzztrip/backend/types";
import { mapsEditSchema } from "@buzztrip/backend/zod-schemas";
import { useMediaQuery } from "@uidotdev/usehooks";
import { useMutation, useQuery } from "convex/react";
import * as React from "react";
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
  const userStatus = useQuery(api.users.userLoginStatus);

  const updateMap = useMutation(api.maps.index.updateMap);
  const mapUsers = useQuery(api.maps.mapUsers.getCombinedMapUsers, {
    mapId: map._id as Id<"maps">,
  });
  const createMapUser = useMutation(api.maps.mapUsers.shareMap);
  const updateMapUser = useMutation(api.maps.mapUsers.editMapUser);
  const deleteMapUser = useMutation(api.maps.mapUsers.deleteMapUser);

  const mapLabels = useQuery(api.maps.labels.getMapLabels, {
    mapId: map._id as Id<"maps">,
  });
  const createMapLabel = useMutation(api.maps.labels.createLabel);
  const updateMapLabel = useMutation(api.maps.labels.editLabel);
  const deleteMapLabel = useMutation(api.maps.labels.deleteLabel);

  const userId = userStatus?.user?._id;

  const onSubmit = async (data: z.infer<typeof mapsEditSchema>) => {
    try {
      const edit = updateMap({
        map: {
          ...data,
          title: data.title,
          description: data.description,
          image: data.image ?? undefined,
        },
      });

      toast.promise(edit, {
        loading: "Updating map...",
        success: () => {
          setOpen(false);
          return "Map updated successfully";
        },
        error: "Failed to update map",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleUserCreate = async (user: RefinedUserWithPermission) => {
    const create = createMapUser({
      mapId: map._id as Id<"maps">,
      users: [{ ...user, user_id: user._id as Id<"users"> }],
    });

    toast.promise(create, {
      loading: "creating user...",
      success: "User created successfully",
      error: "Failed to create user",
    });
  };

  const handleRemoveUser = async (userId: string) => {
    const remove = deleteMapUser({
      mapId: map._id as Id<"maps">,
      mapUserId: userId as Id<"map_users">,
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
    const update = updateMapUser({
      map_id: map._id as Id<"maps">,
      user_id: userId as Id<"users">,
      permission: user.permission,
    });

    toast.promise(update, {
      loading: "updating user...",
      success: "User updated successfully",
      error: "Failed to update user",
    });
  };

  const handleLabelCreate = async (label: NewLabel) => {
    const create = createMapLabel({
      label: label,
      mapId: map._id as Id<"maps">,
    });

    toast.promise(create, {
      loading: "creating label...",
      success: "Label created successfully",
      error: "Failed to create label",
    });
  };

  const handleLabelUpdate = async (labelId: string, label: NewLabel) => {
    console.log("label", {
      labelId: labelId,
      label: label,
    });
    const update = updateMapLabel({
      labelId: labelId as Id<"labels">,
      label: label,
    });

    toast.promise(update, {
      loading: "updating label...",
      success: "Label updated successfully",
      error: "Failed to update label",
    });
  };

  const handleLabelDelete = async (labelId: string) => {
    const deleteLabel = deleteMapLabel({
      labelId: labelId as Id<"labels">,
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
      initialUsers={
        mapUsers?.map((user) => ({
          ...user.user,
          permission: user.permission,
        })) ?? null
      }
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
