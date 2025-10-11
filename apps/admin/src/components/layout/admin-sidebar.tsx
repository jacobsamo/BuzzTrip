"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@buzztrip/ui/components/avatar";
import { Badge } from "@buzztrip/ui/components/badge";
import { Button } from "@buzztrip/ui/components/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@buzztrip/ui/components/sidebar";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { LayoutDashboard, LogOut, Map, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Users",
    href: "/users",
    icon: Users,
  },
  {
    title: "Maps",
    href: "/maps",
    icon: Map,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { user } = useUser();

  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "AD";

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-lg font-bold">B</span>
          </div>
          <div>
            <h2 className="text-lg font-semibold">BuzzTrip</h2>
            <p className="text-xs text-muted-foreground">Admin Portal</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={isActive}>
                  <Link href={item.href}>
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center justify-between gap-2 px-4 py-3 border-t">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={user?.imageUrl}
                alt={user?.fullName || "Admin"}
              />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">
                {user?.fullName || "Admin"}
              </span>
              <Badge variant="outline" className="w-fit text-xs">
                Admin
              </Badge>
            </div>
          </div>
          <SignOutButton>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <LogOut className="h-4 w-4" />
            </Button>
          </SignOutButton>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
