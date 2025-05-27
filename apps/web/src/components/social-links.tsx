import { cn } from "@/lib/utils";
import { Mail } from "lucide-react";
import Link from "next/link";
import XformerlyTwitter from "./icons/X";
import Bluesky from "./icons/blue-sky";
import GitHub from "./icons/github";
import Instagram from "./icons/instagram";
import LinkedIn from "./icons/linkedIn";

const links = [
  {
    icon: <XformerlyTwitter className="size-6 text-black" />,
    label: "X (Formerly Twitter)",
    href: "https://links.buzztrip.co/twitter",
    color: "hover:text-blue-500",
  },
  {
    icon: <Bluesky className="size-6 text-black" />,
    label: "Bluesky",
    href: "https://links.buzztrip.co/bluesky",
    color: "hover:text-blue-500",
  },
  {
    icon: <Instagram className="size-6 text-black" />,
    label: "Instagram",
    href: "https://links.buzztrip.co/instagram",
    color: "hover:text-blue-500",
  },
  {
    icon: <GitHub className="size-6 text-black" />,
    label: "GitHub",
    href: "https://git.new/buzztrip",
    color: "hover:text-gray-900",
  },
  {
    icon: <LinkedIn className="size-6 text-black" />,
    label: "LinkedIn",
    href: "https://links.buzztrip.co/linkedin",
    color: "hover:text-blue-600",
  },
  {
    icon: <Mail className="size-6 text-black" />,
    label: "Email",
    href: "mailto:hello@buzztrip.co",
    color: "hover:text-primary",
  },
];

const SocialLinks = ({ className, ...props }: React.ComponentProps<"div">) => {
  return (
    <div
      className={cn("flex justify-center items-center space-x-6", className)}
      {...props}
    >
      {links.map((social, index) => (
        <Link
          key={index}
          href={social.href}
          className={`size-10 md:size-12 hover:scale-110 bg-white rounded-full flex items-center justify-center shadow-md text-gray-600 transition-colors ${social.color}`}
        >
          {social.icon}
        </Link>
      ))}
    </div>
  );
};

export default SocialLinks;
