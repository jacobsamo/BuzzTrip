"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { useMediaQuery } from "@uidotdev/usehooks";
import { Authenticated, Unauthenticated } from "convex/react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

const NavbarLinks = () => (
  <>
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
    <Link
      href="/blog"
      className="text-gray-600 hover:text-primary transition-colors"
    >
      Blog
    </Link>
  </>
);

const NavbarAuth = () => (
  <>
    <Authenticated>
      <Link
        href={"/app"}
        prefetch={true}
        className={cn(
          buttonVariants(),
          "text-base sm:text-base md:text-base lg:text-base"
        )}
      >
        Continue to app
      </Link>
    </Authenticated>
    <Unauthenticated>
      <SignInButton>
        <Button
          variant={"outline"}
          className={cn(
            "hidden sm:inline-flex border-primary text-primary hover:bg-primary hover:text-white",
            "text-base sm:text-base md:text-base lg:text-base",
            "h-8 sm:h-8 md:h-9 lg:h-10"
          )}
        >
          Sign In
        </Button>
      </SignInButton>
      <SignUpButton>
        <Button
          className={cn(
            "text-base sm:text-base md:text-base lg:text-base",
            "h-8 sm:h-8 md:h-9 lg:h-10"
          )}
        >
          Get Started
        </Button>
      </SignUpButton>
    </Unauthenticated>
  </>
);

const Navbar = () => {
  const pathname = usePathname();
  if (pathname.includes("/app")) return null;
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useMediaQuery("only screen and (max-width : 768px)");

  // Prevent scroll when menu is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-sm z-50"
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between relative">
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
        {/* Desktop nav */}
        <nav className="hidden md:flex items-center space-x-8">
          <NavbarLinks />
        </nav>
        <div className="hidden md:flex items-center space-x-4">
          <NavbarAuth />
        </div>
        {/* Mobile: show auth buttons always, then hamburger */}
        {isMobile && (
          <div className="flex items-center gap-2">
            <NavbarAuth />
            <button
              type="button"
              className="flex flex-col items-end justify-center gap-1 z-50 ml-2 cursor-pointer"
              aria-label="Open menu"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span
                className={cn(
                  "shadow-[0px_4px_4px_rgba(0,0,0,0.25)] delay-[0.3s] box-border block h-[2.3px] w-4 rounded-sm bg-black transition-all ease-in-out dark:bg-white",
                  { "w-[1.625rem] translate-y-[6px] rotate-45": isOpen }
                )}
              ></span>
              <span
                className={cn(
                  "shadow-[0px_4px_4px_rgba(0,0,0,0.25)] delay-[0.3s] box-border block h-[2.3px] w-[1.625rem] rounded-sm bg-black transition-all ease-in-out dark:bg-white",
                  { "opacity-0": isOpen }
                )}
              ></span>
              <span
                className={cn(
                  "shadow-[0px_4px_4px_rgba(0,0,0,0.25)] delay-[0.3s] box-border block h-[2.3px] w-[1.3125rem] rounded-sm bg-black transition-all ease-in-out dark:bg-white",
                  { "w-[1.625rem] -translate-y-[6px] -rotate-45": isOpen }
                )}
              ></span>
            </button>
          </div>
        )}
        {/* Mobile full-screen menu overlay */}
        {isMobile && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-[72px] left-0 right-0 bg-white w-full h-screen z-[100] flex flex-col items-center px-8 py-6 shadow-lg"
          >
            <nav className="flex flex-col items-center gap-8 text-lg font-medium">
              <NavbarLinks />
            </nav>
            <div className="flex flex-col gap-4 mt-8 w-full max-w-xs">
              <NavbarAuth />
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};

export default Navbar;
