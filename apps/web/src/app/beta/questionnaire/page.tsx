"use client";

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
import { useMutation, useQuery } from "convex/react";
import { AlertCircle, CheckCircle2, DollarSign, Loader2, MessageSquare, TrendingUp, Users } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { api } from "@/convex/_generated/api";

export default function BetaQuestionnairePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const tokenVerification = useQuery(
    api.beta.verifyQuestionnaireToken,
    token ? { token } : "skip"
  );
  const submitQuestionnaire = useMutation(api.beta.submitQuestionnaire);

  const [submitted, setSubmitted] = useState(false);

  const form = useForm<z.infer<typeof betaQuestionnaireSchema>>({
    resolver: zodResolver(betaQuestionnaireSchema),
    defaultValues: {
      howDidYouHear: "",
      currentMappingTool: "",
      primaryUseCase: "personal",
      useCaseDetails: "",
      mapsPerMonth: undefined,
      collaboratorsCount: undefined,
      expectedFeatures: [],
      mostImportantFeature: "",
      willingToPay: "free-only",
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

  const expectedFeatures = watch("expectedFeatures");

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

  const onSubmit = async (data: z.infer<typeof betaQuestionnaireSchema>) => {
    if (!token) {
      toast.error("Invalid token");
      return;
    }

    try {
      const result = await submitQuestionnaire({ token, responses: data });
      if (result.success) {
        setSubmitted(true);
        toast.success("Thank you for completing the questionnaire!");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    }
  };

  // Show loading or error state
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Invalid Link</h2>
            <p className="text-gray-600 mb-4">This questionnaire link is invalid or missing.</p>
            <Button asChild>
              <Link href="/beta">Join Beta</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (tokenVerification === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!tokenVerification.valid) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              {tokenVerification.reason === "Token already used"
                ? "Already Completed"
                : "Invalid or Expired"}
            </h2>
            <p className="text-gray-600 mb-4">
              {tokenVerification.reason === "Token already used"
                ? "You've already completed this questionnaire. Thank you!"
                : `This link is ${tokenVerification.reason?.toLowerCase()}.`}
            </p>
            <Button asChild>
              <Link href="/app">Go to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
              <CardTitle className="text-3xl font-bold mb-2">Thank You!</CardTitle>
              <CardDescription className="text-lg">
                Your feedback helps us build the best mapping tool for you.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-blue-900 text-sm">
                  We'll use your responses to prioritize features and ensure BuzzTrip meets your needs.
                  You're now part of our exclusive beta program!
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild className="flex-1">
                  <Link href="/app">Go to Dashboard</Link>
                </Button>
                <Button variant="outline" asChild className="flex-1">
                  <Link href="/">Back to Home</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="text-center mb-8">
            <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
              Beta Questionnaire
            </Badge>
            <h1 className="text-3xl font-bold mb-2">
              Welcome, {tokenVerification.userName}!
            </h1>
            <p className="text-gray-600">
              Help us build the perfect mapping tool for you. This takes about 3 minutes.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Discovery Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Discovery & Background
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={control}
                    name="howDidYouHear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>How did you hear about BuzzTrip?</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Social media, friend, search engine, etc." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="currentMappingTool"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>What mapping tools do you currently use? (Optional)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Google My Maps, Mapbox, etc." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Use Case Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Your Use Case
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={control}
                    name="primaryUseCase"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>What will you primarily use BuzzTrip for?</FormLabel>
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} defaultValue={field.value}>
                            {[
                              { value: "personal", label: "Personal travel planning" },
                              { value: "business", label: "Business/Professional use" },
                              { value: "education", label: "Educational purposes" },
                              { value: "research", label: "Research and data visualization" },
                              { value: "events", label: "Event planning and management" },
                              { value: "content-creation", label: "Content creation" },
                              { value: "other", label: "Other" },
                            ].map((option) => (
                              <div key={option.value} className="flex items-center space-x-2">
                                <RadioGroupItem value={option.value} id={option.value} />
                                <FormLabel htmlFor={option.value} className="font-normal cursor-pointer">
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
                        <FormLabel>Tell us more about your use case (Optional)</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={3} placeholder="Share more details about how you plan to use BuzzTrip..." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Usage & Scale */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Usage & Scale
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={control}
                    name="mapsPerMonth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>How many maps do you expect to create per month?</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a range" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1-5">1-5 maps</SelectItem>
                            <SelectItem value="6-10">6-10 maps</SelectItem>
                            <SelectItem value="11-25">11-25 maps</SelectItem>
                            <SelectItem value="26-50">26-50 maps</SelectItem>
                            <SelectItem value="50+">50+ maps</SelectItem>
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
                        <FormLabel>How many people will collaborate on your maps?</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a range" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="just-me">Just me</SelectItem>
                            <SelectItem value="2-5">2-5 people</SelectItem>
                            <SelectItem value="6-10">6-10 people</SelectItem>
                            <SelectItem value="11-25">11-25 people</SelectItem>
                            <SelectItem value="25+">25+ people</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Features */}
              <Card>
                <CardHeader>
                  <CardTitle>Feature Preferences</CardTitle>
                  <CardDescription>Select all features you're interested in</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={control}
                    name="expectedFeatures"
                    render={() => (
                      <FormItem>
                        <div className="grid md:grid-cols-2 gap-3">
                          {features.map((feature) => {
                            const featureId = `feature-${feature.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "")}`;
                            return (
                              <FormField
                                key={feature}
                                control={control}
                                name="expectedFeatures"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                      <Checkbox
                                        id={featureId}
                                        checked={field.value?.includes(feature)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, feature])
                                            : field.onChange(field.value?.filter((value) => value !== feature));
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel htmlFor={featureId} className="font-normal cursor-pointer">
                                      {feature}
                                    </FormLabel>
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
                        <FormLabel>What's the most important feature for you?</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Describe the one feature you can't live without..." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Pricing */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Pricing
                  </CardTitle>
                  <CardDescription>Help us understand your budget expectations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={control}
                    name="willingToPay"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>How much would you be willing to pay per month?</FormLabel>
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} defaultValue={field.value}>
                            {[
                              { value: "free-only", label: "Free only" },
                              { value: "0-5", label: "$0-$5/month" },
                              { value: "5-10", label: "$5-$10/month" },
                              { value: "10-20", label: "$10-$20/month" },
                              { value: "20-50", label: "$20-$50/month" },
                              { value: "50+", label: "$50+/month" },
                            ].map((option) => (
                              <div key={option.value} className="flex items-center space-x-2">
                                <RadioGroupItem value={option.value} id={`price-${option.value}`} />
                                <FormLabel htmlFor={`price-${option.value}`} className="font-normal cursor-pointer">
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
                        <FormLabel>Preferred pricing model</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your preference" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="monthly">Monthly subscription</SelectItem>
                            <SelectItem value="yearly">Yearly subscription (discounted)</SelectItem>
                            <SelectItem value="one-time">One-time purchase</SelectItem>
                            <SelectItem value="usage-based">Pay per use</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Participation & Feedback */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Participation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={control}
                    name="willingToProvideHelpFeedback"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="cursor-pointer">
                            I'm willing to provide regular feedback and participate in user research
                          </FormLabel>
                          <FormDescription>
                            Help us build better features by sharing your experiences
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="participationLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>How active do you want to be in the beta program?</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="passive">Passive (just using the product)</SelectItem>
                            <SelectItem value="occasional">Occasional (some feedback)</SelectItem>
                            <SelectItem value="active">Active (regular feedback)</SelectItem>
                            <SelectItem value="super-user">Super user (heavy involvement)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Open-ended */}
              <Card>
                <CardHeader>
                  <CardTitle>Additional Feedback</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={control}
                    name="painPoints"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>What are your biggest pain points with current mapping tools?</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={3} placeholder="Tell us what frustrates you..." />
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
                        <FormLabel>Are there any dealbreakers that would prevent you from using BuzzTrip?</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={3} placeholder="What would make you stop using the product?" />
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
                        <FormLabel>Any other comments or suggestions?</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={3} placeholder="Share anything else you'd like us to know..." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  "Submit Questionnaire"
                )}
              </Button>
            </form>
          </Form>
        </motion.div>
      </div>
    </div>
  );
}
