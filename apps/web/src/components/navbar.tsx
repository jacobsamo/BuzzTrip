"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Authenticated, Unauthenticated } from "convex/react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();
  if (pathname.includes("/app")) return null;

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-sm z-50"
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3">
          <Image
            src="/logos/logo_x128.png"
            alt="BuzzTrip Logo"
            width={44}
            height={44}
            className="size-11 rounded-full"
          />
          <span className="text-2xl font-bold text-primary">BuzzTrip</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href="/#features"
            className="text-gray-600 hover:text-primary transition-colors"
          >
            Features
          </Link>
          <Link
            href="/pricing"
            className="text-gray-600 hover:text-primary transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="/roadmap"
            className="text-gray-600 hover:text-primary transition-colors"
          >
            Roadmap
          </Link>
          <Link
            href="/about"
            className="text-gray-600 hover:text-primary transition-colors"
          >
            About
          </Link>
          <Authenticated>
            <Link href={"/app"} prefetch={true} className={buttonVariants()}>
              Continue to app
            </Link>
          </Authenticated>
          <Unauthenticated>
            <SignInButton>
              <Button
                variant={"outline"}
                className="border-primary text-primary hover:bg-primary hover:text-white"
              >
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton>
              <Button
                // className="border-primary text-primary hover:bg-primary hover:text-white"
              >
                Get Started
              </Button>
            </SignUpButton>
          </Unauthenticated>
        </nav>
      </div>
    </motion.header>
  );
};

export default Navbar;
