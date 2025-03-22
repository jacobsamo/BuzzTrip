import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiClient } from "@/server/api.client";
import { PermissionEnum } from "@buzztrip/db/types";
import {
  permissionEnumSchema,
  refinedUserSchema,
} from "@buzztrip/db/zod-schemas";
import { useQuery } from "@tanstack/react-query";
import { CommandLoading } from "cmdk";
import { Trash, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { mapFormSchema } from "./helpers";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const userSchema = refinedUserSchema.extend({
  permission: permissionEnumSchema,
});

type RefinedUser = z.infer<typeof userSchema>;

const MapShareForm = () => {
  const { getValues, setValue } =
    useFormContext<z.infer<typeof mapFormSchema>>();
  const [searchValue, setSearchValue] = useState<string | undefined>(undefined);
  const { data: users, isLoading } = useQuery({
    queryKey: ["search", searchValue === undefined ? "buzztrip" : searchValue],
    queryFn: async () => {
      if (searchValue === undefined) return null;

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

  const [selectedUsers, setSelectedUsers] = useState<RefinedUser[]>([]);

  const handleChange = (user: RefinedUser) => {
    const currentUsers = getValues("users") || [];
    const existingUserIndex = currentUsers.findIndex(
      (u) => u.user_id === user.id
    );

    if (existingUserIndex !== -1) {
      const updatedUsers = [...currentUsers];
      updatedUsers[existingUserIndex] = {
        user_id: user.id,
        permission: user.permission,
      };
      setValue("users", updatedUsers, {
        shouldDirty: true,
        shouldTouch: true,
      });

      setSelectedUsers((prev) => {
        const updated = [...prev];
        updated[existingUserIndex] = user;
        return updated;
      });
    } else {
      setValue(
        "users",
        [
          ...currentUsers,
          {
            user_id: user.id,
            permission: user.permission,
          },
        ],
        {
          shouldDirty: true,
          shouldTouch: true,
        }
      );

      setSelectedUsers((prev) => [...prev, user]);
    }
  };

  const removeUser = (user_id: string) => {
    const currentUsers = getValues("users") || [];
    setValue(
      "users",
      currentUsers.filter((u) => u.user_id !== user_id),
      { shouldDirty: true }
    );
    setSelectedUsers((prev) => prev.filter((u) => u.id !== user_id));
  };

  return (
    <div className="space-y-2">
      <Command loop className="h-full w-full">
        <CommandInput
          value={searchValue ?? ""}
          onValueChange={setSearchValue}
          // className="w-full"
          placeholder="Search locations"
          id="search"
          after={
            searchValue ? (
              <button
                aria-label="clear search results"
                onClick={() => {
                  setSearchValue("");
                }}
              >
                <X className="h-5 w-5" />
              </button>
            ) : (
              <></>
            )
          }
        />

        <CommandList className="relative">
          <ScrollArea className="h-full">
            {isLoading && <CommandLoading>Loading...</CommandLoading>}
            <CommandGroup className="px-2">
              {!users || !isLoading ? (
                users?.map((user) => (
                  <CommandItem
                    key={user.id}
                    value={user.id}
                    onSelect={() => {
                      // onSearchItemSelect(pred);
                      handleChange({
                        ...user,
                        permission: "editor",
                      });
                    }}
                    className="flex items-center gap-2"
                  >
                    {user.profile_picture && (
                      <Image
                        width={32}
                        height={32}
                        alt={user.email ?? user.id}
                        src={user.profile_picture}
                        className="h-8 w-8 rounded-full"
                        unoptimized
                      />
                    )}
                    {user.email}
                  </CommandItem>
                ))
              ) : (
                <CommandEmpty>No user found</CommandEmpty>
              )}
            </CommandGroup>
          </ScrollArea>
        </CommandList>
      </Command>

      <ScrollArea className="h-36 w-full flex-col gap-2">
        {selectedUsers &&
          selectedUsers.map((user) => {
            const userSelected = selectedUsers?.find((u) => u.id === user.id);

            return (
              <div key={user.id} className="flex items-center gap-2">
                <span className="flex items-center gap-2">
                  {user.profile_picture && (
                    <Image
                      width={32}
                      height={32}
                      alt={user.email ?? user.id}
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
                      ...user,
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

                <Button
                  onClick={() => removeUser(user.id)}
                  variant="destructive"
                  size="icon"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
      </ScrollArea>
    </div>
  );
};

export default MapShareForm;
