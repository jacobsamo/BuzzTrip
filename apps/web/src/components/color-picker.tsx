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
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { HslColor, HsvaColor, hsvaToHex, HsvColor } from "@uiw/color-convert";
import Colorful from "@uiw/react-color-colorful";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Hash,
  Palette,
} from "lucide-react";
import React, { useState } from "react";

type Color = {
  hex: string;
  name: string;
};

interface ColorPickerProps {
  value?: Color;
  onChange?: (color: Color) => void;
  className?: string;
}

// Expanded color palette with commonly used colors
const colors: Color[] = [
  // Whites and Grays
  { hex: "#ffffff", name: "White" },
  { hex: "#f8f9fa", name: "Light Gray" },
  { hex: "#e9ecef", name: "Gray 100" },
  { hex: "#dee2e6", name: "Gray 200" },
  { hex: "#ced4da", name: "Gray 300" },
  { hex: "#adb5bd", name: "Gray 400" },
  { hex: "#6c757d", name: "Gray 500" },
  { hex: "#495057", name: "Gray 600" },
  { hex: "#343a40", name: "Gray 700" },
  { hex: "#212529", name: "Gray 800" },
  { hex: "#000000", name: "Black" },

  // Reds
  { hex: "#ffebee", name: "Red 50" },
  { hex: "#ffcdd2", name: "Red 100" },
  { hex: "#ef9a9a", name: "Red 200" },
  { hex: "#e57373", name: "Red 300" },
  { hex: "#ef5350", name: "Red 400" },
  { hex: "#f44336", name: "Red 500" },
  { hex: "#e53935", name: "Red 600" },
  { hex: "#d32f2f", name: "Red 700" },
  { hex: "#c62828", name: "Red 800" },
  { hex: "#b71c1c", name: "Red 900" },

  // Pinks
  { hex: "#fce4ec", name: "Pink 50" },
  { hex: "#f8bbd9", name: "Pink 100" },
  { hex: "#f48fb1", name: "Pink 200" },
  { hex: "#f06292", name: "Pink 300" },
  { hex: "#ec407a", name: "Pink 400" },
  { hex: "#e91e63", name: "Pink 500" },
  { hex: "#d81b60", name: "Pink 600" },
  { hex: "#c2185b", name: "Pink 700" },
  { hex: "#ad1457", name: "Pink 800" },
  { hex: "#880e4f", name: "Pink 900" },

  // Purples
  { hex: "#f3e5f5", name: "Purple 50" },
  { hex: "#e1bee7", name: "Purple 100" },
  { hex: "#ce93d8", name: "Purple 200" },
  { hex: "#ba68c8", name: "Purple 300" },
  { hex: "#ab47bc", name: "Purple 400" },
  { hex: "#9c27b0", name: "Purple 500" },
  { hex: "#8e24aa", name: "Purple 600" },
  { hex: "#7b1fa2", name: "Purple 700" },
  { hex: "#6a1b9a", name: "Purple 800" },
  { hex: "#4a148c", name: "Purple 900" },

  // Blues
  { hex: "#e3f2fd", name: "Blue 50" },
  { hex: "#bbdefb", name: "Blue 100" },
  { hex: "#90caf9", name: "Blue 200" },
  { hex: "#64b5f6", name: "Blue 300" },
  { hex: "#42a5f5", name: "Blue 400" },
  { hex: "#2196f3", name: "Blue 500" },
  { hex: "#1e88e5", name: "Blue 600" },
  { hex: "#1976d2", name: "Blue 700" },
  { hex: "#1565c0", name: "Blue 800" },
  { hex: "#0d47a1", name: "Blue 900" },

  // Cyans
  { hex: "#e0f2f1", name: "Cyan 50" },
  { hex: "#b2dfdb", name: "Cyan 100" },
  { hex: "#80cbc4", name: "Cyan 200" },
  { hex: "#4db6ac", name: "Cyan 300" },
  { hex: "#26a69a", name: "Cyan 400" },
  { hex: "#009688", name: "Cyan 500" },
  { hex: "#00897b", name: "Cyan 600" },
  { hex: "#00796b", name: "Cyan 700" },
  { hex: "#00695c", name: "Cyan 800" },
  { hex: "#004d40", name: "Cyan 900" },

  // Greens
  { hex: "#e8f5e8", name: "Green 50" },
  { hex: "#c8e6c9", name: "Green 100" },
  { hex: "#a5d6a7", name: "Green 200" },
  { hex: "#81c784", name: "Green 300" },
  { hex: "#66bb6a", name: "Green 400" },
  { hex: "#4caf50", name: "Green 500" },
  { hex: "#43a047", name: "Green 600" },
  { hex: "#388e3c", name: "Green 700" },
  { hex: "#2e7d32", name: "Green 800" },
  { hex: "#1b5e20", name: "Green 900" },

  // Yellows
  { hex: "#fffde7", name: "Yellow 50" },
  { hex: "#fff9c4", name: "Yellow 100" },
  { hex: "#fff59d", name: "Yellow 200" },
  { hex: "#fff176", name: "Yellow 300" },
  { hex: "#ffee58", name: "Yellow 400" },
  { hex: "#ffeb3b", name: "Yellow 500" },
  { hex: "#fdd835", name: "Yellow 600" },
  { hex: "#f9a825", name: "Yellow 700" },
  { hex: "#f57f17", name: "Yellow 800" },
  { hex: "#ff6f00", name: "Yellow 900" },

  // Oranges
  { hex: "#fff3e0", name: "Orange 50" },
  { hex: "#ffe0b2", name: "Orange 100" },
  { hex: "#ffcc80", name: "Orange 200" },
  { hex: "#ffb74d", name: "Orange 300" },
  { hex: "#ffa726", name: "Orange 400" },
  { hex: "#ff9800", name: "Orange 500" },
  { hex: "#fb8c00", name: "Orange 600" },
  { hex: "#f57c00", name: "Orange 700" },
  { hex: "#ef6c00", name: "Orange 800" },
  { hex: "#e65100", name: "Orange 900" },

  // Browns
  { hex: "#efebe9", name: "Brown 50" },
  { hex: "#d7ccc8", name: "Brown 100" },
  { hex: "#bcaaa4", name: "Brown 200" },
  { hex: "#a1887f", name: "Brown 300" },
  { hex: "#8d6e63", name: "Brown 400" },
  { hex: "#795548", name: "Brown 500" },
  { hex: "#6d4c41", name: "Brown 600" },
  { hex: "#5d4037", name: "Brown 700" },
  { hex: "#4e342e", name: "Brown 800" },
  { hex: "#3e2723", name: "Brown 900" },
];

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

  const selectedClasses = {
    sm: " scale-110",
    md: " scale-110",
    lg: " scale-110",
    full: "scale-110",
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
            handleHexInput(color.hex)
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

export function ColorPicker({ value, onChange, className }: ColorPickerProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(0);
  const [selectedColor, setSelectedColor] = React.useState<Color>(
    value || colors[0]!
  );

  const PER_PAGE = 32; // 8 columns x 5 rows
  const totalPages = Math.ceil(colors.length / PER_PAGE);

  // Filter colors based on search query (name or hex)
  // const filteredColors = React.useMemo(() => {
  //   if (!searchQuery) return colors;

  //   const query = searchQuery.toLowerCase();
  //   return colors.filter(
  //     (color) =>
  //       color.name.toLowerCase().includes(query) ||
  //       color.hex.toLowerCase().includes(query)
  //   );
  // }, [searchQuery]);

  const filteredColors = React.useMemo(() => {
    if (!searchQuery) return colors;

    const query = searchQuery.toLowerCase().trim(); // Trim whitespace
    const queryWords = query.split(/\s+/).filter(word => word.length > 0); // Split into words

    return colors.filter(color => {
      const lowerName = color.name.toLowerCase();
      const lowerHex = color.hex.toLowerCase();

      // Check if ALL query words are present in either name or hex
      const allQueryWordsMatch = queryWords.every(queryWord =>
        lowerName.includes(queryWord) || lowerHex.includes(queryWord)
      );

      // Optional: Add a check for matching at word boundaries for better relevance
      const wordBoundaryMatch = queryWords.some(queryWord => {
        const nameRegex = new RegExp(`\\b${queryWord}\\b`); // Word boundary regex
        const hexRegex = new RegExp(`\\b${queryWord}\\b`);
        return nameRegex.test(lowerName) || hexRegex.test(lowerHex);
      });

      // You can adjust the logic here based on how strict you want the match to be.
      // For "proper" text search without fuzzy matching, ensuring all words
      // are present is a good starting point.
      return allQueryWordsMatch || wordBoundaryMatch;
    });
  }, [searchQuery, colors]);

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
      <PopoverTrigger className={cn("aspect-square", className)}>
        <div
          className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex size-10 items-center justify-center rounded-md border focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          aria-label={`Selected color: ${selectedColor.name} (${selectedColor.hex})`}
        >
          {selectedColor ? (
            <DisplayColor color={selectedColor} size="full" />
          ) : (
            <ChevronsUpDown className="h-5 w-5 opacity-50" />
          )}
        </div>
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
