"use client";

import { useMapStore } from "@/components/providers/map-state-provider";
import { Button } from "@buzztrip/ui/components/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@buzztrip/ui/components/tooltip";
import { cn } from "@/lib/utils";
import { Timer } from "lucide-react";
import { useState } from "react";
import { CreateBoundaryModal } from "./create-boundary-modal";

const AddBoundaryButton = () => {
  const { isMobile, searchValue } = useMapStore((state) => state);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Tooltip delayDuration={1000}>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className={cn("fixed z-50", {
              "right-2 top-[60px]": isMobile,
              "top-[68px] left-[420px]": !isMobile,
              "z-0": searchValue && !isMobile,
            })}
            onClick={() => setModalOpen(true)}
          >
            <Timer className="h-5 w-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Add Travel Time Boundary</p>
        </TooltipContent>
      </Tooltip>

      <CreateBoundaryModal open={modalOpen} onOpenChange={setModalOpen} />
    </>
  );
};

export default AddBoundaryButton;
