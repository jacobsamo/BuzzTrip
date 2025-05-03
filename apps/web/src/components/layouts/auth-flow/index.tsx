"use client";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { parseAsBoolean, parseAsStringLiteral, useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import { AccountSecurity } from "./account-security";
import { LoginOptions } from "./login-options";
import { MagicLinkSent } from "./magic-link-sent";
// import { OtpVerification } from "./otp-verification";
import { authClient, User } from "@/lib/auth-client";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { authSteps, Icons, providers } from "./helpers";
import { ProfileSetup } from "./profile-setup";

interface AuthFormProps {
  mode: "sign-up" | "sign-in";
}

export const AuthForm = ({ mode }: AuthFormProps) => {
  const router = useRouter();

  const [authStep, setAuthStep] = useQueryState(
    "step",
    parseAsStringLiteral(authSteps).withDefault("login")
  );
  const [authMethod, setAuthMethod] = useQueryState(
    "method",
    parseAsStringLiteral(providers)
  );
  const [token, setToken] = useQueryState("token");
  const [isNewUser, setIsNewUser] = useQueryState(
    "isNewUser",
    parseAsBoolean.withDefault(true)
  );
  const [email, setEmail] = useQueryState("email");

  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    if (token && authStep === "login") {
      // Verify token with Better-auth
      verifyMagicLink(token);
    }
  }, [token, authStep]);

  // Simulate magic link verification
  const verifyMagicLink = async (token: string) => {
    console.log("Verifying magic link token:", token);
    if (!token || !email) {
      toast.error("Invalid token or email");
      router.push("/auth/sign-in");
    }
    // Simulate API call to verify token and get user data
    const verify = await authClient.magicLink.verify({
      query: {
        token: `${email}:${token}`,
      },
    });
  };

  const handleAuthSuccess = (userData: User & { isNewUser: boolean }) => {
    setUserProfile(userData);

    if (userData.isNewUser) {
      setIsNewUser(true);
      // For new users, proceed to account security setup
      //TODO: setup later once we have security features implmented
      setAuthStep("profile");
    } else {
      router.push("/app");
    }
  };

  // Handle email submission
  const handleEmailSubmit = (submittedEmail: string) => {
    setEmail(submittedEmail);
    setAuthMethod("email");
    setAuthStep("email_sent");
  };

  // Handle security setup completion
  const handleSecurityComplete = () => {
    // For email users who need to complete profile
    if (authMethod === "email") {
      setAuthStep("profile");
    } else {
      // For OAuth users, redirect to dashboard
      router.push("/app");
    }
  };

  // Handle profile setup completion
  const handleProfileComplete = (profileData: any) => {
    router.push("/app");
  };

  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="border-2">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">
              {authStep === "login" && (
                <>
                  <Image
                    src={"/logos/logo_x128.png"}
                    alt="logo"
                    width={64}
                    height={64}
                    className="mx-auto size-16 rounded-full"
                  />
                  Welcome back
                </>
              )}
              {authStep === "email_sent" && (
                <>
                  <div className="mx-auto bg-primary/10 p-3 rounded-full size-16 flex items-center justify-center">
                    <Icons.mail className="size-8 text-primary" />
                  </div>
                  Check your email
                </>
              )}
              {authStep === "security" && "Secure your account"}
              {authStep === "profile" && "Complete your profile"}
            </CardTitle>
            <CardDescription>
              {authStep === "login" &&
                "Sign in to access your maps and saved locations"}
              {authStep === "email_sent" && (
                <p className="text-sm text-muted-foreground">
                  We've sent an email to{" "}
                  <span className="font-medium">{email}</span>
                </p>
              )}
              {authStep === "security" &&
                "Add an extra layer of protection to your account"}
              {authStep === "profile" && "Tell us a bit about yourself"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={authStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="min-h-[200px]"
              >
                {authStep === "login" && (
                  <LoginOptions
                    onEmailSubmit={handleEmailSubmit}
                    onOAuthLogin={(provider) => setAuthMethod(provider)}
                  />
                )}

                {authStep === "email_sent" && email && (
                  <MagicLinkSent
                    email={email}
                    onEnterOtp={(data) => {
                      handleAuthSuccess({
                        ...data,
                        isNewUser: !data.first_name || !data.name,
                      });
                    }}
                    onBack={() => setAuthStep("login")}
                  />
                )}

                {authStep === "security" && email && (
                  <AccountSecurity onComplete={handleSecurityComplete} />
                )}

                {authStep === "profile" && (
                  <ProfileSetup onComplete={handleProfileComplete} />
                )}
              </motion.div>
            </AnimatePresence>
          </CardContent>

          {authStep === "login" && (
            <CardFooter className="flex flex-col space-y-4 pt-0">
              {mode === "sign-in" ? (
                <p className="text-sm text-center text-muted-foreground">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/auth/sign-up"
                    replace={true}
                    className={buttonVariants({
                      variant: "link",
                      size: "noPadding",
                      className: "p-0",
                    })}
                  >
                    Sign up
                  </Link>
                </p>
              ) : (
                <p className="text-sm text-center text-muted-foreground">
                  Already have an account?{" "}
                  <Link
                    href="/auth/sign-in"
                    replace={true}
                    className={buttonVariants({
                      variant: "link",
                      size: "noPadding",
                      className: "h-auto text-sm",
                    })}
                  >
                    Sign in
                  </Link>
                </p>
              )}
              <p className="text-xs text-center text-muted-foreground">
                By continuing, you agree to our{" "}
                <Link
                  href="/legal/terms"
                  className={buttonVariants({
                    variant: "link",
                    size: "noPadding",
                    className: "h-auto text-xs",
                  })}
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/legal/privacy"
                  className={buttonVariants({
                    variant: "link",
                    size: "noPadding",
                    className: "h-auto text-xs",
                  })}
                >
                  Privacy Policy
                </Link>
              </p>
            </CardFooter>
          )}
        </Card>
      </motion.div>
    </div>
  );
};
