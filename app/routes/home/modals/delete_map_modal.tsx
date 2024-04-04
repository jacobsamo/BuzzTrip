import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DrawerClose
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectItem } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Form, useSubmit } from "@remix-run/react";
import { Share } from "lucide-react";
import { INTENTS } from "../intents";

export interface ShareMapProps {
  map_id: string;
}

export default function ShareModal({ map_id }: ShareMapProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Share /> Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Map</DialogTitle>
          <DialogDescription>THIS CAN&apos;T BE REVERSED</DialogDescription>
        </DialogHeader>
        <Form method="post" navigate={false}>
          <p>
            This action is irreversible and will delete all data associated with
            this map
          </p>
          <input type="hidden" name="map_id" value={map_id} />

          <DialogFooter>
            <DialogClose type="button">Cancel</DialogClose>
            <DialogClose>
              <Button
                variant={"destructive"}
                name="intent"
                value={INTENTS.deleteMap}
              >
                DELETE
              </Button>
            </DialogClose>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function ShareMapForm({ map_id }: ShareMapProps) {
  const submit = useSubmit();
  // need to do fetching of data to search for users

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    submit(formData, {
      method: "post",
      fetcherKey: `shareMap:${map_id}`,
      navigate: false,
      unstable_flushSync: true,
    });
  };

  return (
    <Form
      className={cn("grid items-start gap-4")}
      method="post"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-2">
        <Label htmlFor="title">Email</Label>
        {/*Try to validate this field as much as possible */}
        <Input
          type="email"
          id="email"
          name="email"
          placeholder="john@example.com"
        />
      </div>

      <Label htmlFor="permissionLevel">Access Type</Label>
      <Select name="permissionLevel" defaultValue="editor">
        <SelectItem value="viewer">Viewer</SelectItem>
        <SelectItem value="editor">Editor</SelectItem>
        <SelectItem value="admin">Admin</SelectItem>
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
  );
}
