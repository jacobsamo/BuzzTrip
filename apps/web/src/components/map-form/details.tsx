import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { mapsEditSchema } from "@buzztrip/db/zod-schemas";

interface MapDetailsFormProps {
  form: UseFormReturn<z.infer<typeof mapsEditSchema>>;
}

const MapDetailsForm = ({ form }: MapDetailsFormProps) => {
  const { control } = form;

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="title"
        rules={{ required: true }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input placeholder="Enter map title" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Enter map description"
                {...field}
                value={field?.value ?? undefined}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default MapDetailsForm;
