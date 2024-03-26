import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Collection } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Form } from "@remix-run/react";
import { Plus } from "lucide-react";
import * as React from "react";
import Icon, { IconProps } from "../ui/icon";
import { Textarea } from "../ui/textarea";


interface CollectionModalProps {
    triggerType?: "icon" | "text";
    mode?: "create" | "edit";
    collection?: Collection | null;
    map_id: string;
}
  
  const iconsList: IconProps["name"][] = [
    "MdOutlineFolder",
    "MdOutlineLocationOn",
    "MdOutlineHiking",
    "MdOutlineBed",
    "MdOutlineDirections",
  ];

export default function CollectionModal({mode = "create", collection = null, triggerType = "text", map_id}: CollectionModalProps) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Plus /> {triggerType =="text" && mode == "create" ? "Create Collection" : "Edit Collection"}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{mode == "create" ? "Create" : "Edit"} Collection</DialogTitle>
            <DialogDescription>Start your travel plans here</DialogDescription>
          </DialogHeader>
          <CollectionForm mode={mode} collection={collection} map_id={map_id}/>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">
          <Plus /> {triggerType =="text" && mode == "create" ? "Create Collection" : "Edit Collection"}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{mode == "create" ? "Create" : "Edit"} Collection</DrawerTitle>
          <DrawerDescription>Start your travel plans here</DrawerDescription>
        </DrawerHeader>
        <CollectionForm mode={mode} collection={collection} map_id={map_id}/>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

import { useState } from 'react'; // Import useState hook
import { useMapContext } from "../providers/map_provider";

function CollectionForm({ mode, collection, map_id }: CollectionModalProps) {
    const {collections, setCollections} = useMapContext()

  // State to store selected icon
  const [selectedIcon, setSelectedIcon] = useState<string>('MdOutlineFolder');

  // Function to handle icon selection
  const handleIconSelection = (icon: string) => {
    setSelectedIcon(icon);
  };

  // Function to handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();

    // Create FormData object
    const formData = new FormData(event.target);

    // Append selected icon value to FormData
    formData.append('icon', selectedIcon);
    formData.append('color', '#000000');
    formData.append('map_id', map_id);

    const values = Object.fromEntries(formData.entries()) as Collection;

    // Perform your form submission
    // Example: You can use fetch to submit the form data
    fetch(
      mode === 'create' ? '/api/collection/create' : `/api/collection/edit?id=${collection?.uid}`,
      {
        method: 'POST',
        body: formData,
      }
    )

    // Update collections state
    setCollections((prev) => [...(prev || []), values]);
  };

  return (
    <>
      <Form
        className={cn('grid items-start gap-4')}
        onSubmit={handleSubmit} // Listen to form submission event
        navigate={false}
      >
        <Label htmlFor="title">Title</Label>
        <Input placeholder="Title" name="title" />

        <div className="flex flex-wrap gap-2">
          {iconsList.map((icon, index) => (
            <Button
              key={index}
              type="button"
              variant="ghost"
              onClick={() => handleIconSelection(icon)} // Handle icon selection
              className={cn("group text-black", {
                "scale-105 border border-gray-500 shadow-lg":
                  selectedIcon == icon,
              })}
            >
              <Icon name={icon} size={24} />
            </Button>
          ))}
        </div>

        <Label htmlFor="description">Description</Label>
        <Textarea placeholder="Description" name="description" />
        
        <DialogClose asChild>
            <DrawerClose>
                <Button aria-label="Create collection" type="submit">
                Submit
                </Button>
            </DrawerClose>
        </DialogClose>
      </Form>
    </>
  );
}



