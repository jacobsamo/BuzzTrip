import React from "react";
import { AppSidebar } from "./components/map-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import MapView from "./map";

export function Map_page() {
  return (
    <SidebarProvider className="h-dvh w-full">
      <AppSidebar />
      <SidebarTrigger />
      <MapView />
    </SidebarProvider>
  );
}
