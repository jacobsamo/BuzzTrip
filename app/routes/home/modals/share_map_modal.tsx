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
import { Select, SelectContent, SelectItem } from "@/components/ui/select";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { Form, useLoaderData, useSubmit } from "@remix-run/react";
import { Share } from "lucide-react";
import * as React from "react";
import { INTENTS } from "../intents";
import { loader } from "../route";
import { toast } from "sonner";

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
  const submit = useSubmit();
  const [selectedUser, setSelectedUser] = React.useState<string | undefined>(
    undefined
  );
  const { q, users } = useLoaderData<typeof loader>();
  // need to do fetching of data to search for users

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    if (selectedUser !== undefined) formData.append("user_id", selectedUser);
    else toast.error("Must select a user");

    submit(formData, {
      method: "post",
      fetcherKey: `shareMap:${map_id}`,
      navigate: false,
      unstable_flushSync: true,
    });
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        <Form
          id="search-form"
          onChange={(event) => {
            const isFirstSearch = q === null;
            submit(event.currentTarget, {
              replace: !isFirstSearch,
            });
          }}
          role="search"
        >
          <Label htmlFor="q">Find user</Label>
          <Input
            aria-label="Search for user by email"
            defaultValue={q || ""}
            id="q"
            name="q"
            placeholder="Search by email"
            type="search"
          />
        </Form>
        <div className="flex-col gap-2">
          {users !== undefined &&
            users.map((user) => (
              <Button
                key={user.id}
                onClick={() => setSelectedUser(user.id)}
                variant={"outline"}
              >
                {user.email}
              </Button>
            ))}
        </div>
      </div>

      <Form
        className={cn("grid items-start gap-4")}
        method="post"
        onSubmit={handleSubmit}
      >
        <div className="grid gap-2"></div>

        <Label htmlFor="permissionLevel">Access Type</Label>
        <Select name="permissionLevel" defaultValue="editor">
          <SelectContent>
            <SelectItem value="viewer">Viewer</SelectItem>
            <SelectItem value="editor">Editor</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>

        <DialogClose asChild>
          <DrawerClose asChild>
            <Button
              aria-label="Share map"
              type="submit"
              name="intent"
              value={INTENTS.shareMap}
            >
              Share
            </Button>
          </DrawerClose>
        </DialogClose>
      </Form>
    </>
  );
}
