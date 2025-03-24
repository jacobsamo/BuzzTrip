"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Icons } from "./icons"

interface OAuthButtonsProps {
  onLogin: (provider: string) => void
}

export function OAuthButtons({ onLogin }: OAuthButtonsProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const handleOAuthLogin = (provider: string) => {
    setIsLoading(provider)

    // In a real app, this would redirect to the OAuth provider
    setTimeout(() => {
      onLogin(provider)
      setIsLoading(null)
    }, 1500)
  }

  return (
    <div className="space-y-3">
      <Button
        variant="outline"
        className="w-full"
        onClick={() => handleOAuthLogin("Google")}
        disabled={isLoading !== null}
      >
        {isLoading === "Google" ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}
        Continue with Google
      </Button>

      <Button
        variant="outline"
        className="w-full"
        onClick={() => handleOAuthLogin("Microsoft")}
        disabled={isLoading !== null}
      >
        {isLoading === "Microsoft" ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.microsoft className="mr-2 h-4 w-4" />
        )}
        Continue with Microsoft
      </Button>

      <p className="text-xs text-center text-muted-foreground pt-2">
        We'll create an account if you don't have one yet
      </p>
    </div>
  )
}

