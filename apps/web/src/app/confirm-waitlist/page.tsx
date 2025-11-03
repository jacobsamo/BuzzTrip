"use client";

import { useUser } from "@clerk/nextjs";
import { Badge } from "@buzztrip/ui/components/badge";
import { Button } from "@buzztrip/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@buzztrip/ui/components/card";
import { Checkbox } from "@buzztrip/ui/components/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@buzztrip/ui/components/form";
import { Input } from "@buzztrip/ui/components/input";
import { RadioGroup, RadioGroupItem } from "@buzztrip/ui/components/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@buzztrip/ui/components/select";
import { Textarea } from "@buzztrip/ui/components/textarea";
import { betaQuestionnaireSchema } from "@/types/scheams";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { AlertCircle, CheckCircle2, DollarSign, Loader2, Mail, MessageSquare, TrendingUp, Users } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { api } from "@buzztrip/backend/api";

export default function ConfirmWaitlistPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { isSignedIn } = useUser();

  const confirmEmail = useMutation(api.beta.confirmEmail);
  const submitQuestionnaire = useMutation(api.beta.submitQuestionnaire);

  const [state, setState] = useState<"initial" | "confirming" | "confirmed" | "completed" | "error" | "no_account" | "already_completed">("initial");
  const [message, setMessage] = useState("");
  const [userName, setUserName] = useState("");

  // Check if token exists
  useEffect(() => {
    if (!token) {
      setState("error");
      setMessage("No confirmation token provided.");
    }
  }, [token]);

  // Form setup
  const form = useForm<z.infer<typeof betaQuestionnaireSchema>>({
    resolver: zodResolver(betaQuestionnaireSchema),
    defaultValues: {
      howDidYouHear: undefined,
      howDidYouHearOther: "",
      currentMappingTools: [],
      currentMappingToolsOther: "",
      primaryUseCase: undefined,
      useCaseDetails: "",
      mapsPerMonth: undefined,
      collaboratorsCount: undefined,
      expectedFeatures: [],
      mostImportantFeature: "",
      willingToPay: undefined,
      pricingModel: undefined,
      willingToProvideHelpFeedback: false,
      participationLevel: undefined,
      painPoints: "",
      dealbreakers: "",
      additionalComments: "",
    },
  });

  const {
    control,
    formState: { isSubmitting },
    watch,
  } = form;

  const howDidYouHearValue = watch("howDidYouHear");
  const currentMappingToolsValue = watch("currentMappingTools");

  const howDidYouHearOptions = [
    { value: "google", label: "Google / Search Engine" },
    { value: "friend", label: "Friend / Word of Mouth" },
    { value: "social-media", label: "Social Media (Twitter, LinkedIn, etc.)" },
    { value: "blog-article", label: "Tech Blog / Article" },
    { value: "youtube", label: "YouTube" },
    { value: "reddit", label: "Reddit" },
    { value: "other", label: "Other" },
  ];

  const mappingToolOptions = [
    "Google My Maps",
    "Google Maps",
    "Wonderlog",
    "TripIt",
    "Roadtrippers",
    "Wanderlog",
    "Sygic Travel",
    "None - This will be my first",
    "Other",
  ];

  const features = [
    "Real-time collaboration",
    "Advanced map customization",
    "Import/Export capabilities",
    "Mobile app",
    "API access",
    "Custom map styles",
    "Analytics dashboard",
    "Team workspaces",
  ];

  const handleConfirm = async () => {
    if (!token) return;

    setState("confirming");

    try {
      const result = await confirmEmail({ token });

      if (result.success) {
        setState("confirmed");
        setMessage(result.message);
        // Smooth scroll to questionnaire
        setTimeout(() => {
          const questionnaireElement = document.getElementById("questionnaire-section");
          questionnaireElement?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      } else {
        if (result.error === "already_completed") {
          setState("already_completed");
          setMessage(result.message);
        } else if (result.error === "no_account") {
          setState("no_account");
          setMessage(result.message);
        } else {
          setState("error");
          setMessage(result.message);
        }
      }
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
  };

  const onSubmit = async (data: z.infer<typeof betaQuestionnaireSchema>) => {
    if (!token) {
      toast.error("Invalid token");
      return;
    }

    try {
      const result = await submitQuestionnaire({ token, responses: data });
      if (result.success) {
        setState("completed");
        toast.success("Thank you for completing the questionnaire!");
        // Scroll to success message
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }, 100);
      }
    } catch (error) {
      console.error("Questionnaire submission error:", error);
      const errorMessage = error instanceof Error ? error.message : "An error occurred while submitting the questionnaire. Please try again.";
      toast.error(errorMessage);
    }
  };

  // Completed State
  if (state === "completed") {
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
              <CardTitle className="text-4xl font-bold mb-2">You're In! 🎉</CardTitle>
              <CardDescription className="text-lg">
                You now have full beta access to BuzzTrip!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
                <p className="text-primary font-semibold text-sm mb-2">
                  ✨ Beta Access Granted
                </p>
                <p className="text-gray-900 text-sm">
                  Thank you for completing the questionnaire! Your feedback will help us build the perfect mapping tool. Start creating custom maps and enjoy all our beta features.
                </p>
              </div>

              {isSignedIn ? (
                // User is signed in - show dashboard button
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button asChild className="flex-1">
                    <Link href="/app">Go to Dashboard</Link>
                  </Button>
                  <Button variant="outline" asChild className="flex-1">
                    <Link href="/">Back to Home</Link>
                  </Button>
                </div>
              ) : (
                // User is not signed in - show sign in/sign up buttons
                <>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <p className="text-blue-900 text-sm">
                      <strong>Next step:</strong> Sign in to your account or create one to access your beta features!
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button asChild className="flex-1">
                      <Link href="/sign-in">Sign In</Link>
                    </Button>
                    <Button variant="outline" asChild className="flex-1">
                      <Link href="/sign-up">Create Account</Link>
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-primary/10 py-12">
      <div className="container mx-auto px-4">
        {/* Confirmation Section */}
        {(state === "initial" || state === "confirming") && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-2xl mx-auto mb-12"
          >
            {state === "initial" && (
              <Card className="border-primary/20 shadow-xl">
                <CardHeader className="text-center pb-8">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Mail className="h-10 w-10 text-primary" />
                  </div>
                  <CardTitle className="text-4xl font-bold mb-4">Confirm Your Email</CardTitle>
                  <CardDescription className="text-lg">
                    Click the button below to confirm your email and proceed to the beta questionnaire
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <p className="text-blue-900 font-semibold mb-3 text-base">
                      📋 What's Next?
                    </p>
                    <ol className="text-blue-800 space-y-2 text-base list-decimal list-inside">
                      <li>Confirm your email address</li>
                      <li>Complete a 3-5 minute questionnaire below</li>
                      <li>Get instant beta access to BuzzTrip!</li>
                    </ol>
                    <p className="text-blue-700 text-sm mt-4">
                      <strong>Note:</strong> The questionnaire is required to access the beta program.
                    </p>
                  </div>

                  <Button onClick={handleConfirm} className="w-full py-6 text-lg" size="lg">
                    Confirm Email & Continue →
                  </Button>
                </CardContent>
              </Card>
            )}

            {state === "confirming" && (
              <Card className="border-primary/20 shadow-xl">
                <CardHeader className="text-center pb-8">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Loader2 className="h-10 w-10 text-primary animate-spin" />
                  </div>
                  <CardTitle className="text-3xl font-bold mb-2">Confirming Your Email</CardTitle>
                  <CardDescription className="text-lg">
                    Please wait while we verify your email...
                  </CardDescription>
                </CardHeader>
              </Card>
            )}
          </motion.div>
        )}

        {/* Error States */}
        {state === "no_account" && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="border-amber-200 shadow-xl">
              <CardHeader className="text-center pb-8">
                <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mail className="h-10 w-10 text-amber-600" />
                </div>
                <CardTitle className="text-3xl font-bold mb-2">Account Required</CardTitle>
                <CardDescription className="text-lg">{message}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-amber-900 text-sm font-semibold mb-2">
                    📝 Next Steps
                  </p>
                  <p className="text-amber-800 text-sm">
                    Please create an account using the same email address you used to sign up for the beta. Once you have an account, you can return to this confirmation link.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button asChild className="flex-1">
                    <Link href="/sign-up">Create Account</Link>
                  </Button>
                  <Button variant="outline" asChild className="flex-1">
                    <Link href="/">Back to Home</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {state === "already_completed" && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="border-green-200 shadow-xl">
              <CardHeader className="text-center pb-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>
                <CardTitle className="text-3xl font-bold mb-2">Already Completed!</CardTitle>
                <CardDescription className="text-lg">{message}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-900 text-sm font-semibold mb-2">
                    ✅ You're all set!
                  </p>
                  <p className="text-green-800 text-sm">
                    You've already completed the beta questionnaire. {isSignedIn ? "Head to your dashboard to start creating maps!" : "Sign in to access your beta features!"}
                  </p>
                </div>

                {isSignedIn ? (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button asChild className="flex-1">
                      <Link href="/app">Go to Dashboard</Link>
                    </Button>
                    <Button variant="outline" asChild className="flex-1">
                      <Link href="/">Back to Home</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button asChild className="flex-1">
                      <Link href="/sign-in">Sign In</Link>
                    </Button>
                    <Button variant="outline" asChild className="flex-1">
                      <Link href="/">Back to Home</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {state === "error" && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="border-red-200 shadow-xl">
              <CardHeader className="text-center pb-8">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="h-10 w-10 text-red-600" />
                </div>
                <CardTitle className="text-3xl font-bold mb-2">Confirmation Failed</CardTitle>
                <CardDescription className="text-lg">{message}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-900 text-sm font-semibold mb-2">
                    What can you do?
                  </p>
                  <ul className="text-red-800 text-sm space-y-1 list-disc list-inside">
                    <li>Make sure you're using the latest confirmation link from your email</li>
                    <li>Check if your link has expired (links are valid for 30 days)</li>
                    <li>Try signing up again to receive a new confirmation email</li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button asChild className="flex-1">
                    <Link href="/beta">Sign Up Again</Link>
                  </Button>
                  <Button variant="outline" asChild className="flex-1">
                    <Link href="/">Back to Home</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Questionnaire Section - Shows after confirmation */}
        {state === "confirmed" && (
          <motion.div
            id="questionnaire-section"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
              </motion.div>

              <Badge className="bg-primary text-white border-primary/20 mb-4 px-3 py-1 text-xs font-semibold">
                Email Confirmed!
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                Almost There!
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-2">
                Complete the questionnaire below to get full beta access. Takes 3-5 minutes.
              </p>
              <p className="text-sm text-gray-500">
                <strong>Required:</strong> Your feedback helps us build the perfect tool for you
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Discovery Section */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                >
                  <Card className="shadow-sm border">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <MessageSquare className="h-5 w-5 text-primary" />
                        Discovery & Background
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={control}
                        name="howDidYouHear"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel className="text-sm font-medium">How did you hear about BuzzTrip? *</FormLabel>
                            <FormControl>
                              <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-2">
                                {howDidYouHearOptions.map((option) => (
                                  <div key={option.value} className="flex items-center space-x-3 py-2 px-3 rounded-md hover:bg-gray-50 transition-colors cursor-pointer">
                                    <RadioGroupItem value={option.value} id={`hear-${option.value}`} className="h-4 w-4" />
                                    <FormLabel htmlFor={`hear-${option.value}`} className="font-normal cursor-pointer text-sm flex-1">
                                      {option.label}
                                    </FormLabel>
                                  </div>
                                ))}
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {howDidYouHearValue === "other" && (
                        <FormField
                          control={control}
                          name="howDidYouHearOther"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">Please specify</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Tell us where you heard about us..." className="text-sm h-10" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      <FormField
                        control={control}
                        name="currentMappingTools"
                        render={() => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">What mapping tools do you currently use? (Optional)</FormLabel>
                            <div className="space-y-2">
                              {mappingToolOptions.map((tool) => {
                                const toolId = `tool-${tool.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "")}`;
                                return (
                                  <FormField
                                    key={tool}
                                    control={control}
                                    name="currentMappingTools"
                                    render={({ field }) => (
                                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                        <label
                                          htmlFor={toolId}
                                          className="flex items-center space-x-2 py-2 px-3 rounded-md hover:bg-gray-50 transition-colors cursor-pointer flex-1"
                                        >
                                          <FormControl>
                                            <Checkbox
                                              id={toolId}
                                              checked={field.value?.includes(tool)}
                                              onCheckedChange={(checked) => {
                                                return checked
                                                  ? field.onChange([...(field.value || []), tool])
                                                  : field.onChange(field.value?.filter((value) => value !== tool));
                                              }}
                                              className="h-4 w-4"
                                            />
                                          </FormControl>
                                          <span className="text-sm flex-1">
                                            {tool}
                                          </span>
                                        </label>
                                      </FormItem>
                                    )}
                                  />
                                );
                              })}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {currentMappingToolsValue?.includes("Other") && (
                        <FormField
                          control={control}
                          name="currentMappingToolsOther"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">Please specify other tools</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Enter other mapping tools..." className="text-sm h-10" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Use Case Section */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <Card className="shadow-sm border">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Users className="h-5 w-5 text-primary" />
                        Your Use Case
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={control}
                        name="primaryUseCase"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel className="text-sm font-medium">What will you primarily use BuzzTrip for? *</FormLabel>
                            <FormControl>
                              <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-2">
                                {[
                                  { value: "personal", label: "Personal travel planning" },
                                  { value: "business", label: "Business/Professional use" },
                                  { value: "education", label: "Educational purposes" },
                                  { value: "research", label: "Research and data visualization" },
                                  { value: "events", label: "Event planning and management" },
                                  { value: "content-creation", label: "Content creation" },
                                  { value: "other", label: "Other" },
                                ].map((option) => (
                                  <div key={option.value} className="flex items-center space-x-3 py-2 px-3 rounded-md hover:bg-gray-50 transition-colors cursor-pointer">
                                    <RadioGroupItem value={option.value} id={option.value} className="h-4 w-4" />
                                    <FormLabel htmlFor={option.value} className="font-normal cursor-pointer text-sm flex-1">
                                      {option.label}
                                    </FormLabel>
                                  </div>
                                ))}
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={control}
                        name="useCaseDetails"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Tell us more about your use case (Optional)</FormLabel>
                            <FormControl>
                              <Textarea {...field} rows={3} placeholder="Share more details about how you plan to use BuzzTrip..." className="text-sm resize-none" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Usage & Scale */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.15 }}
                >
                  <Card className="shadow-sm border">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        Usage & Scale
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={control}
                        name="mapsPerMonth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">How many maps do you expect to create per month? *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="text-sm h-10">
                                  <SelectValue placeholder="Select a range" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="1-5" className="text-sm">1-5 maps</SelectItem>
                                <SelectItem value="6-10" className="text-sm">6-10 maps</SelectItem>
                                <SelectItem value="11-25" className="text-sm">11-25 maps</SelectItem>
                                <SelectItem value="26-50" className="text-sm">26-50 maps</SelectItem>
                                <SelectItem value="50+" className="text-sm">50+ maps</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={control}
                        name="collaboratorsCount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">How many people will collaborate on your maps? *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="text-sm h-10">
                                  <SelectValue placeholder="Select a range" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="just-me" className="text-sm">Just me</SelectItem>
                                <SelectItem value="2-5" className="text-sm">2-5 people</SelectItem>
                                <SelectItem value="6-10" className="text-sm">6-10 people</SelectItem>
                                <SelectItem value="11-25" className="text-sm">11-25 people</SelectItem>
                                <SelectItem value="25+" className="text-sm">25+ people</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Features */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <Card className="shadow-sm border">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-xl">Feature Preferences</CardTitle>
                      <CardDescription className="text-sm">Select all features you're interested in</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={control}
                        name="expectedFeatures"
                        render={() => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium mb-3">Which features are you most interested in? *</FormLabel>
                            <div className="grid md:grid-cols-2 gap-2">
                              {features.map((feature) => {
                                const featureId = `feature-${feature.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "")}`;
                                return (
                                  <FormField
                                    key={feature}
                                    control={control}
                                    name="expectedFeatures"
                                    render={({ field }) => (
                                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                        <label
                                          htmlFor={featureId}
                                          className="flex items-center space-x-2 py-2 px-3 rounded-md hover:bg-gray-50 transition-colors cursor-pointer flex-1"
                                        >
                                          <FormControl>
                                            <Checkbox
                                              id={featureId}
                                              checked={field.value?.includes(feature)}
                                              onCheckedChange={(checked) => {
                                                return checked
                                                  ? field.onChange([...field.value, feature])
                                                  : field.onChange(field.value?.filter((value) => value !== feature));
                                              }}
                                              className="h-4 w-4"
                                            />
                                          </FormControl>
                                          <span className="text-sm flex-1">
                                            {feature}
                                          </span>
                                        </label>
                                      </FormItem>
                                    )}
                                  />
                                );
                              })}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={control}
                        name="mostImportantFeature"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">What's the most important feature for you? *</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Describe the one feature you can't live without..." className="text-sm h-10" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Pricing */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.23 }}
                >
                  <Card className="shadow-sm border">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <DollarSign className="h-5 w-5 text-primary" />
                        Pricing
                      </CardTitle>
                      <CardDescription className="text-sm">Help us understand your budget expectations</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={control}
                        name="willingToPay"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel className="text-sm font-medium">How much would you be willing to pay per month? *</FormLabel>
                            <FormControl>
                              <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-2">
                                {[
                                  { value: "free-only", label: "Free only" },
                                  { value: "0-5", label: "$0-$5/month" },
                                  { value: "5-10", label: "$5-$10/month" },
                                  { value: "10-20", label: "$10-$20/month" },
                                  { value: "20-50", label: "$20-$50/month" },
                                  { value: "50+", label: "$50+/month" },
                                ].map((option) => (
                                  <div key={option.value} className="flex items-center space-x-3 py-2 px-3 rounded-md hover:bg-gray-50 transition-colors cursor-pointer">
                                    <RadioGroupItem value={option.value} id={`price-${option.value}`} className="h-4 w-4" />
                                    <FormLabel htmlFor={`price-${option.value}`} className="font-normal cursor-pointer text-sm flex-1">
                                      {option.label}
                                    </FormLabel>
                                  </div>
                                ))}
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={control}
                        name="pricingModel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Preferred pricing model *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="text-sm h-10">
                                  <SelectValue placeholder="Select your preference" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="monthly" className="text-sm">Monthly subscription</SelectItem>
                                <SelectItem value="yearly" className="text-sm">Yearly subscription (discounted)</SelectItem>
                                <SelectItem value="one-time" className="text-sm">One-time purchase</SelectItem>
                                <SelectItem value="usage-based" className="text-sm">Pay per use</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Participation & Feedback */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.25 }}
                >
                  <Card className="shadow-sm border">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-xl">
                        Your Participation
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={control}
                        name="willingToProvideHelpFeedback"
                        render={({ field }) => (
                          <FormItem>
                            <label
                              htmlFor="feedback-checkbox"
                              className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                            >
                              <FormControl>
                                <Checkbox
                                  id="feedback-checkbox"
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  className="h-4 w-4 mt-0.5"
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none flex-1">
                                <div className="cursor-pointer text-sm font-medium">
                                  I'm willing to provide regular feedback and participate in user research
                                </div>
                                <FormDescription className="text-xs">
                                  Help us build better features by sharing your experiences
                                </FormDescription>
                              </div>
                            </label>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={control}
                        name="participationLevel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">How active do you want to be in the beta program? *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="text-sm h-10">
                                  <SelectValue placeholder="Select your level" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="passive" className="text-sm">Passive (just using the product)</SelectItem>
                                <SelectItem value="occasional" className="text-sm">Occasional (some feedback)</SelectItem>
                                <SelectItem value="active" className="text-sm">Active (regular feedback)</SelectItem>
                                <SelectItem value="super-user" className="text-sm">Super user (heavy involvement)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Open-ended */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.28 }}
                >
                  <Card className="shadow-sm border">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-xl">Additional Feedback</CardTitle>
                      <CardDescription className="text-sm">Optional - but your insights are valuable!</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={control}
                        name="painPoints"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">What are your biggest pain points with current mapping tools?</FormLabel>
                            <FormControl>
                              <Textarea {...field} rows={3} placeholder="Tell us what frustrates you..." className="text-sm resize-none" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={control}
                        name="dealbreakers"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">What would be a dealbreaker for you?</FormLabel>
                            <FormControl>
                              <Textarea {...field} rows={3} placeholder="What would make you stop using the product?" className="text-sm resize-none" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={control}
                        name="additionalComments"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Anything else you'd like to share?</FormLabel>
                            <FormControl>
                              <Textarea {...field} rows={3} placeholder="Any other thoughts, ideas, or feedback?" className="text-sm resize-none" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="pt-2"
                >
                  <Card className="shadow-md border border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10">
                    <CardContent className="pt-6">
                      <Button
                        type="submit"
                        className="w-full h-12 text-base font-semibold"
                        size="lg"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          "Complete & Get Beta Access →"
                        )}
                      </Button>
                      <p className="text-center text-xs text-gray-600 mt-3">
                        By submitting, you'll get instant access to all beta features
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </form>
            </Form>
          </motion.div>
        )}
      </div>
    </div>
  );
}
