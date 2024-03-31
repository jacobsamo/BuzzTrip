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
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { Select, SelectItem } from "@/components/ui/select";
import { Form, useSubmit } from "@remix-run/react";
import { Plus, Share, Share } from "lucide-react";
import * as React from "react";
import { INTENTS } from "../intents";

export interface ShareMapProps {
    map_id: string;
}

export default function ShareModal({map_id}: ShareMapProps) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
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

function ShareMapForm({map_id}: ShareMapProps) {
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
    }

  return (
    <Form
      className={cn("grid items-start gap-4")}
      method="post"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-2">
        <Label htmlFor="title">Email</Label>
        {/*Try to validate this field as much as possible */}
        <Input type="email" id="email" name="email" placeholder="john@example.com" />
      </div>

        <Label htmlFor="permissionLevel">Access Type</Label>
        <Select name="permissionLevel" defaultValue="editor">
            <SelectItem value="viewer">
                Viewer
            </SelectItem>
            <SelectItem value="editor">
                Editor
            </SelectItem>
            <SelectItem value="admin">
                Admin
            </SelectItem>
        </Select>

        <DialogClose asChild>
            <DrawerClose asChild>
                <Button aria-label="Share map" type="submit" name="intent" 
                value={INTENTS.shareMap}>
                Share
                </Button>
            </DrawerClose>
        </DialogClose>
    </Form>
  );
}
