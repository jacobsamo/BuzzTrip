import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const SidebarSkeleton = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="bg-background border-sidebar-border flex h-full w-full flex-col rounded-lg border shadow-sm">
      {/* Header Skeleton */}
      <div className="p-2">
        <Skeleton className="h-8 w-3/4 mb-2 rounded-md" />
      </div>
      {/* Main Content Skeleton (menu items) */}
      <div className="flex-1 flex flex-col gap-2 px-2 pb-2 overflow-auto">
        {/* Example: 3 menu item skeletons */}
        <Skeleton className="h-8 w-full rounded-md" />
        <Skeleton className="h-8 w-5/6 rounded-md" />
        <Skeleton className="h-8 w-2/3 rounded-md" />
        {/* Allow custom children (e.g., for footer or extra content) */}
        {children}
      </div>
    </div>
  );
};

export default SidebarSkeleton;
