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
import { cn } from "@/lib/utils";
import { api } from "@buzztrip/backend/api";
import { PermissionEnum } from "@buzztrip/backend/types";
import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { CommandLoading } from "cmdk";
import { useQuery as useConvexQuery } from "convex/react";
import { Check, UserPlus, X } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Label } from "../ui/label";
import { useMapFormContext } from "./provider";

const MapShareForm = () => {
  const { users, addUser, removeUser, updateUser } = useMapFormContext();
  const userStatus = useConvexQuery(api.users.userLoginStatus);
  const userId = userStatus?.user?._id;
  const [searchValue, setSearchValue] = useState("");
  const [commandOpen, setCommandOpen] = useState(false);
  const { data: fetchedUsers, isLoading } = useQuery({
    // queryKey: ["users", searchValue],
    ...convexQuery(api.users.searchUsers, {
      query: searchValue,
    }),
    enabled: searchValue?.length >= 2,
  });

  useEffect(() => {
    console.log("users", users);
  }, []);

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
                        users?.some((u) => u._id === user._id) ||
                        userId === user._id
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
                        {(users && users.some((u) => u._id === user._id)) ||
                        userId === user._id ? (
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
                  key={user._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={cn(
                    "flex items-center justify-between p-3 border rounded-lg bg-gray-50",
                    {
                      // if the user is the owner of the map, we don't want to allow them to remove themselves
                      "opacity-50 cursor-not-allowed pointer-events-none":
                        user._id === userId,
                    }
                  )}
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
                      <p className="font-medium text-xs sm:text-sm">
                        {user.name}
                      </p>
                      <p className="text-xs sm:text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Select
                      value={user.permission}
                      onValueChange={(value) =>
                        updateUser(user._id, {
                          ...user,
                          permission: value as PermissionEnum,
                        })
                      }
                      disabled={user._id === userId}
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="commenter">Commenter</SelectItem>
                        <SelectItem value="viewer">Viewer</SelectItem>
                        <SelectItem value="editor">Editor</SelectItem>
                        <SelectItem value="owner">Owner</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeUser(user._id)}
                      disabled={user._id === userId}
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
