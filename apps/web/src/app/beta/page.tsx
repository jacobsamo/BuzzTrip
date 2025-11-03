"use client";

import { useUser } from "@clerk/nextjs";
import { Badge } from "@buzztrip/ui/components/badge";
import { Button } from "@buzztrip/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@buzztrip/ui/components/card";
import { Checkbox } from "@buzztrip/ui/components/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@buzztrip/ui/components/form";
import { Input } from "@buzztrip/ui/components/input";
import { betaQuickSignupSchema } from "@/types/scheams";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { CheckCircle2, Crown, Loader2, MessageSquare, Rocket } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { api } from "@buzztrip/backend/api";

export default function BetaSignupPage() {
  const { user, isSignedIn } = useUser();
  const quickSignup = useMutation(api.beta.quickBetaSignup);

  const [submitted, setSubmitted] = useState(false);
  const [requiresConfirmation, setRequiresConfirmation] = useState(false);
  const [alreadyConfirmed, setAlreadyConfirmed] = useState(false);
  const [resentConfirmation, setResentConfirmation] = useState(false);

  const form = useForm<z.infer<typeof betaQuickSignupSchema>>({
    resolver: zodResolver(betaQuickSignupSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.primaryEmailAddress?.emailAddress || "",
      whatsappOptIn: false,
    },
  });

  const {
    control,
    formState: { isSubmitting },
  } = form;

  // Update form values when user data loads
  useEffect(() => {
    if (user && isSignedIn) {
      form.reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.primaryEmailAddress?.emailAddress || "",
        whatsappOptIn: false,
      });
    }
  }, [user, isSignedIn, form]);

  const onSubmit = async (data: z.infer<typeof betaQuickSignupSchema>) => {
    try {
      const result = await quickSignup(data);

      if (result.success) {
        setSubmitted(true);
        setRequiresConfirmation(result.requiresConfirmation ?? false);
        setAlreadyConfirmed(result.alreadyConfirmed ?? false);
        setResentConfirmation(result.resentConfirmation ?? false);

        if (result.alreadyConfirmed) {
          toast.success("You've already completed the beta signup. Please sign in.");
        } else if (result.resentConfirmation) {
          toast.success("Confirmation email resent! Please check your inbox.");
        } else if (result.requiresConfirmation) {
          toast.success("Please check your email to confirm your beta signup.");
        }
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred. Please try again.");
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-primary/10 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-2xl"
        >
          <Card className="border-primary/20 shadow-xl">
            <CardHeader className="text-center pb-8">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-bold mb-2">
                {alreadyConfirmed ? "Already Confirmed!" : resentConfirmation ? "Email Resent!" : "Check Your Email!"}
              </CardTitle>
              <CardDescription className="text-lg">
                {alreadyConfirmed
                  ? "You've already completed the beta signup process."
                  : resentConfirmation
                    ? "We've resent your confirmation email."
                    : "We've sent you a confirmation link to get started."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {alreadyConfirmed && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <p className="text-green-900 text-sm">
                    You've already confirmed your email and completed the questionnaire. Please sign in to access your beta account.
                  </p>
                </div>
              )}

              {(resentConfirmation || requiresConfirmation) && !alreadyConfirmed && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-blue-900 text-sm font-semibold mb-2">
                    📧 Check your inbox for the confirmation email
                  </p>
                  <p className="text-blue-800 text-sm">
                    Click the confirmation link in the email, then you'll be able to complete the questionnaire and get beta access.
                  </p>
                  <p className="text-blue-700 text-xs mt-2">
                    Don't see it? Check your spam folder or click "Join Beta Program" again to resend.
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                {alreadyConfirmed ? (
                  <>
                    <Button asChild className="flex-1">
                      <Link href="/sign-in">Sign In</Link>
                    </Button>
                    <Button variant="outline" asChild className="flex-1">
                      <Link href="/">Back to Home</Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" asChild className="flex-1">
                      <Link href="/">Back to Home</Link>
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <Badge className="bg-primary/10 text-primary border-primary/20 mb-6">
              Limited Beta Access
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Join the BuzzTrip Beta
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Be among the first to shape the future of custom mapping. Get early access, exclusive perks, and help us build the perfect tool for you.
            </p>
          </motion.div>

          {/* Benefits Grid */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12"
          >
            {[
              {
                icon: Rocket,
                title: "Early Access",
                description: "Get first access to new features before anyone else",
              },
              {
                icon: MessageSquare,
                title: "Direct Feedback",
                description: "Shape the product with direct line to our team",
              },
              {
                icon: Crown,
                title: "Exclusive Perks",
                description: "Special benefits and recognition as a founding member",
              },
            ].map((benefit, index) => (
              <Card key={index} className="border-gray-200">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Quick Signup Form */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="border-gray-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl">Join the Beta</CardTitle>
                  <CardDescription>
                    {isSignedIn && user
                      ? `Signing up as ${user.firstName || user.primaryEmailAddress?.emailAddress || "you"}`
                      : "Quick signup - we'll send you a detailed questionnaire via email"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      {!isSignedIn && (
                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={control}
                            name="firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="John" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={control}
                            name="lastName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Last Name (Optional)</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Doe" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      )}

                      {!isSignedIn && (
                        <FormField
                          control={control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address</FormLabel>
                              <FormControl>
                                <Input {...field} type="email" placeholder="john@example.com" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      <FormField
                        control={control}
                        name="whatsappOptIn"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="font-normal cursor-pointer">
                                Join our beta tester WhatsApp group
                              </FormLabel>
                              <p className="text-sm text-gray-500">
                                Get instant updates, connect with other testers, and chat directly with our team
                              </p>
                            </div>
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="size-4 animate-spin mr-2" />
                            Joining...
                          </>
                        ) : (
                          "Join Beta Program"
                        )}
                      </Button>

                      <p className="text-xs text-gray-500 text-center">
                        By joining the beta, you agree to our{" "}
                        <Link href="/legal/terms" className="underline">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/legal/privacy" className="underline">
                          Privacy Policy
                        </Link>
                        .
                      </p>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              <Card className="mt-6 bg-blue-50 border-blue-200">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">What happens next?</h3>
                  <ol className="space-y-2 text-sm text-gray-600 list-decimal list-inside">
                    <li>You'll receive a confirmation email - click the link to verify your email</li>
                    <li>After confirming, you'll complete a quick 3-minute questionnaire about your needs</li>
                    <li>Once submitted, you'll instantly get beta access to all features</li>
                    <li>Your feedback helps us build features you actually want</li>
                  </ol>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
