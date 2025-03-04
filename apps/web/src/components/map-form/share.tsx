import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { mapsEditSchema } from "@buzztrip/db/zod-schemas";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Circle, CircleCheck, SearchIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiClient } from "@/server/api.client";
import { useQuery } from "@tanstack/react-query";
import { TShareMapUserSchema } from "@buzztrip/db/mutations/maps";
import { PermissionEnum } from "@buzztrip/db/types";
import Image from "next/image";

interface MapShareFormProps {
  map_id: string;
}

const MapShareForm = ({ map_id }: MapShareFormProps) => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<
    TShareMapUserSchema[] | null
  >(null);

  const { data: users } = useQuery({
    queryKey: ["search", searchValue],
    queryFn: async () => {
      if (searchValue === "") return undefined;
      const res = await apiClient.users.search.$get({
        query: { q: searchValue },
      });
      if (res.status == 200) {
        const val = await res.json();
        return val?.users ?? null;
      }
      return null;
    },
  });

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

  const removeUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev ? prev.filter((u) => u.user_id !== userId) : null
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 px-3">
        <SearchIcon className="h-5 w-5 shrink-0" />
        <Input
          aria-label="Search for user by email"
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

      <ScrollArea className="h-36 w-full">
        {users &&
          users.map((user) => {
            const userSelected = selectedUsers?.find(
              (u) => u.user_id === user.userId
            );

            return (
              <Button
                key={user.userId}
                onClick={() => {
                  if (userSelected) {
                    removeUser(user.userId);
                  } else {
                    handleChange({
                      user_id: user.userId,
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
                  {user.profile_picture && (
                    <Image
                      width={32}
                      height={32}
                      alt={user.email ?? user.userId}
                      src={user.profile_picture}
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
                      user_id: user.userId,
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
    </div>
  );
};

export default MapShareForm;
