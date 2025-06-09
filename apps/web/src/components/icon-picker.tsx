"use client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import Icon from "@buzztrip/components/icon";
import type { IconType } from "@buzztrip/backend/types";
import { iconsList } from "@buzztrip/backend/types/icon";
import { Check, ChevronLeft, ChevronRight, ChevronsUpDown } from "lucide-react";
import * as React from "react";

interface IconPickerProps {
  value?: IconType;
  onChange?: (icon: IconType) => void;
  className?: string;
}

export function IconPicker({ value, onChange, className }: IconPickerProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(0);
  const ICONS_PER_PAGE = 24; // 8 columns x 3 rows
  const totalPages = Math.ceil(iconsList.length / ICONS_PER_PAGE);
  const [selectedIcon, setSelectedIcon] = React.useState<IconType>("Map");

  // Get current page icons
  const [currentPageIcons, setCurrentPageIcons] = React.useState<IconType[]>(
    []
  );

  React.useEffect(() => {
    try {
      const startIdx = currentPage * ICONS_PER_PAGE;
      const endIdx = Math.min(
        startIdx + ICONS_PER_PAGE - 1,
        iconsList.length - 1
      );
      if (startIdx <= endIdx) {
        const icons = iconsList.slice(startIdx, endIdx);
        setCurrentPageIcons(icons);
      }
    } catch (e) {
      console.error("Error fetching icons:", e);
      setCurrentPageIcons([]);
    }
  }, [currentPage, iconsList]);

  const filteredIcons = React.useMemo(() => {
    if (!searchQuery) {
      // If no search query, return the icons for the current page
      return currentPageIcons;
    }

    const query = searchQuery.toLowerCase().trim();
    const queryWords = query.split(/\s+/).filter((word) => word.length > 0);

    // Filter the icons on the current page
    const searchResults = currentPageIcons.filter((iconName) => {
      const lowerIconName = iconName.toLowerCase();

      // Option 1: Simple includes check for each word
      // return queryWords.every(queryWord => lowerIconName.includes(queryWord));

      // Option 2: Check if ANY of the query words are included in the icon name
      // This might be more suitable for icon names which are often single words or hyphenated
      const anyQueryWordMatches = queryWords.some((queryWord) =>
        lowerIconName.includes(queryWord)
      );

      // Option 3: Combine includes and potentially word boundary checks (more like the color example)
      const allWordsIncluded = queryWords.every((queryWord) =>
        lowerIconName.includes(queryWord)
      );

      const wordBoundaryMatch = queryWords.some((queryWord) => {
        // Escape special regex characters in the query word
        const escapedQueryWord = queryWord.replace(
          /[.*+?^${}()|[\]\\]/g,
          "\\$&"
        );
        const nameRegex = new RegExp(`\\b${escapedQueryWord}\\b`);
        return nameRegex.test(lowerIconName);
      });

      // Choose the logic that best fits how you want to search for icon names.
      // For icons, Option 2 or a combination like Option 3 might be good.
      return anyQueryWordMatches || wordBoundaryMatch; // Example using a combination
    });

    console.log("Search results:", searchResults);
    return searchResults;
  }, [currentPageIcons, searchQuery]); // Dependencies

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
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

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className={cn("aspect-square", className)}>
        <div className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex h-10 w-10 items-center justify-center rounded-md border focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50">
          {selectedIcon ? (
            <Icon name={selectedIcon} size={20} />
          ) : (
            <ChevronsUpDown className="h-5 w-5 opacity-50" />
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[360px] p-0" align="start">
        <Command>
          <CommandInput
            placeholder="Search icons..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            {filteredIcons.length === 0 ? (
              <CommandEmpty>No icons found.</CommandEmpty>
            ) : (
              <CommandGroup>
                <div className="grid grid-cols-8 gap-2 p-2">
                  {filteredIcons.map((iconName) => (
                    <div
                      key={iconName}
                      role="button"
                      onClick={() => {
                        onChange?.(iconName);
                        setSelectedIcon(iconName);
                        setOpen(false);
                      }}
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-md border",
                        "hover:bg-accent hover:text-accent-foreground",
                        value === iconName && "border-primary bg-primary/10",
                        "relative"
                      )}
                      title={iconName}
                    >
                      <Icon name={iconName} size={20} />
                      {value === iconName && (
                        <Check className="text-primary absolute top-1 right-1 h-3 w-3" />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between border-t p-2">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 0}
                    className="hover:bg-accent rounded-md p-1 disabled:opacity-50"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="text-muted-foreground text-xs">
                    Page {currentPage + 1} of {totalPages}
                  </span>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage >= totalPages - 1}
                    className="hover:bg-accent rounded-md p-1 disabled:opacity-50"
                    aria-label="Next page"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
