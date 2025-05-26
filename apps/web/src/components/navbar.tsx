"use client";
import { buttonVariants } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  const { data } = useSession();

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
          {data?.session ? (
            <Link href={"/app"} className={buttonVariants()}>
              Continue to app
            </Link>
          ) : (
            <>
              <Link
                href={"/auth/sign-in"}
                className={buttonVariants({
                  variant: "outline",
                  className:
                    "border-primary text-primary hover:bg-primary hover:text-white",
                })}
              >
                Sign In
              </Link>
              <Link
                href={"/auth/sign-up"}
                className={buttonVariants({
                  className:
                    "border-primary text-primary hover:bg-primary hover:text-white",
                })}
              >
                Get Started
              </Link>
            </>
          )}
        </nav>
      </div>
    </motion.header>
  );
};

export default Navbar;
