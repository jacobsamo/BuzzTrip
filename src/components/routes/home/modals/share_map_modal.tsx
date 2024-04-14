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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { Share } from "lucide-react";
import * as React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Tables } from "../../../../../database.types";
import { useEffect, useState } from "react";
import { SearchUserReturn } from "@/app/api/users/search/route";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

export interface ShareMapProps {
  map_id: string;
}

export default function ShareModal({ map_id }: ShareMapProps) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <Button variant="outline">
            <Share /> Share
          </Button>
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
      <DrawerTrigger asChild>
        <Button variant="outline">
          <Share /> Share
        </Button>
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

function ShareMapForm({ map_id }: ShareMapProps) {
  const [searchValue, setSearchValue] = useState("");
  const { data: users } = useQuery({
    queryKey: ["search", searchValue],
    queryFn: async () => {
      if (searchValue === "") return undefined;
      const res = await fetch(`/api/users/search?q=${searchValue}`);
      const val = await res.json();
      return val as SearchUserReturn[] | undefined;
    },
  });
  const [selectedUser, setSelectedUser] = useState<string | undefined>(
    undefined
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Tables<"shared_map">>({
    defaultValues: {
      permission: "editor",
      map_id: map_id,
    },
  });

  const onSubmit: SubmitHandler<Tables<"shared_map">> = async (data) => {
    const share = fetch(`/api/map/${map_id}/share`, {
      method: "POST",
      body: JSON.stringify({ ...data, user_id: selectedUser }),
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
    <form
      className={cn("grid items-start gap-4")}
      method="post"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="q">Find user</Label>
        <Input
          aria-label="Search for user by email"
          id="search"
          name="search"
          placeholder="Search by email"
          type="search"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />

        <div className="flex-col gap-2">
          {users &&
            users !== undefined &&
            users.map((user) => {
              const selected = selectedUser === user.id;

              return (
                <Button
                  key={user.id}
                  onClick={() => setSelectedUser(user.id)}
                  variant={"outline"}
                  className={cn(
                    "inline-flex w-full items-center justify-start gap-2 text-left",
                    selected ? "bg-gray-500" : ""
                  )}
                  type="button"
                >
                  {user.picture && (
                    <Image
                      width={32}
                      height={32}
                      alt={user.email ?? user.id}
                      src={user.picture}
                      className="h-8 w-8 rounded-full"
                    />
                  )}
                  {user.email}
                </Button>
              );
            })}
        </div>
      </div>

      <Label htmlFor="permission">Access Level</Label>
      <Select {...register("permission")} defaultValue="editor">
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Access Level" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="viewer">Viewer</SelectItem>
          <SelectItem value="editor">Editor</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
        </SelectContent>
      </Select>

      <DialogClose asChild>
        <DrawerClose asChild>
          <Button aria-label="Share map" type="submit">
            Share
          </Button>
        </DrawerClose>
      </DialogClose>
    </form>
  );
}
