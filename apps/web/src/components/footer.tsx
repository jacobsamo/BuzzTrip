"use client";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SocialLinks from "./social-links";

const Footer = () => {
  const pathname = usePathname();

  if (pathname.includes("/app")) return null;

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="bg-gray-900 text-white py-16"
    >
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="md:col-span-2"
          >
            <div className="flex items-center space-x-3 mb-6">
              <Image
                src="/logos/logo_x128.png"
                alt="BuzzTrip Logo"
                width={40}
                height={40}
                className="size-11 rounded-full"
              />
              <span className="text-2xl font-bold">BuzzTrip</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              The next-generation mapping platform that brings the power of
              Google Maps and Google My Maps together in one seamless,
              cross-platform experience.
            </p>
            <SocialLinks className="flex-wrap justify-start space-x-4" />
          </motion.div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  href="#features"
                  className="hover:text-white transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/roadmap"
                  className="hover:text-white transition-colors"
                >
                  Roadmap
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="hover:text-white transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="hover:text-white transition-colors"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  href="/help"
                  className="hover:text-white transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/privacy"
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/terms"
                  className="hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center"
        >
          <p className="text-gray-400">
            © {new Date().getFullYear()} BuzzTrip. All rights reserved.
          </p>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
