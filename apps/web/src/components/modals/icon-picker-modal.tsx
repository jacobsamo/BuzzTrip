import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { iconsList, type IconType } from "@buzztrip/backend/types";
import Icon, { popularIconsList } from "@buzztrip/components/icon";
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
          <p>Popular</p>
          <div id="popular" className="flex flex-wrap gap-2">
            {popularIconsList.map((icon, index) => (
              <IconButton key={index} icon={icon} />
            ))}
          </div>
          <div>
            {[...iconsList]
              .sort((a, b) => a.categories[0].localeCompare(b.categories[0]))
              .map((icon, index) => (
                <IconButton key={index} icon={icon.id} />
              ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default IconPickerModal;
