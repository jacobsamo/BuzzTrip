import React from "react";

const MapViewSkeleton = () => {
  return (
    <div className="animate-pluse h-full w-full">
      <div
        id="search"
        className="fixed inset-x-0 top-4 z-10 mx-auto w-[95%] animate-pulse md:w-1/2"
      >
        <div className="flex resize items-center justify-center rounded-xl bg-white p-1 pr-5">
          <div className="flex h-full w-full flex-col overflow-hidden rounded-md bg-white">
            <div className="flex items-center justify-center gap-2 px-3">
              <div className="mr-2 h-5 w-5 rounded bg-gray-200"></div>
              <div className="h-10 w-full rounded bg-gray-200"></div>
              <div className="h-5 w-5 rounded bg-gray-200"></div>
            </div>
            <div className="my-1 h-4 w-full rounded bg-gray-200"></div>
            <div className="h-4 w-1/2 rounded bg-gray-200"></div>
          </div>
        </div>
      </div>

      <div id="map" className="h-full w-full"></div>

      <div
        id="drawer"
        className="border-b-none fixed bottom-0 left-0 right-0 mx-auto flex h-[5%] max-h-[97%] w-full animate-pulse flex-col overflow-auto rounded-t-[10px] border border-gray-200 bg-white md:w-3/4"
      >
        <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-gray-200"></div>
        <div className="h-full w-full bg-gray-200"></div>
      </div>
    </div>
  );
};

export default MapViewSkeleton;
