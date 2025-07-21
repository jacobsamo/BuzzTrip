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
import { type IconType, iconsList } from "@buzztrip/backend/types";
import Icon from "@buzztrip/components/icon";
import { Check, ChevronLeft, ChevronRight, ChevronsUpDown } from "lucide-react";
import * as React from "react";

type IconList = {
  id: IconType;
  title: string;
  categories: readonly string[];
};

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
  const [currentPageIcons, setCurrentPageIcons] = React.useState<IconList[]>(
    []
  );

  React.useEffect(() => {
    try {
      const startIdx = currentPage * ICONS_PER_PAGE;
      const endIdx = Math.min(startIdx + ICONS_PER_PAGE, iconsList.length);
      if (startIdx < endIdx) {
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

    // Filter the icons on the current page using icon.title
    const searchResults = currentPageIcons.filter((icon) => {
      const lowerIconTitle = icon.title.toLowerCase();

      const anyQueryWordMatches = queryWords.some((queryWord) =>
        lowerIconTitle.includes(queryWord)
      );

      const wordBoundaryMatch = queryWords.some((queryWord) => {
        const escapedQueryWord = queryWord.replace(
          /[.*+?^${}()|[\]\\]/g,
          "\\$&"
        );
        const nameRegex = new RegExp(`\\b${escapedQueryWord}\\b`);
        return nameRegex.test(lowerIconTitle);
      });

      return anyQueryWordMatches || wordBoundaryMatch;
    });

    return searchResults;
  }, [currentPageIcons, searchQuery]);

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
      <PopoverTrigger
        className={cn(
          "border-input bg-background ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex h-10 w-10 items-center justify-center rounded-md border focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
      >
        {selectedIcon ? (
          <Icon name={selectedIcon} size={20} />
        ) : (
          <ChevronsUpDown className="h-5 w-5 opacity-50" />
        )}
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
                  {filteredIcons.map((icon) => (
                    <div
                      key={icon.id}
                      role="button"
                      onClick={() => {
                        onChange?.(icon.id);
                        setSelectedIcon(icon.id);
                        setOpen(false);
                      }}
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-md border",
                        "hover:bg-accent hover:text-accent-foreground",
                        value === icon.id && "border-primary bg-primary/10",
                        "relative"
                      )}
                      title={icon.title}
                    >
                      <Icon name={icon.id} size={20} />
                      {value === icon.id && (
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
