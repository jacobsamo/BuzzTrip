"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Icons, Provider } from "./helpers";

interface LoginOptionsProps {
  onEmailSubmit: (email: string) => void;
  onOAuthLogin: (provider: Provider | null) => void;
}

const schema = z.object({ email: z.string().email() });

export function LoginOptions({
  onEmailSubmit,
  onOAuthLogin,
}: LoginOptionsProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const handleEmailSubmit = async (email: string) => {
    setIsLoading("email");
    await authClient.signIn
      .magicLink({
        email: email,
        callbackURL: `${window.location.origin}/app`, //redirect after successful login (optional)
      })
      .then(() => setIsLoading(null));
    onEmailSubmit(email);
  };

  const handleOAuthLogin = (provider: "google" | "microsoft") => {
    setIsLoading(provider);
    onOAuthLogin(provider);
    return authClient.signIn.social({
      provider: provider,
      callbackURL: `${window.location.origin}/app`,
      newUserCallbackURL: `${window.location.origin}/auth/sign-up?method=${provider}&step=profile`,
      errorCallbackURL: `${window.location.origin}/auth/sign-up?method=error`,
    });
  };

  return (
    <div className="space-y-6">
      {/* OAuth Buttons */}
      <div className="space-y-3">
        <Button
          variant="outline"
          className="w-full h-11 text-base font-medium"
          onClick={() => handleOAuthLogin("google")}
          disabled={isLoading !== null}
        >
          {isLoading === "google" ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.google className="mr-2 h-5 w-5" />
          )}
          Continue with Google
        </Button>

        <Button
          variant="outline"
          className="w-full h-11 text-base font-medium"
          onClick={() => handleOAuthLogin("microsoft")}
          disabled={isLoading !== null}
        >
          {isLoading === "microsoft" ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.microsoft className="mr-2 h-5 w-5" />
          )}
          Continue with Microsoft
        </Button>
        {/* 
        <Button
          variant="outline"
          className="w-full h-11 text-base font-medium"
          onClick={() => handleOAuthLogin("passkey")}
          disabled={isLoading !== null}
        >
          {isLoading === "passkey" ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.key className="mr-2 h-5 w-5" />
          )}
          Continue with Passkey
        </Button> */}
      </div>

      {/* Divider */}
      {/* <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div> */}

      {/* Email Form */}
      {/* <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data: z.infer<typeof schema>) =>
            handleEmailSubmit(data.email)
          )}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="email"
            rules={{ required: true }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="john@exmaple.com" {...field} />
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full h-11 text-base font-medium"
            disabled={isLoading !== null}
          >
            {isLoading === "email" ? (
              <>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Continue with Email"
            )}
          </Button>
        </form> */}
      {/* </Form> */}
    </div>
  );
}
