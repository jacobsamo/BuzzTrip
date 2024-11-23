import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import Icon, {
  accommodationIconsList,
  activitiesIconsList,
  foodIconsList,
  placesIconsList,
  popularIconsList,
  transportIconsList,
} from "@buzztrip/components/icon";
import type { IconType } from "@buzztrip/db/types";
import { Button } from "../ui/button";

interface IconPickerModalProps {
  selectedIcon: IconType;
  setSelectedIcon: (icon: IconType) => void;
}

const IconPickerModal = ({
  selectedIcon,
  setSelectedIcon,
}: IconPickerModalProps) => {
  const IconButton = ({ icon }: { icon: IconType }) => {
    return (
      <Button
        key={icon}
        type="button"
        variant="ghost"
        onClick={() => setSelectedIcon(icon)} // Handle icon selection
        className={cn("group text-black", {
          "scale-105 border border-gray-500 shadow-lg": selectedIcon == icon,
        })}
      >
        <Icon name={icon} size={24} />
      </Button>
    );
  };

  return (
    <Dialog>
      <DialogTrigger>More Icons...</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select an icon</DialogTitle>
        </DialogHeader>

        <ScrollArea>
          <div id="popular" className="flex flex-wrap gap-2">
            {popularIconsList.map((icon, index) => (
              <IconButton key={index} icon={icon} />
            ))}
          </div>
          <div id="activities" className="flex flex-wrap gap-2">
            {activitiesIconsList.map((icon, index) => (
              <IconButton key={index} icon={icon} />
            ))}
          </div>

          <div id="accommodation" className="flex flex-wrap gap-2">
            {accommodationIconsList.map((icon, index) => (
              <IconButton key={index} icon={icon} />
            ))}
          </div>

          <div id="food" className="flex flex-wrap gap-2">
            {foodIconsList.map((icon, index) => (
              <IconButton key={index} icon={icon} />
            ))}
          </div>

          <div id="places" className="flex flex-wrap gap-2">
            {placesIconsList.map((icon, index) => (
              <IconButton key={index} icon={icon} />
            ))}
          </div>

          <div id="transport" className="flex flex-wrap gap-2">
            {transportIconsList.map((icon, index) => (
              <IconButton key={index} icon={icon} />
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default IconPickerModal;
