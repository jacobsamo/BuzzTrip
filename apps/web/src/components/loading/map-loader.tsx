import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, SearchIcon } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import TabsSkelton from "../ui/skeletons/tabs-skeleton";

const SearchBarSkeleton = () => {
  return (
    <Skeleton className="fixed left-0 right-0 top-6 z-10 mx-auto w-[95%] md:left-[22rem] md:right-4 md:mx-0 bg-white rounded-lg p-2 shadow-md md:w-[30rem] h-10">
      <SearchIcon className="mr-2 h-5 w-5 shrink-0 text-gray-400" />
    </Skeleton>
  );
};

const MapLoader = () => {
  return (
    <div className="flex h-screen bg-background">
      <Skeleton className="w-full h-full" />

      <div id="desktop-view" className="hidden md:flex">
        <div className="fixed top-6 left-1 w-full h-11/12">
          <Skeleton className="bg-white rounded-lg p-2 shadow-md w-72 h-full">
            <Link
              href="/app"
              className={buttonVariants({ variant: "outline", size: "icon" })}
            >
              <ChevronLeft />
            </Link>
            <TabsSkelton />
            <div className="flex flex-col items-center space-y-2 mt-4">
              <Skeleton className="flex h-10 w-10/12 min-w-0 rounded-md px-2" />
              <Skeleton className="flex h-10 w-10/12 min-w-0 rounded-md px-2" />
              <Skeleton className="flex h-10 w-10/12 min-w-0 rounded-md px-2" />
            </div>
          </Skeleton>
        </div>

        <SearchBarSkeleton />
      </div>

      <div id="mobile-view" className="md:hidden">
        <Link
          href="/app"
          prefetch={true}
          className={buttonVariants({
            variant: "outline",
            size: "icon",
            className: "absolute top-2 left-2 z-10",
          })}
        >
          <ChevronLeft />
        </Link>

        <div className="fixed h-1/2 bottom-0 right-0 left-0 z-50 mx-auto flex w-full flex-col rounded-t-[10px] border bg-background p-2 pb-6 overflow-clip">
          <div
            id="drawer-handle"
            className="block mx-auto opacity-70 bg-[#e2e2e4] h-1 w-8 mb-2 rounded-2xl touch-pan-y"
          />

          <TabsSkelton />
          <div className="flex flex-col items-center space-y-2 mt-4">
            <Skeleton className="flex h-10 w-10/12 min-w-0 rounded-md px-2" />
            <Skeleton className="flex h-10 w-10/12 min-w-0 rounded-md px-2" />
            <Skeleton className="flex h-10 w-10/12 min-w-0 rounded-md px-2" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapLoader;
