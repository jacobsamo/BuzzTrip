"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@buzztrip/components";
import { Button, Alert, AlertDescription } from "@buzztrip/components/ui";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="container mx-auto p-6 min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-red-600">Access Denied</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertDescription>
              You don&apos;t have permission to access the BuzzTrip Admin Portal.
            </AlertDescription>
          </Alert>

          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              This portal is restricted to BuzzTrip administrators only.
            </p>

            <div className="flex flex-col gap-2">
              <div className="flex justify-center">
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10"
                    }
                  }}
                />
              </div>

              <p className="text-xs text-muted-foreground">
                You are signed in, but don&apos;t have admin privileges.
              </p>
            </div>

            <div className="pt-4">
              <Link href="https://buzztrip.com" target="_blank">
                <Button variant="outline" className="w-full">
                  Go to BuzzTrip
                </Button>
              </Link>
            </div>

            <p className="text-xs text-muted-foreground">
              If you believe this is an error, please contact your administrator.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}