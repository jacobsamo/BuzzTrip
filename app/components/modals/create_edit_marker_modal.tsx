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
import { Marker } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Form } from "@remix-run/react";
import { Plus } from "lucide-react";
import * as React from "react";
import { Select } from "../ui/select";
import { Textarea } from "../ui/textarea";

export interface MarkerModalProps {
  mode?: "create" | "edit";
  marker?: Marker | null;
}

export default function MarkerModal({mode = "create", marker = null}: MarkerModalProps) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Plus /> {mode == "create" ? "Create" : "Edit"} Marker
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{mode == "create" ? "Create" : "Edit"} Marker</DialogTitle>
            <DialogDescription>Start your travel plans here</DialogDescription>
          </DialogHeader>
          <MarkerForm mode={mode} marker={marker}/>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">
          <Plus /> {mode == "create" ? "Create" : "Edit"} Marker
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{mode == "create" ? "Create" : "Edit"} Marker</DrawerTitle>
          <DrawerDescription>Start your travel plans here</DrawerDescription>
        </DrawerHeader>
        <MarkerForm mode={mode} marker={marker}/>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function MarkerForm({mode, marker}: MarkerModalProps) {
 
  return (
    <Form
      className={cn("grid items-start gap-4")}
      method="post"
      action={mode === "create" ? "/api/marker/create" : `"/api/marker/edit?id=${marker?.uid}`}
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
