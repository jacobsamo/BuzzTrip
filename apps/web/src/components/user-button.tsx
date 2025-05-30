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
    router.prefetch("/auth/sign-in"); // make rerouting faster
    try {
      // https://www.better-auth.com/docs/authentication/email-password#sign-out
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/auth/sign-in"); // redirect to login page
          },
        },
      });
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
          width={40}
          height={40}
          className="size-10 rounded-full"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {/* <DropdownMenuItem>Profile</DropdownMenuItem> */}
        <DropdownMenuItem onClick={() => handleLogout()}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
