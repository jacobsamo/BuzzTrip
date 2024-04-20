"use client";
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
import { Bug, CircleHelp, Lightbulb, Plus } from "lucide-react";
import * as React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { TablesInsert } from "database.types";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { set } from "zod";

export default function FeedbackModal() {
  const path = usePathname();
  const [open, setOpen] = useState(false);

  const { register, control, handleSubmit } = useForm<TablesInsert<"feedback">>(
    {
      defaultValues: {
        type: "bug",
        page: path,
      },
    }
  );

  const onSubmit: SubmitHandler<TablesInsert<"feedback">> = async (data) => {
    try {
      const create = fetch(`/api/feedback`, {
        method: "POST",
        body: JSON.stringify(data),
      });

      toast.promise(create, {
        loading: "sending feedback...",
        success: () => {
          setOpen(false);
          return "Thank you for your feedback";
        },
        error: "Failed to send your feedback",
      });
    } catch (error) {
      toast.error("Failed to submit feedback");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Feedback</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Feedback</DialogTitle>
          <DialogDescription>
            Make BuzzTrip better by providing feedback
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <ToggleGroup
                type="single"
                value={field.value}
                onValueChange={field.onChange}
              >
                <ToggleGroupItem value="bug" className="inline-flex gap-2">
                  <Bug /> Bug
                </ToggleGroupItem>
                <ToggleGroupItem value="feature" className="inline-flex gap-2">
                  <Lightbulb /> Feature
                </ToggleGroupItem>
                <ToggleGroupItem value="other" className="inline-flex gap-2">
                  <CircleHelp /> Other
                </ToggleGroupItem>
              </ToggleGroup>
            )}
          />
          <Label htmlFor="title">Title</Label>
          <Input
            {...register("title", { required: true })}
            required
            placeholder="Title"
          />
          <Label htmlFor="description">Description</Label>
          <Textarea
            {...register("description", { required: true })}
            required
            placeholder="Description"
          />

          <Button onClick={handleSubmit(onSubmit)}>Submit</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
