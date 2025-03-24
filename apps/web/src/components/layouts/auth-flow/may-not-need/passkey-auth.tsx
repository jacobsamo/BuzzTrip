"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "./icons"

export function PasskeyAuth() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handlePasskeyAuth = () => {
    setIsLoading(true)

    // In a real app, this would trigger the WebAuthn flow
    setTimeout(() => {
      setIsLoading(false)
      alert("Passkey authentication is not implemented in this demo")
    }, 1500)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="passkey-email">Email address</Label>
        <Input
          id="passkey-email"
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <Button onClick={handlePasskeyAuth} className="w-full" disabled={isLoading || !email}>
        {isLoading ? (
          <>
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            Verifying...
          </>
        ) : (
          <>
            <Icons.key className="mr-2 h-4 w-4" />
            Continue with Passkey
          </>
        )}
      </Button>

      <p className="text-xs text-center text-muted-foreground">Use your device's biometrics or security key</p>
    </div>
  )
}

