import { Button } from "@/components/ui/button";
import { Label } from "@buzztrip/backend/types";
import { labelsEditSchema } from "@buzztrip/backend/zod-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { ColorPicker } from "../color-picker";
import { IconPicker } from "../icon-picker";
import { Card, CardContent } from "../ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useMapFormContext } from "./provider";

interface LabelFormProps {
  label: Label;
}

const LabelForm = ({ label }: LabelFormProps) => {
  const { removeLabel, updateLabel } = useMapFormContext();

  const form = useForm<z.infer<typeof labelsEditSchema>>({
    resolver: zodResolver(labelsEditSchema),
    defaultValues: {
      ...label,
    },
  });

  const { control, watch, formState } = form;

  // Use refs to track state and prevent unnecessary updates
  const lastUpdatedValuesRef = useRef<z.infer<typeof labelsEditSchema> | null>(
    null
  );
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isUpdatingRef = useRef(false);

  // Watch all form values but memoize to prevent unnecessary re-renders
  const currentValues = watch();

  // Memoize the values comparison to prevent recalculation
  const hasChangedSinceLastUpdate = useMemo(() => {
    if (!lastUpdatedValuesRef.current) return true;

    const currentStr = JSON.stringify(currentValues);
    const lastStr = JSON.stringify(lastUpdatedValuesRef.current);

    return currentStr !== lastStr;
  }, [currentValues]);

  // Memoized update function
  const performUpdate = useCallback(() => {
    if (!isUpdatingRef.current && hasChangedSinceLastUpdate) {
      isUpdatingRef.current = true;
      updateLabel(label._id, currentValues);
      lastUpdatedValuesRef.current = { ...currentValues };

      // Reset the updating flag after a short delay
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 100);
    }
  }, [hasChangedSinceLastUpdate, label._id, updateLabel, currentValues]);

  // Debounced auto-update effect
  useEffect(() => {
    // Clear existing timeout
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    // Only proceed if form is dirty and values have changed
    if (
      formState.isDirty &&
      hasChangedSinceLastUpdate &&
      !isUpdatingRef.current
    ) {
      updateTimeoutRef.current = setTimeout(performUpdate, 1000);
    }

    // Cleanup timeout on unmount
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, [formState.isDirty, hasChangedSinceLastUpdate, performUpdate]);

  // Memoized remove handler
  const handleRemoveLabel = useCallback(() => {
    removeLabel(label._id);
  }, [removeLabel, label._id]);

  return (
    <Card className="relative gap-0 py-1 mt-2">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={handleRemoveLabel}
        className="text-red-600 hover:text-red-700 hover:bg-red-50 absolute top-2 right-2"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
      <CardContent className="inline-flex flex-wrap items-center gap-2 md:gap-8">
        <Form {...form}>
          <div className="inline-flex items-center gap-2 flex-wrap">
            <FormField
              control={control}
              name="icon"
              render={({ field }) => {
                const selectedIcon = watch("icon") ?? "MapPin";

                return (
                  <FormItem>
                    {/* <FormLabel>Icon</FormLabel> */}
                    <FormControl>
                      <div className="flex flex-wrap gap-2">
                        <IconPicker
                          value={selectedIcon}
                          onChange={field.onChange}
                        />
                      </div>
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={control}
              name="color"
              render={({ field }) => {
                const selectedColor = watch("color") ?? "#fff";
                let name = selectedColor;

                return (
                  <FormItem>
                    {/* <FormLabel>Color</FormLabel> */}
                    <FormControl>
                      <ColorPicker
                        value={{ hex: selectedColor, name: name }}
                        onChange={(val) => {
                          field.onChange(val.hex);
                          name = val.name;
                        }}
                      />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>Label Name</FormLabel> */}
                  <FormControl>
                    <Input
                      placeholder="e.g., Restaurants, Hotels, Attractions"
                      className=""
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={control}
            name="description"
            render={({ field }) => (
              <FormItem>
                {/* <FormLabel>Label Name</FormLabel> */}
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="e.g., Restaurants, Hotels, Attractions"
                    className=""
                    value={field?.value ?? undefined}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </Form>
      </CardContent>
    </Card>
  );
};

export default LabelForm;
