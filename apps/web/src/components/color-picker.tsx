"use client";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverTriggerProps,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { colors } from "@/lib/data";
import { cn } from "@/lib/utils";
import type { Color } from "@/types";
import Colorful from "@uiw/react-color-colorful";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Hash,
  Palette,
} from "lucide-react";
import React from "react";

interface ColorPickerProps
  extends Omit<PopoverTriggerProps, "value" | "onChange"> {
  value?: Color;
  onChange?: (color: Color) => void;
}

const DisplayColor = ({
  color,
  selected = false,
  size = "md",
}: {
  color: Color;
  selected?: boolean;
  size?: "sm" | "md" | "lg" | "full";
}) => {
  const sizeClasses = {
    sm: "size-5",
    md: "size-8",
    lg: "size-12",
    full: "size-full",
  };

  return (
    <div
      className={cn(
        "group rounded-md border-2 border-transparent transition-all duration-200",
        sizeClasses[size],
        {
          //   [selectedClasses[size]]: selected,
          "border-gray-400 shadow-lg": selected,
        }
      )}
      style={{ backgroundColor: color.hex }}
      aria-label={`Color ${color.name} (${color.hex})`}
    />
  );
};

const Picker = ({
  onColorSelect,
  selectedColor,
}: {
  onColorSelect: (color: Color) => void;
  selectedColor: Color;
}) => {
  const handleHexInput = (value: string) => {
    if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
      const color: Color = { hex: value, name: "Custom Color" };
      onColorSelect(color);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <Colorful
          color={selectedColor.hex}
          disableAlpha={true}
          onChange={(color) => {
            handleHexInput(color.hex);
          }}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="hex-input" className="text-sm font-medium">
          Hex Color Code
        </Label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Hash className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="hex-input"
              value={selectedColor.hex.replace("#", "")}
              onChange={(e) => handleHexInput(`#${e.target.value}`)}
              placeholder="000000"
              className="pl-10"
              maxLength={6}
            />
          </div>
          <div
            className="w-10 h-10 rounded border-2 border-gray-300"
            style={{ backgroundColor: selectedColor.hex }}
            aria-label={`Preview of color ${selectedColor}`}
          />
        </div>
      </div>
    </div>
  );
};

export function ColorPicker({
  value,
  onChange,
  className,
  ...props
}: ColorPickerProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(0);
  const [selectedColor, setSelectedColor] = React.useState<Color>(
    value || colors[0]!
  );

  const PER_PAGE = 32; // 8 columns x 5 rows
  const totalPages = Math.ceil(colors.length / PER_PAGE);

  // Filter colors based on search query (name or hex)
  const filteredColors = React.useMemo(() => {
    if (!searchQuery) return colors;

    const query = searchQuery.toLowerCase();
    return colors.filter(
      (color) =>
        color.name.toLowerCase().includes(query) ||
        color.hex.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Get current page colors
  const currentPageColors = React.useMemo(() => {
    const startIdx = currentPage * PER_PAGE;
    const endIdx = startIdx + PER_PAGE;
    return filteredColors.slice(startIdx, endIdx);
  }, [filteredColors, currentPage]);

  const totalFilteredPages = Math.ceil(filteredColors.length / PER_PAGE);

  const handleColorSelect = (color: Color, open: boolean = false) => {
    setSelectedColor(color);
    onChange?.(color);
    setOpen(open);
  };

  const handleNextPage = () => {
    if (currentPage < totalFilteredPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Reset page when search query changes
  React.useEffect(() => {
    setCurrentPage(0);
  }, [searchQuery]);

  React.useEffect(() => {
    if (value) {
      setSelectedColor(value);
    }
  }, [value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        {...props}
        className={cn(
          "border-input bg-background ring-offset-background placeholder:text-muted-foreground flex size-10 items-center justify-center rounded-md border focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        aria-label={`Selected color: ${selectedColor.name} (${selectedColor.hex})`}
      >
        {selectedColor ? (
          <DisplayColor color={selectedColor} size="full" />
        ) : (
          <ChevronsUpDown className="h-5 w-5 opacity-50" />
        )}
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Tabs defaultValue="palette" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="palette" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Palette
            </TabsTrigger>
            <TabsTrigger value="picker" className="flex items-center gap-2">
              <Hash className="h-4 w-4" />
              Picker
            </TabsTrigger>
          </TabsList>

          <TabsContent value="palette" className="mt-0">
            <Command>
              <CommandInput
                placeholder="Search colors by name or hex code..."
                value={searchQuery}
                onValueChange={setSearchQuery}
              />
              <CommandList>
                {currentPageColors.length === 0 ? (
                  <CommandEmpty>No colors found.</CommandEmpty>
                ) : (
                  <CommandGroup>
                    <div className="grid grid-cols-8 gap-2 p-3">
                      {currentPageColors.map((color) => (
                        <Button
                          key={color.hex}
                          variant="ghost"
                          className={cn(
                            "h-12 w-12 p-1 relative hover:bg-accent",
                            value?.hex === color.hex && "ring-2 ring-primary"
                          )}
                          onClick={() => handleColorSelect(color)}
                          title={`${color.name} (${color.hex})`}
                          aria-label={`Select color ${color.name} (${color.hex})`}
                        >
                          <DisplayColor
                            color={color}
                            selected={value?.hex === color.hex}
                            size="md"
                          />
                          {value?.hex === color.hex && (
                            <Check className="absolute -top-1 -right-1 h-4 w-4 text-primary bg-white rounded-full" />
                          )}
                        </Button>
                      ))}
                    </div>

                    {totalFilteredPages > 1 && (
                      <div className="flex items-center justify-between border-t p-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handlePrevPage}
                          disabled={currentPage === 0}
                          aria-label="Previous page"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm text-muted-foreground">
                          Page {currentPage + 1} of {totalFilteredPages}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleNextPage}
                          disabled={currentPage >= totalFilteredPages - 1}
                          aria-label="Next page"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </CommandGroup>
                )}
              </CommandList>
            </Command>
          </TabsContent>

          <TabsContent value="picker" className="mt-0 p-4">
            <Picker
              onColorSelect={(color) => handleColorSelect(color, true)}
              selectedColor={selectedColor}
            />
          </TabsContent>
        </Tabs>

        {/* Selected Color Preview */}
        {/* <div className="border-t p-3 bg-muted/30">
          <div className="flex items-center gap-3">
            <DisplayColor color={selectedColor} size="lg" />
            <div className="flex-1">
              <p className="font-medium text-sm">{selectedColor.name}</p>
              <p className="text-xs text-muted-foreground font-mono">
                {selectedColor.hex.toUpperCase()}
              </p>
            </div>
          </div>
        </div> */}
      </PopoverContent>
    </Popover>
  );
}
