import { Drawer } from "vaul";
import { useGlobalContext } from "./providers/global_provider";
import type { ComponentProps, ReactNode } from "react";

interface MainDrawerProps {
  children: ReactNode;
  options?: ComponentProps<typeof Drawer.Root>;
}

export default function MainDrawer({ children, options }: MainDrawerProps) {
  const { snap, setSnap } = useGlobalContext();

  return (
    <Drawer.Root
      open
      dismissible={false}
      snapPoints={[0.2, 0.5, 0.75]}
      activeSnapPoint={snap}
      setActiveSnapPoint={setSnap}
      modal={false}
      fixed={true}
    >
      <Drawer.Content className="border-b-none fixed bottom-0 left-0 right-0 mx-auto flex h-full max-h-[97%] w-full flex-col overflow-auto rounded-t-[10px] border border-gray-200 bg-white md:w-3/4">
        <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-slate-600" />
        {children}
      </Drawer.Content>
    </Drawer.Root>
  );
}