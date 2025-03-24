"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Icons } from "./icons"

interface PasskeyFormProps {
  email: string
  onSuccess: () => void
}

export function PasskeyForm({ email, onSuccess }: PasskeyFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handlePasskeyAuth = async () => {
    setIsLoading(true)

    // In a real app, this would trigger the WebAuthn/passkey flow
    // For demo purposes, we'll simulate a successful authentication
    setTimeout(() => {
      setIsLoading(false)
      onSuccess()
    }, 1500)
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border p-4 text-center space-y-4">
        <div className="mx-auto bg-primary/10 p-2 rounded-full w-12 h-12 flex items-center justify-center">
          <Icons.key className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-medium">Use a passkey</h3>
          <p className="text-sm text-muted-foreground mt-1">Quickly and securely sign in with your device</p>
        </div>
        <Button onClick={handlePasskeyAuth} className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Icons.loader className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            "Continue with Passkey"
          )}
        </Button>
      </div>
      <p className="text-xs text-center text-muted-foreground">
        No passkey? We'll help you create one after signing in.
      </p>
    </div>
  )
}

