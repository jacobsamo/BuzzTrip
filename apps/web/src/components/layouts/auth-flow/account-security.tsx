"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { motion } from "motion/react"
import { useState } from "react";
import { Icons } from "./helpers";

interface AccountSecurityProps {
  onComplete: () => void;
}

export function AccountSecurity({ onComplete }: AccountSecurityProps) {
  const [enableMfa, setEnableMfa] = useState(false);
  const [enablePasskey, setEnablePasskey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = () => {
    setIsLoading(true);

    // Simulate API call to save security preferences
    setTimeout(() => {
      setIsLoading(false);
      onComplete();
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Icons.shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Multi-factor authentication</p>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security with an authenticator app
                    </p>
                  </div>
                </div>
                <Switch checked={enableMfa} onCheckedChange={setEnableMfa} />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Icons.key className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Create a passkey</p>
                    <p className="text-sm text-muted-foreground">
                      Sign in quickly and securely with your device
                    </p>
                  </div>
                </div>
                <Switch
                  checked={enablePasskey}
                  onCheckedChange={setEnablePasskey}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Button onClick={handleContinue} className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            Saving preferences...
          </>
        ) : (
          "Skip"
        )}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        You can always change these settings later
      </p>
    </div>
  );
}
