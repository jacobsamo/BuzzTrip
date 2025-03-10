import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CreateMapSchema } from "@buzztrip/db/mutations/maps";
import { useFormContext } from "react-hook-form";
import { z } from "zod";

const MapDetailsForm = () => {
  const { control } = useFormContext<z.infer<typeof CreateMapSchema>>();

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="map.title"
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
        name="map.description"
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
