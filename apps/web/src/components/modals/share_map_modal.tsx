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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { apiClient } from "@/server/api.client";
import { TShareMapUserSchema } from "@buzztrip/db/mutations/maps";
import { PermissionEnum } from "@buzztrip/db/types";
import { useQuery } from "@tanstack/react-query";
import { useMediaQuery } from "@uidotdev/usehooks";
import { Circle, CircleCheck, SearchIcon, Share2, X } from "lucide-react";
import Image from "next/image";
import * as React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { ScrollArea } from "../ui/scroll-area";

export interface ShareMapProps {
  map_id: string;
}

export default function ShareModal({ map_id }: ShareMapProps) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="inline-flex items-center gap-2">
          <Share2 className="mr-2 h-4 w-4" />
          <span>Share</span>
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
      <DrawerTrigger className="inline-flex items-center gap-2">
        <Share2 className="mr-2 h-4 w-4" />
        <span>Share</span>
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

const Close = ({ children }: { children: React.ReactNode }) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return isDesktop ? (
    <DialogClose asChild>{children}</DialogClose>
  ) : (
    <DrawerClose asChild>{children}</DrawerClose>
  );
};

function ShareMapForm({ map_id }: ShareMapProps) {
  const [searchValue, setSearchValue] = useState("");
  const { data: users } = useQuery({
    queryKey: ["search", searchValue],
    queryFn: async () => {
      if (searchValue === "") return undefined;
      const res = await apiClient.users.search.$get({
        query: { q: searchValue },
      });
      console.log("va;ue", res);
      if (res.status == 200) {
        const val = await res.json();
        return val?.users ?? null;
      }

      return null;
    },
  });
  const [selectedUsers, setSelectedUsers] = useState<
    TShareMapUserSchema[] | null
  >(null);

  const handleChange = (user: TShareMapUserSchema) => {
    setSelectedUsers((prev) => {
      if (!prev) return [user];

      const existingUserIndex = prev.findIndex(
        (u) => u.user_id === user.user_id
      );

      if (existingUserIndex !== -1) {
        const updatedUsers = [...prev];
        updatedUsers[existingUserIndex] = user;
        return updatedUsers;
      }

      return [...prev, user];
    });
  };

  const removeUser = (id: string) => {
    setSelectedUsers((prev) =>
      prev ? prev.filter((u) => u.user_id !== id) : null
    );
  };

  const onSubmit = async () => {
    console.log("usesr", selectedUsers);
    if (!selectedUsers || selectedUsers.length == 0) return;

    const share = apiClient.map[":mapId"].share.$post({
      param: { mapId: map_id },
      json: {
        users: selectedUsers,
        mapId: map_id,
      },
    });

    toast.promise(share, {
      loading: "sharing map...",
      success: "Shared map successfully",
      error: (err) => {
        console.error(err);
        return "Failed to share map";
      },
    });
  };

  return (
    <form onSubmit={onSubmit}>
      <div>
        <div className="flex items-center justify-center gap-2 px-3">
          <SearchIcon className="mr-2 h-5 w-5 shrink-0" />

          {/* <Command.Input
            className="flex h-10 w-full rounded-md bg-white py-2 text-base placeholder:text-slate-500 focus:outline-hidden dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
            placeholder="Search users"
            id="search"
            value={searchValue ?? ""}
            onValueChange={(val) => setSearchValue(val)}
          /> */}
          <Input
            aria-label="Search for user by email"
            id="search"
            name="search"
            placeholder="Search by email"
            type="search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />

          {searchValue && (
            <button
              aria-label="clear search results"
              onClick={() => setSearchValue("")}
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      <ScrollArea className="h-36 w-full flex-col gap-2">
        {users &&
          users.map((user) => {
            const userSelected = selectedUsers?.find(
              (u) => u.user_id === user.id
            );

            return (
              <Button
                key={user.id}
                onClick={() => {
                  const userSelected = selectedUsers?.find(
                    (u) => u.user_id === user.id
                  );
                  if (userSelected) {
                    removeUser(user.id);
                  } else {
                    handleChange({
                      user_id: user.id,
                      permission: "editor",
                    });
                  }
                }}
                className={cn("group h-fit w-full justify-between gap-2", {
                  "scale-105": userSelected,
                })}
                type="button"
                variant="ghost"
              >
                {userSelected ? <CircleCheck /> : <Circle />}
                <span className="flex items-center gap-2">
                  {user.image && (
                    <Image
                      width={32}
                      height={32}
                      alt={user.email ?? user.id}
                      src={user.image}
                      className="h-8 w-8 rounded-full"
                      unoptimized
                    />
                  )}
                  {user.email}
                </span>

                <Select
                  defaultValue="editor"
                  value={userSelected ? userSelected.permission : "editor"}
                  onValueChange={(e) => {
                    handleChange({
                      user_id: user.id,
                      permission: (e as PermissionEnum) ?? "editor",
                    });
                  }}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue placeholder="Access Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="viewer">Viewer</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </Button>
            );
          })}
      </ScrollArea>

      <Close>
        <Button aria-label="Share map" type="submit" onClick={() => onSubmit()}>
          Share
        </Button>
      </Close>
    </form>
  );
}
