"use client";

import { usePathname } from "next/navigation";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@buzztrip/components/ui";
import { AdminSidebar } from "./admin-sidebar";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Don't show sidebar on auth pages
  const isAuthPage = pathname.startsWith("/sign-in") || pathname === "/unauthorized";

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex-1" />
        </header>
        <main className="flex-1">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
