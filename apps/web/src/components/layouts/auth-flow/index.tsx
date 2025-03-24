"use client";
import { Button } from "@/components/ui/button";
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
import { parseAsBoolean, useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import { AccountSecurity } from "./account-security";
import { LoginOptions } from "./login-options";
import { MagicLinkSent } from "./magic-link-sent";
// import { OtpVerification } from "./otp-verification";
import Image from "next/image";
import { Icons } from "./icons";
import { ProfileSetup } from "./profile-setup";

export const AuthForm = () => {
  const router = useRouter();

  const [authStep, setAuthStep] = useQueryState("step", {
    defaultValue: "login",
  });
  const [authMethod, setAuthMethod] = useQueryState("method");
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

    // Simulate API call to verify token
    setTimeout(() => {
      // Simulate user data returned from verification
      const userData = {
        email: email || "user@example.com",
        isNewUser: Math.random() > 0.5, // Randomly determine if new user for demo
        id: "user_" + Math.random().toString(36).substring(2, 9),
      };

      handleAuthSuccess(userData);
    }, 1000);
  };

  const handleAuthSuccess = (userData: any) => {
    setUserProfile(userData);

    if (userData.isNewUser) {
      setIsNewUser(true);
      // For new users, proceed to account security setup
      setAuthStep("security");
    } else {
      router.push("/app");
    }
  };

  // Handle email submission
  const handleEmailSubmit = (submittedEmail: string) => {
    setEmail(submittedEmail);
    setAuthMethod("email");
    setAuthStep("email_sent");

    // In a real app, this would call the API to send the email with magic link and OTP
    console.log("Sending authentication email to:", submittedEmail);
  };

  const handleOtpVerify = (otp: string) => {
    console.log("Verifying OTP:", otp);

    // Simulate API call to verify OTP
    setTimeout(() => {
      // Simulate user data returned from verification
      const userData = {
        email: email,
        isNewUser: Math.random() > 0.5, // Randomly determine if new user for demo
        id: "user_" + Math.random().toString(36).substring(2, 9),
      };

      handleAuthSuccess(userData);
    }, 1000);
  };

  // Handle OAuth login
  const handleOAuthLogin = (provider: string) => {
    setAuthMethod(provider);

    // In a real app, this would redirect to the OAuth provider
    console.log(`Initiating OAuth flow with ${provider}`);

    // Simulate successful OAuth login
    setTimeout(() => {
      const userData = {
        email: `user@${provider.toLowerCase()}.com`,
        isNewUser: Math.random() > 0.5, // Randomly determine if new user for demo
        id: "user_" + Math.random().toString(36).substring(2, 9),
        provider,
      };

      handleAuthSuccess(userData);
    }, 1500);
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
    console.log("Profile data:", profileData);

    // In a real app, this would save the profile data
    // Redirect to dashboard
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
                    onOAuthLogin={handleOAuthLogin}
                  />
                )}

                {authStep === "email_sent" && email && (
                  <MagicLinkSent
                    onEnterOtp={(data) => {
                      setAuthStep("security");

                    }}
                    onBack={() => setAuthStep("login")}
                  />
                )}

                {authStep === "security" && email && (
                  <AccountSecurity
                    onComplete={handleSecurityComplete}
                  />
                )}

                {authStep === "profile" && email && (
                  <ProfileSetup
                    email={email}
                    onComplete={handleProfileComplete}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </CardContent>

          {authStep === "login" && (
            <CardFooter className="flex flex-col space-y-4 pt-0">
              <div className="text-sm text-center text-muted-foreground">
                <p>
                  Don&apos;t have an account?{" "}
                  <Button variant="link" className="p-0 h-auto">
                    Sign up
                  </Button>
                </p>
              </div>
              <div className="text-xs text-center text-muted-foreground">
                <p>
                  By continuing, you agree to our{" "}
                  <Button variant="link" className="p-0 h-auto text-xs">
                    Terms of Service
                  </Button>{" "}
                  and{" "}
                  <Button variant="link" className="p-0 h-auto text-xs">
                    Privacy Policy
                  </Button>
                </p>
              </div>
            </CardFooter>
          )}
        </Card>
      </motion.div>
    </div>
  );
};
