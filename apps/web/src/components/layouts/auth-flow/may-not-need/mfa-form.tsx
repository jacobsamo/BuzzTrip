"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Icons } from "./icons"

interface MfaFormProps {
  onSuccess: () => void
  onBack: () => void
}

export function MfaForm({ onSuccess, onBack }: MfaFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [code, setCode] = useState("")

  const handleVerify = () => {
    setIsLoading(true)

    // In a real app, this would verify the MFA code
    // For demo purposes, we'll simulate a successful verification
    setTimeout(() => {
      setIsLoading(false)
      onSuccess()
    }, 1000)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" onClick={onBack} className="p-0">
          <Icons.arrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <p className="text-sm text-muted-foreground">Multi-factor authentication</p>
      </div>

      <div className="rounded-lg border p-4 text-center space-y-4">
        <div className="mx-auto bg-primary/10 p-2 rounded-full w-12 h-12 flex items-center justify-center">
          <Icons.shield className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-medium">Enter verification code</h3>
          <p className="text-sm text-muted-foreground mt-1">Enter the code from your authenticator app</p>
        </div>
        <Input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="000000"
          className="text-center text-lg"
          maxLength={6}
        />
        <Button onClick={handleVerify} className="w-full" disabled={isLoading || code.length !== 6}>
          {isLoading ? (
            <>
              <Icons.loader className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify"
          )}
        </Button>
      </div>
    </div>
  )
}

