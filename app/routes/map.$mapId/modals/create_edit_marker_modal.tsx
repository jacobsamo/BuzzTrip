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
import { Textarea } from "@/components/ui/textarea";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Marker } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Form } from "@remix-run/react";
import { Edit, Plus } from "lucide-react";
import * as React from "react";
import { INTENTS } from "../intents";

export interface MarkerModalProps {
  mode?: "create" | "edit";
  marker?: Marker | null;
}

export default function MarkerModal({
  mode = "create",
  marker = null,
}: MarkerModalProps) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            {mode == "create" ? (
              <>
                <Plus /> Marker
              </>
            ) : (
              <Edit />
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {mode == "create" ? "Create" : "Edit"} Marker
            </DialogTitle>
            <DialogDescription>Start your travel plans here</DialogDescription>
          </DialogHeader>
          <MarkerForm mode={mode} marker={marker} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">
          {mode == "create" ? (
            <>
              <Plus /> Marker
            </>
          ) : (
            <Edit />
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>
            {mode == "create" ? "Create" : "Edit"} Marker
          </DrawerTitle>
          <DrawerDescription>Start your travel plans here</DrawerDescription>
        </DrawerHeader>
        <MarkerForm mode={mode} marker={marker} />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function MarkerForm({ mode, marker }: MarkerModalProps) {
  return (
    <Form
      className={cn("grid items-start gap-4")}
      method="post"
      navigate={false}
    >
      <div className="grid gap-2">
        <Label htmlFor="title">Title</Label>
        <Input
          type="text"
          id="title"
          name="title"
          placeholder="Roadtrip"
          defaultValue={marker?.title}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="epic roadtrip!!"
          defaultValue={marker?.description ?? ""}
        />
      </div>

      {marker && <input type="hidden" name="uid" value={marker.uid} />}

      <DialogClose asChild>
        <DrawerClose asChild>
          <Button
            aria-label="Create Marker"
            type="submit"
            name="intent"
            value={
              mode == "create" ? INTENTS.createMarker : INTENTS.updateMarker
            }
          >
            {mode === "create" ? "Create" : "Save changes"}
          </Button>
        </DrawerClose>
      </DialogClose>
    </Form>
  );
}
