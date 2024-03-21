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
import { Form } from "@remix-run/react";
import { Plus } from "lucide-react";
import * as React from "react";
import { Select } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Map } from "@/lib/types";

export interface MapModalProps {
  mode: "create" | "edit";
  map?: Map;
}

export default function MapModal({mode = "create", map}: MapModalProps) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Plus /> Create Map
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Map</DialogTitle>
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
          <Plus /> Create Map
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Create Map</DrawerTitle>
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
      action={mode === "create" ? "/api/map/create" : `"/api/map/edit?id=${map?.uid}`}
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

      <div className="grid gap-2">
        <Label htmlFor="location">Location</Label>
        <Select></Select>
      </div>    
      <DialogClose  type="submit" >
      Save changes

      </DialogClose>
    </Form>
  );
}
