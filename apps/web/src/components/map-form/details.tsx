import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { mapsEditSchema } from "@buzztrip/db/zod-schemas";
import { useFormContext } from "react-hook-form";
import { z } from "zod";

const MapDetailsForm = () => {
  const { control } = useFormContext<z.infer<typeof mapsEditSchema>>();

  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="title"
        rules={{ required: true }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input placeholder="Enter map title" {...field} autoFocus />
            </FormControl>
            <FormDescription>Give your map a descriptive name.</FormDescription>
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
                placeholder="Add details about your map..."
                {...field}
                value={field?.value ?? undefined}
              />
            </FormControl>
            <FormDescription>
              Briefly describe the purpose of this map.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default MapDetailsForm;
