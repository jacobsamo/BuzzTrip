"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient, useSession } from "@/lib/auth-client";
import Image from "next/image";

export const UserButton = () => {
  const { data } = useSession();

  if (!data || !data.user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Image
          src={data.user.image ?? "/placeholder.svg"}
          alt={data.user.name}
          width={32}
          height={32}
          className="size-16 rounded-full"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem onClick={() => authClient.signOut()}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
