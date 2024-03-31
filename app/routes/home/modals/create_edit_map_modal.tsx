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
// import getSupabaseServerClient from "@/server/supabaseServer";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Map } from "@/lib/types";
import { Form } from "@remix-run/react";
import { Plus } from "lucide-react";
import * as React from "react";
import { INTENTS } from "../intents";

export interface MapModalProps {
  mode?: "create" | "edit";
  map?: Map | null;
}

export default function MapModal({mode = "create", map = null}: MapModalProps) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Plus /> {mode == "create" ? "Create" : "Edit"} Map
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{mode == "create" ? "Create" : "Edit"} Map</DialogTitle>
            <DialogDescription>Start your travel plans here</DialogDescription>
          </DialogHeader>
          <MapForm mode={mode} map={map}/>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">
          <Plus /> {mode == "create" ? "Create" : "Edit"} Map
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{mode == "create" ? "Create" : "Edit"} Map</DrawerTitle>
          <DrawerDescription>Start your travel plans here</DrawerDescription>
        </DrawerHeader>
        <MapForm mode={mode} map={map}/>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function MapForm({mode, map}: MapModalProps) {
 
  return (
    <Form
      className={cn("grid items-start gap-4")}
      method="post"
      navigate={false}
    >
      <div className="grid gap-2">
        <Label htmlFor="title">Title</Label>
        <Input type="text" id="title" name="title" placeholder="Roadtrip" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="epic roadtrip!!"
        />
      </div>

      {/* <div className="grid gap-2">
        <Label htmlFor="location">Location</Label>
        <Select></Select>
      </div>     */}


      {mode == "edit" && map && <input type="hidden" name="map_id" value={map?.uid ?? ""} />}

      <DialogClose asChild>
            <DrawerClose asChild>
                <Button aria-label="create map" type="submit" name="intent" 
                value={mode === "create" ? INTENTS.createMap : INTENTS.editMap}>
                Create Map
                </Button>
            </DrawerClose>
        </DialogClose>
    </Form>
  );
}
