import { Button, buttonVariants } from "@/components/ui/button";
import { colors } from "@/lib/data";
import { cn } from "@/lib/utils";
import Icon, { popularIconsList } from "@buzztrip/components/icon";
import { Label } from "@buzztrip/db/types";
import { labelsEditSchema } from "@buzztrip/db/zod-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import IconPickerModal from "../modals/icon-picker-modal";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { useMapFormContext } from "./provider";

const LabelForm = ({ label }: { label: Label }) => {
  const { removeLabel, updateLabel } = useMapFormContext();
  const form = useForm<z.infer<typeof labelsEditSchema>>({
    resolver: zodResolver(labelsEditSchema),
    defaultValues: {
      ...label,
    },
  });
  const { control, watch, formState } = form;

  // Store the last updated values to compare against
  const lastUpdatedValues = useRef<z.infer<typeof labelsEditSchema> | null>(null);
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Watch all form values
  const currentValues = watch();

  // Function to check if current values are different from last updated values
  const hasChangedSinceLastUpdate = () => {
    if (!lastUpdatedValues.current) return true;
    
    return JSON.stringify(currentValues) !== JSON.stringify(lastUpdatedValues.current);
  };

  // Auto-update function
  useEffect(() => {
    // Clear existing timeout
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    // Only proceed if form is dirty (has changes from initial values)
    if (formState.isDirty && hasChangedSinceLastUpdate()) {
      // Set a debounced update after 1 second of no changes
      updateTimeoutRef.current = setTimeout(() => {
        // Double-check that values are still different
        if (hasChangedSinceLastUpdate()) {
          updateLabel(label.label_id, currentValues);
          // Store the current values as the last updated values
          lastUpdatedValues.current = { ...currentValues };
        }
      }, 1000); // 1 second debounce
    }

    // Cleanup timeout on unmount
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, [currentValues, formState.isDirty, label.label_id, updateLabel]);

  return (
    <Card key={label.label_id} className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm">Label {label.label_id}</CardTitle>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => removeLabel(label.label_id!)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <FormField
            control={form.control}
            name={`title`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Label Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Restaurants, Hotels, Attractions"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={control}
              name="icon"
              render={({ field }) => {
                const selectedIcon = watch("icon") ?? "MapPin";

                return (
                  <FormItem>
                    <FormLabel>Icon</FormLabel>
                    <FormControl>
                      <div className="flex flex-wrap gap-2">
                        {!popularIconsList.includes(selectedIcon as any) && (
                          <div
                            className={buttonVariants({
                              variant: "ghost",
                              className:
                                "scale-105 border border-gray-500 text-black shadow-lg",
                            })}
                          >
                            <Icon name={selectedIcon} size={24} />
                          </div>
                        )}
                        {popularIconsList.map((icon, index) => (
                          <Button
                            key={index}
                            type="button"
                            variant="ghost"
                            onClick={() => field.onChange(icon)} // Handle icon selection
                            className={cn("group text-black", {
                              "scale-105 border border-gray-500 shadow-lg":
                                selectedIcon == icon,
                            })}
                          >
                            <Icon name={icon} size={24} />
                          </Button>
                        ))}
                        <IconPickerModal
                          selectedIcon={selectedIcon}
                          setSelectedIcon={field.onChange}
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
                const selectedColor = watch("color");

                return (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <div className="flex flex-wrap gap-2">
                        {colors.map((color, index) => (
                          <button
                            onClick={() => field.onChange(color.hex)}
                            key={index}
                            className={cn(
                              "group h-8 w-8 scale-100 rounded-md",
                              {
                                "h-9 w-9 scale-110 border border-gray-500 shadow-lg":
                                  selectedColor == color.hex,
                              }
                            )}
                            style={{ backgroundColor: color.hex }}
                            type="button"
                          ></button>
                        ))}
                        <Input
                          type="color"
                          value={field.value ?? "#000"}
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
          </div>
        </Form>
      </CardContent>
    </Card>
  );
};

export default LabelForm;
