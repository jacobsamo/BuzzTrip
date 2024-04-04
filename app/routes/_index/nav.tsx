import { Button, buttonVariants } from "@/components/ui/button";
import { Link } from "@remix-run/react";
// import { FireIcon, MenuIcon } from '@/icons';

export default function Nav() {
  return (
    <div className="m-auto flex size-full max-w-screen-2xl items-center justify-between px-3 py-4 2xl:px-12">
      <div className="flex items-center justify-start gap-2 min-[375px]:gap-4 lg:gap-0 2xl:flex-1">
        <img
          src="/logos/logo_x128.png"
          alt="Logo"
          width={64}
          height={64}
          className="h-16 w-16 rounded-full"
        />
      </div>
      <div className="hidden gap-8 lg:flex"></div>
      <div className="flex justify-end gap-2 2xl:flex-1">
        <Link to="/auth" className={buttonVariants()}>
          Sign In
        </Link>
      </div>
    </div>
  );
}
