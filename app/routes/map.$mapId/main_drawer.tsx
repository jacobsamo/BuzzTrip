"use client";
import { activeSnapPoint } from "@/lib/atoms";
import * as React from "react";

import { Drawer } from "vaul";
import { useGlobalContext } from "./providers/global_provider";

interface MainDrawerProps {
  children: React.ReactNode;
  options?: React.ComponentProps<typeof Drawer.Root>;
}

export default function MainDrawer({ children, options }: MainDrawerProps) {
  const {snap, setSnap} = useGlobalContext();

  return (
    <Drawer.Root
      open
      dismissible={false}
      snapPoints={[0.1, 0.2, 0.5, 0.75]}
      activeSnapPoint={snap}
      setActiveSnapPoint={setSnap}
      modal={false}
    >
      <Drawer.Portal>
        <Drawer.Content className="border-b-none w-full fixed bottom-0 left-0 right-0 mx-auto flex h-full max-h-[97%] flex-col rounded-t-[10px] border border-gray-200 bg-white md:w-3/4">
          <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-slate-600" />
          {children}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
