"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Icons } from "./icons";

interface MagicLinkSentProps {
  onEnterOtp: () => void;
  onBack: () => void;
}

const regex = new RegExp(REGEXP_ONLY_DIGITS + "{6}");

const schema = z.object({
  code: z.string().regex(regex),
});

export function MagicLinkSent({ onEnterOtp, onBack }: MagicLinkSentProps) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const code = form.watch("code");

  const resendOtp = async () => {
    // TODO: resend OTP
    console.log("Resending OTP...");
  };

  const onSubmit = async (data: z.infer<typeof schema>) => {
    const verify = await authClient.magicLink.verify({
      query: {
        token: data.code,
      },
    });

    if (verify.error) {
      form.setError("code", {
        message: "Invalid code",
        type: "value",
      });
    } else {
      onEnterOtp();
    }
  };

  return (
    <div className="text-center space-y-4">
      <div className="space-y-2 border rounded-lg p-4 bg-muted/30">
        <div className="flex items-center justify-center space-x-2 text-sm">
          <Icons.link className="h-4 w-4 text-primary" />
          <span>Click the magic link in the email</span>
        </div>
        <div className="text-center text-xs text-muted-foreground">or</div>
        <div className="flex items-center justify-center space-x-2 text-sm">
          <Icons.key className="h-4 w-4 text-primary" />
          <span>Enter the verification code below</span>
        </div>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="code"
            rules={{ pattern: regex }}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg text-center">
                  One-Time Code
                </FormLabel>
                <FormControl>
                  <InputOTP
                    maxLength={6}
                    minLength={6}
                    pattern={REGEXP_ONLY_DIGITS}
                    {...field}
                  >
                    <InputOTPGroup className="gap-4">
                      <InputOTPSlot
                        className="rounded-md size-12"
                        caretClassName="h-5"
                        inputMode="numeric"
                        index={0}
                      />
                      <InputOTPSlot
                        className="rounded-md size-12"
                        caretClassName="h-5"
                        inputMode="numeric"
                        index={1}
                      />
                      <InputOTPSlot
                        className="rounded-md size-12"
                        caretClassName="h-5"
                        inputMode="numeric"
                        index={2}
                      />
                      <InputOTPSlot
                        className="rounded-md size-12"
                        caretClassName="h-5"
                        inputMode="numeric"
                        index={3}
                      />
                      <InputOTPSlot
                        className="rounded-md size-12"
                        caretClassName="h-5"
                        inputMode="numeric"
                        index={4}
                      />
                      <InputOTPSlot
                        className="rounded-md size-12"
                        caretClassName="h-5"
                        inputMode="numeric"
                        index={5}
                      />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormDescription className="flex flex-col gap-2">
                  Please enter 6 digit code sent to your email address to
                  continue.
                  {/* <Button
                  variant="link"
                  onClick={resendOtp}
                  type="button"
                  className="text-foreground"
                >
                  Resend Code
                </Button> */}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-between">
            <Button type="button" variant="outline" onClick={onBack}>
              <Icons.arrowLeft className="size-4 mr-2" />
              Back
            </Button>
            <Button
              type="submit"
              disabled={
                !code ||
                code.length < 6 ||
                !regex.test(code) ||
                form.formState.isSubmitting
              }
            >
              <Icons.arrowRight className="size-4 mr-2" />
              Next
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
