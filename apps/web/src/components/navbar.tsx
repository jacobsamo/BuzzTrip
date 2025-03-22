"use client";
import { buttonVariants } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  const { data } = useSession();

  return (
    <header className="m-auto flex h-14 items-center px-4 lg:px-6">
      <Link className="flex items-center justify-center" href="/">
        <Image
          width={44}
          height={44}
          src="/logos/logo_x48.png"
          alt="Logo"
          className="h-11 w-11 rounded-full"
        />
        <span className="ml-2 text-2xl font-bold">BuzzTrip</span>
      </Link>
      <nav className="ml-auto flex items-center gap-4 sm:gap-6">
        <Link
          className="text-sm font-medium underline-offset-4 hover:underline"
          href="#features"
        >
          Features
        </Link>
        <div>
          {data?.session ? (
            <Link
              href={"/auth/login"}
              className={buttonVariants({ variant: "link" })}
            >
              Login
            </Link>
          ) : (
            <Link href={"/app"} className={buttonVariants()}>
              Go To app
            </Link>
          )}
        </div>
        {/* <Link
            className="text-sm font-medium underline-offset-4 hover:underline"
            href="#testimonials"
          >
            Testimonials
          </Link>
          <Link
            className="text-sm font-medium underline-offset-4 hover:underline"
            href="#pricing"
          >
            Pricing
          </Link> */}
      </nav>
    </header>
  );
};

export default Navbar;
