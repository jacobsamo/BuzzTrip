"use client";

import { api } from "@buzztrip/backend/api";
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
import { RadioGroup, RadioGroupItem } from "@buzztrip/ui/components/radio-group";
import { Textarea } from "@buzztrip/ui/components/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const betaSignupSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  currentTools: z.string().min(1, "Please tell us about your current tools"),
  hacksWorkarounds: z.string().optional(),
  appsUsed: z.array(z.string()).optional(),
  appsUsedOther: z.string().optional(),
  paidApps: z.string().optional(),
  howDidYouFind: z.string().min(1, "Please let us know how you found BuzzTrip"),
});

type BetaSignupForm = z.infer<typeof betaSignupSchema>;

const APPS_OPTIONS = [
  "Google Maps",
  "WhatsApp",
  "Notion",
  "Trello",
  "Google Docs",
  "Apple Maps",
];

export default function BetaSignupPage() {
  const submitBetaSignup = useMutation(api.beta.submitBetaSignup);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    scenario?: string;
  } | null>(null);

  const form = useForm<BetaSignupForm>({
    resolver: zodResolver(betaSignupSchema),
    defaultValues: {
      email: "",
      currentTools: "",
      hacksWorkarounds: "",
      appsUsed: [],
      appsUsedOther: "",
      paidApps: "",
      howDidYouFind: "",
    },
  });

  const {
    control,
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (data: BetaSignupForm) => {
    try {
      // Build responses object
      const responses = {
        currentTools: data.currentTools,
        hacksWorkarounds: data.hacksWorkarounds || "",
        appsUsed: data.appsUsedOther
          ? [...(data.appsUsed || []), `Other: ${data.appsUsedOther}`].join(", ")
          : (data.appsUsed || []).join(", "),
        paidApps: data.paidApps || "",
        howDidYouFind: data.howDidYouFind,
      };

      const result = await submitBetaSignup({
        email: data.email,
        responses,
      });

      setResult(result);
    } catch (error) {
      console.error("Beta signup error:", error);
      setResult({
        success: false,
        message: "Something went wrong. Please try again.",
      });
    }
  };

  // Success state
  if (result?.success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full">
          <CardHeader className="text-center pb-8">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <CardTitle className="text-3xl font-bold mb-2">
              Success! 🎉
            </CardTitle>
            <CardDescription className="text-lg">
              {result.message}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {result.scenario === "new_signup" && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>Next step:</strong> Look for an email from Jacob Samorowski with your
                  signup link. Check your spam folder if you don't see it within a few minutes.
                </p>
              </div>
            )}

            {result.scenario === "existing_user_upgraded" && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-900">
                  <strong>You're all set!</strong> You can now access beta features and join our
                  WhatsApp community. Check your email for the WhatsApp group link!
                </p>
              </div>
            )}

            <div className="mt-6 text-center">
              <Button
                onClick={() => window.location.href = "/"}
                variant="outline"
              >
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Form state
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">Limited Beta Access</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Join BuzzTrip Beta
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Help shape the future of custom mapping. Answer a few quick questions to join
            our exclusive beta program and get early access to new features.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12 pb-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Beta Application</CardTitle>
              <CardDescription>
                This should only take 2-3 minutes. Your feedback will help us build the best mapping
                platform possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  {/* Email */}
                  <FormField
                    control={control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder="your@email.com"
                            className="mt-1"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Current Tools */}
                  <FormField
                    control={control}
                    name="currentTools"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>What tools do you currently use when planning trips? *</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="e.g., Google Maps, TripAdvisor, Notion, etc."
                            className="mt-1 min-h-[100px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Hacks/Workarounds */}
                  <FormField
                    control={control}
                    name="hacksWorkarounds"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>What hacks or workarounds have you been using when planning?</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Share your current planning process..."
                            className="mt-1 min-h-[100px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Apps Used Together */}
                  <FormField
                    control={control}
                    name="appsUsed"
                    render={() => (
                      <FormItem>
                        <FormLabel className="text-base">
                          What apps do you use together to plan a trip?
                        </FormLabel>
                        <div className="space-y-3 mt-3">
                          {APPS_OPTIONS.map((app) => (
                            <FormField
                              key={app}
                              control={control}
                              name="appsUsed"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={app}
                                    className="flex flex-row items-center space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(app)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...(field.value || []), app])
                                            : field.onChange(
                                                field.value?.filter((value) => value !== app)
                                              );
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal cursor-pointer">
                                      {app}
                                    </FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Other Apps */}
                  <FormField
                    control={control}
                    name="appsUsedOther"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Other apps (please specify)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Any other apps you use?" className="mt-1" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Paid Apps */}
                  <FormField
                    control={control}
                    name="paidApps"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Do you currently pay for any travel or planning apps? If so, which ones?
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="List any paid apps, or leave blank"
                            className="mt-1"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* How Did You Find Us */}
                  <FormField
                    control={control}
                    name="howDidYouFind"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>How did you find BuzzTrip? *</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-2"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="social" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                Social Media
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="search" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                Search Engine
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="friend" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                Friend/Referral
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="other" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">Other</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Submit Button */}
                  <div className="pt-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-primary hover:bg-primary/90 text-white text-lg py-6"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="size-4 animate-spin mr-2" />
                          Submitting...
                        </>
                      ) : (
                        "Join Beta Program"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
