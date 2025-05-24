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
import { useSession } from "@/lib/auth-client";
import { apiClient } from "@/server/api.client";
import { PermissionEnum } from "@buzztrip/db/types";
import { useQuery } from "@tanstack/react-query";
import { CommandLoading } from "cmdk";
import { Check, UserPlus, X } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Label } from "../ui/label";
import { useMapFormContext } from "./provider";

const MapShareForm = () => {
  const { users, addUser, removeUser, updateUser } = useMapFormContext();
  const { data } = useSession();
  const [searchValue, setSearchValue] = useState("");
  const [commandOpen, setCommandOpen] = useState(false);

  const { data: fetchedUsers, isLoading } = useQuery({
    queryKey: ["users", searchValue],
    queryFn: async () => {
      const res = await apiClient.users.search.$get({
        query: { q: searchValue },
      });

      if (res.ok) {
        const { users } = await res.json();
        console.log("Fetched users:", users);
        return users ?? undefined;
      }

      return undefined;
    },
    enabled: searchValue?.length >= 2,
  });

  return (
    <div className="space-y-12">
      <Command loop className="h-1/2 w-full">
        <CommandInput
          value={searchValue ?? ""}
          onValueChange={(value) => {
            setSearchValue(value);
            setCommandOpen(value.length > 0);
          }}
          // className="w-full"
          autoFocus={true}
          placeholder="Search by name or email..."
          id="search"
          after={
            searchValue ? (
              <button
                aria-label="clear search results"
                onClick={() => {
                  setSearchValue("");
                  setCommandOpen(false);
                }}
              >
                <X className="h-5 w-5" />
              </button>
            ) : (
              <></>
            )
          }
        />

        {commandOpen && (
          <CommandList className="max-h-[200px]">
            <ScrollArea className="h-auto">
              {isLoading && <CommandLoading>Searching users...</CommandLoading>}
              <CommandEmpty>No users found</CommandEmpty>
              <CommandGroup className="px-2">
                {fetchedUsers &&
                  fetchedUsers?.map((user) => (
                    <CommandItem
                      key={`${user.name}-${user.email}`}
                      value={`${user.name}-${user.email}`}
                      onSelect={() => {
                        addUser({ ...user, permission: "editor" });
                        setSearchValue("");
                        setCommandOpen(false);
                      }}
                      className="flex items-center justify-between p-2 cursor-pointer"
                      disabled={
                        users?.some((u) => u.id === user.id) ||
                        data?.session?.userId === user.id
                      }
                    >
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={user.image || "/placeholder.svg"}
                            alt={user.name}
                          />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium">{user.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {user.email}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center">
                        {(users && users.some((u) => u.id === user.id) )||
                        data?.session?.userId === user.id ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 hover:bg-accent cursor-pointer"
                            onClick={() => {
                              addUser({ ...user, permission: "editor" });
                              setSearchValue("");
                              setCommandOpen(false);
                            }}
                          >
                            <UserPlus className="h-4 w-4" />
                            <span className="ml-1">Add</span>
                          </Button>
                        )}
                      </div>
                    </CommandItem>
                  ))}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        )}
      </Command>

      <ScrollArea className="h-36 w-full flex-col gap-2">
        {users && (
          <div className="space-y-3">
            <Label>Invited collaborators ({users.length})</Label>
            <div className="space-y-2 max-h-40">
              {users.map((user) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-3 border rounded-lg bg-gray-50"
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage
                        src={user.image || "/placeholder.svg"}
                        alt={user.name}
                      />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Select
                      value={user.permission}
                      onValueChange={(value) =>
                        updateUser(user.id, {
                          ...user,
                          permission: value as PermissionEnum,
                        })
                      }
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="commenter">Commenter</SelectItem>
                        <SelectItem value="viewer">Viewer</SelectItem>
                        <SelectItem value="editor">Editor</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeUser(user.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default MapShareForm;
