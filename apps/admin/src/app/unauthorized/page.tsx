import { SignOutButton } from "@clerk/nextjs";
import { Button } from "@buzztrip/components/ui";
import { ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="flex justify-center">
          <div className="rounded-full bg-destructive/10 p-6">
            <ShieldAlert className="h-16 w-16 text-destructive" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            Access Denied
          </h1>
          <p className="text-muted-foreground">
            You don't have permission to access the admin dashboard.
            Only authorized administrators can view this page.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <SignOutButton>
            <Button variant="default" className="w-full">
              Sign Out
            </Button>
          </SignOutButton>

          <Link href="https://buzztrip.co">
            <Button variant="outline" className="w-full">
              Return to BuzzTrip
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
