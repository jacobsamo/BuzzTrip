import { Skeleton } from "../skeleton";


export default function TabSkeleton() {
  return (
    <div
      role="tablist"
      className="mt-2 outline-none bg-muted text-muted-foreground inline-flex h-9 items-center rounded-lg p-[3px] mx-auto w-11/12 justify-evenly"
      tabIndex={0}
      
    >
      <Skeleton
        role="tab"
        aria-selected="true"
        aria-controls="radix-«r2e»-content-collections"
        data-state="active"
        id="radix-«r2e»-trigger-collections"
        data-slot="tabs-trigger"
        className="text-gray-600 data-[state=active]:bg-background focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30  dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&amp;_svg]:pointer-events-none [&amp;_svg]:shrink-0 [&amp;_svg:not([class*='size-'])]:size-4"
        tabIndex={0}
        data-orientation="horizontal"
        data-radix-collection-item=""
      >
        Collections
      </Skeleton>
      <Skeleton
    
        role="tab"
        aria-selected="false"
        aria-controls="radix-«r2e»-content-markers"
        data-state="inactive"
        id="radix-«r2e»-trigger-markers"
        data-slot="tabs-trigger"
        className="text-gray-600 data-[state=active]:bg-background focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30  dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&amp;_svg]:pointer-events-none [&amp;_svg]:shrink-0 [&amp;_svg:not([class*='size-'])]:size-4"
        tabIndex={-1}
        data-orientation="horizontal"
        data-radix-collection-item=""
      >
        Markers
      </Skeleton>
    </div>
    // <div
    //   role="tablist"
    //   className="bg-muted text-muted-foreground inline-flex h-9 items-center rounded-lg p-[3px] mx-auto w-11/12 justify-evenly"

    // >
    //       <Skeleton

    //       role="tab"
    //       className="inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] "
    //       tabIndex={0}
    //       data-orientation="horizontal"
    //     />

    //     <Skeleton

    //       role="tab"
    //       className="inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] "
    //       tabIndex={-1}
    //       data-orientation="horizontal"
    //     />
    // </div>
  );
}
