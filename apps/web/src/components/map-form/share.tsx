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
import { createMapSchema } from "./helpers";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const userSchema = refinedUserSchema.extend({
  permission: permissionEnumSchema,
});

type RefinedUser = z.infer<typeof userSchema>;

const MapShareForm = () => {
  const {} = useFormContext<z.infer<typeof createMapSchema>>();
  const [searchValue, setSearchValue] = useState(undefined);
  const { data: users, isLoading } = useQuery({
    queryKey: ["search", searchValue === undefined ? "buzztrip" : searchValue],
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
  const [selectedUsers, setSelectedUsers] = useState<RefinedUser[] | null>(
    null
  );

  const handleChange = (user: RefinedUser) => {
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

  const removeUser = (user_id: string) => {
    setSelectedUsers((prev) =>
      prev ? prev.filter((u) => u.user_id !== user_id) : null
    );
  };

  return (
    <>
      <Command loop className="h-full w-full">
        <CommandInput
          value={searchValue}
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
          <ScrollArea className="h-[200px]">
            {isLoading && <CommandLoading>Loading...</CommandLoading>}
            <CommandGroup className="px-2">
              {!users || !isLoading ? (
                users?.map((user) => (
                  <CommandItem
                    key={user.user_id}
                    value={user.user_id}
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
                        alt={user.email ?? user.user_id}
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
            const userSelected = selectedUsers?.find(
              (u) => u.user_id === user.user_id
            );

            return (
              // <Button
              //   key={user.user_id}
              //   onClick={() => {
              //     const userSelected = selectedUsers?.find(
              //       (u) => u.user_id === user.user_id
              //     );
              //     if (userSelected) {
              //       removeUser(user.user_id);
              //     } else {
              //       handleChange({
              //         user_id: user.user_id,
              //         permission: "editor",
              //       });
              //     }
              //   }}
              //   className={cn("group h-fit w-full justify-between gap-2", {
              //     "scale-105": userSelected,
              //   })}
              //   type="button"
              //   variant="ghost"
              // >
              //   {userSelected ? <CircleCheck /> : <Circle />}
              //   <span className="flex items-center gap-2">
              //     {user.profile_picture && (
              //       <Image
              //         width={32}
              //         height={32}
              //         alt={user.email ?? user.user_id}
              //         src={user.profile_picture}
              //         className="h-8 w-8 rounded-full"
              //         unoptimized
              //       />
              //     )}
              //     {user.email}
              //   </span>

              //   <Select
              //     defaultValue="editor"
              //     value={userSelected ? userSelected.permission : "editor"}
              //     onValueChange={(e) => {
              //       handleChange({
              //         user_id: user.user_id,
              //         permission: (e as PermissionEnum) ?? "editor",
              //       });
              //     }}
              //   >
              //     <SelectTrigger className="w-24">
              //       <SelectValue placeholder="Access Level" />
              //     </SelectTrigger>
              //     <SelectContent>
              //       <SelectItem value="viewer">Viewer</SelectItem>
              //       <SelectItem value="editor">Editor</SelectItem>
              //       <SelectItem value="admin">Admin</SelectItem>
              //     </SelectContent>
              //   </Select>
              // </Button>
              <div key={user.user_id} className="flex items-center gap-2">
                <span className="flex items-center gap-2">
                  {user.profile_picture && (
                    <Image
                      width={32}
                      height={32}
                      alt={user.email ?? user.user_id}
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
                  onClick={() => removeUser(user.user_id)}
                  variant="destructive"
                  size="icon"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
      </ScrollArea>
    </>
  );
};

export default MapShareForm;
