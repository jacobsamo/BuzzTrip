"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient, useSession } from "@/lib/auth-client";
import Image from "next/image";
import { useRouter } from "next/navigation";

export const UserButton = () => {
  const router = useRouter();
  const { data } = useSession();

  if (!data || !data.user) return null;

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      // Force a router refresh before redirecting
      router.refresh();
      router.push("/auth/sign-in");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Image
          src={data.user.image ?? "/placeholder.svg"}
          alt={data.user.id}
          width={64}
          height={64}
          className="size-16 rounded-full"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleLogout()}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
