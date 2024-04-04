import ConfirmDeleteModal from "@/components/modals/comfirm_delete_modal";
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
import Icon, { IconProps } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMediaQuery } from "@/hooks/use-media-query";
import { iconsList } from "@/lib/data";
import { Collection } from "@/lib/types";
import { cn } from "@/lib/utils";
import { INTENTS } from "@/routes/map.$mapId/intents";
import { useMapContext } from "@/routes/map.$mapId/providers/map_provider";
import { Form, useSubmit } from "@remix-run/react";
import { Edit, Plus } from "lucide-react";
import * as React from "react";
import { useState } from "react"; // Import useState hook

interface CollectionModalProps {
  triggerType?: "icon" | "text";
  mode?: "create" | "edit";
  collection?: Collection | null;
  map_id: string;
}

export default function CollectionModal({
  mode = "create",
  collection = null,
  triggerType = "text",
  map_id,
}: CollectionModalProps) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            {triggerType == "text" && mode == "create" ? (
              <>
                <Plus /> Create Collection
              </>
            ) : (
              <Edit />
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {mode == "create" ? "Create" : "Edit"} Collection
            </DialogTitle>
            <DialogDescription>Start your travel plans here</DialogDescription>
          </DialogHeader>
          <CollectionForm mode={mode} collection={collection} map_id={map_id} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">
          {triggerType == "text" && mode == "create" ? (
            <>
              <Plus /> Create Collection
            </>
          ) : (
            <Edit />
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>
            {mode == "create" ? "Create" : "Edit"} Collection
          </DrawerTitle>
          <DrawerDescription>Start your travel plans here</DrawerDescription>
        </DrawerHeader>
        <CollectionForm mode={mode} collection={collection} map_id={map_id} />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

const Close = ({ children }: { children: React.ReactNode }) => {
  return (
    <DialogClose asChild>
      <DrawerClose asChild>{children}</DrawerClose>
    </DialogClose>
  );
};

function CollectionForm({ mode, collection, map_id }: CollectionModalProps) {
  const { setCollections } = useMapContext();
  const submit = useSubmit();

  // State to store selected icon
  const [selectedIcon, setSelectedIcon] = useState<string>(
    collection?.icon ?? "MdOutlineFolder"
  );

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
    formData.append("icon", selectedIcon);
    formData.append("color", "#000000");
    formData.append("map_id", map_id);

    if (mode === "edit") {
      formData.append("uid", collection!.uid);
      formData.append("intent", INTENTS.updateCollection);
    } else {
      formData.append("intent", INTENTS.createCollection);
    }

    // Perform your form submission
    // Example: You can use fetch to submit the form data
    submit(formData, {
      method: "post",
      fetcherKey: `collection`,
      navigate: false,
      unstable_flushSync: true,
    });

    const values = Object.fromEntries(formData.entries()) as Collection;
    if (mode === "edit") {
      // Update collections state
      setCollections((prev) => {
        const index = prev.findIndex((c) => c.uid === collection!.uid);
        prev[index] = values;
        return [...prev];
      });
      return;
    } else {
      setCollections((prev) => [values, ...(prev || [])]);
    }
  };

  const handleDelete = (event) => {
    event.preventDefault();

    // Create FormData object
    const formData = new FormData();
    formData.append("intent", INTENTS.deleteCollection);
    formData.append("uid", collection!.uid);

    const values = Object.entries(formData);
    console.log("Delete: ", values);

    // Perform your form submission
    submit(formData, {
      method: "delete",
      fetcherKey: `collection:${collection?.uid}`,
      navigate: false,
      unstable_flushSync: true,
    });

    // Delete the collection
    setCollections((prev) => {
      const index = prev.findIndex((c) => c.uid === collection!.uid);
      prev.splice(index, 1);
      return [...prev];
    });
  };

  return (
    <div>
      <Form
        method="post"
        className={cn("flex flex-col gap-4")}
        onSubmit={handleSubmit} // Listen to form submission event
      >
        <Label htmlFor="title">Title</Label>
        <Input
          placeholder="Title"
          name="title"
          defaultValue={collection?.title}
        />

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
        <Textarea
          placeholder="Description"
          name="description"
          defaultValue={collection?.description ?? ""}
        />

        <Close>
          <Button aria-label="Create collection" type="submit">
            Submit
          </Button>
        </Close>
      </Form>

      {mode === "edit" && collection && (
        <ConfirmDeleteModal type="collection" handleDelete={handleDelete} />
      )}
    </div>
  );
}
