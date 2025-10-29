"use client";

import { useUser } from "@clerk/nextjs";
import { Badge } from "@buzztrip/ui/components/badge";
import { Button } from "@buzztrip/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@buzztrip/ui/components/card";
import { Checkbox } from "@buzztrip/ui/components/checkbox";
import { Input } from "@buzztrip/ui/components/input";
import { Label } from "@buzztrip/ui/components/label";
import { RadioGroup, RadioGroupItem } from "@buzztrip/ui/components/radio-group";
import { Textarea } from "@buzztrip/ui/components/textarea";
import { useMutation } from "convex/react";
import { CheckCircle2, Crown, MessageSquare, Rocket, Sparkles, Users, Zap } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { api } from "@/convex/_generated/api";

export default function BetaSignupPage() {
  const { user, isSignedIn } = useUser();
  const submitBeta = useMutation(api.beta.submitBetaSignup);
  const upgradeToBeta = useMutation(api.beta.upgradeToBeta);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    howDidYouHear: "",
    primaryUseCase: "",
    expectedFeatures: [] as string[],
    willingToProvideHelpFeedback: false,
    additionalComments: "",
    whatsappOptIn: false,
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const useCases = [
    { value: "personal", label: "Personal travel planning" },
    { value: "business", label: "Business/Professional use" },
    { value: "education", label: "Educational purposes" },
    { value: "research", label: "Research and data visualization" },
    { value: "events", label: "Event planning and management" },
    { value: "other", label: "Other" },
  ];

  const handleFeatureToggle = (feature: string) => {
    setFormData((prev) => ({
      ...prev,
      expectedFeatures: prev.expectedFeatures.includes(feature)
        ? prev.expectedFeatures.filter((f) => f !== feature)
        : [...prev.expectedFeatures, feature],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignedIn) {
        // Existing user - upgrade to beta
        await upgradeToBeta({
          questionnaire: {
            howDidYouHear: formData.howDidYouHear,
            primaryUseCase: formData.primaryUseCase,
            expectedFeatures: formData.expectedFeatures,
            willingToProvideHelpFeedback: formData.willingToProvideHelpFeedback,
            additionalComments: formData.additionalComments,
          },
          whatsappOptIn: formData.whatsappOptIn,
        });
        setSubmitted(true);
      } else {
        // New user - needs to sign up first
        const result = await submitBeta({
          firstName: formData.firstName,
          lastName: formData.lastName || undefined,
          email: formData.email,
          questionnaire: {
            howDidYouHear: formData.howDidYouHear,
            primaryUseCase: formData.primaryUseCase,
            expectedFeatures: formData.expectedFeatures,
            willingToProvideHelpFeedback: formData.willingToProvideHelpFeedback,
            additionalComments: formData.additionalComments,
          },
          whatsappOptIn: formData.whatsappOptIn,
          clerkUserId: undefined,
        });

        if (result.success) {
          setSubmitted(true);
        } else {
          setError(result.message);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred. Please try again.");
    } finally {
      setLoading(false);
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
                Welcome to the Beta!
              </CardTitle>
              <CardDescription className="text-lg">
                {isSignedIn
                  ? "You're all set! Check your email for next steps."
                  : "Thanks for your interest! Please sign up to complete your beta enrollment."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isSignedIn && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                  <p className="text-amber-900 text-sm">
                    To activate your beta access, please create an account using the email you provided.
                  </p>
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-3">
                {isSignedIn ? (
                  <Button asChild className="flex-1">
                    <Link href="/app">Go to Dashboard</Link>
                  </Button>
                ) : (
                  <Button asChild className="flex-1">
                    <Link href="/sign-up">Create Account</Link>
                  </Button>
                )}
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
              Be among the first to shape the future of custom mapping. Get early access to new features,
              exclusive perks, and direct input on our roadmap.
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

      {/* Questionnaire Form */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="border-gray-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl">Beta Application</CardTitle>
                  <CardDescription>
                    Tell us a bit about yourself and how you plan to use BuzzTrip
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {!isSignedIn && (
                      <>
                        {/* Personal Information */}
                        <div className="space-y-4">
                          <h3 className="font-semibold text-lg flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Personal Information
                          </h3>

                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="firstName">First Name *</Label>
                              <Input
                                id="firstName"
                                required
                                value={formData.firstName}
                                onChange={(e) =>
                                  setFormData({ ...formData, firstName: e.target.value })
                                }
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="lastName">Last Name</Label>
                              <Input
                                id="lastName"
                                value={formData.lastName}
                                onChange={(e) =>
                                  setFormData({ ...formData, lastName: e.target.value })
                                }
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="email">Email Address *</Label>
                            <Input
                              id="email"
                              type="email"
                              required
                              value={formData.email}
                              onChange={(e) =>
                                setFormData({ ...formData, email: e.target.value })
                              }
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {/* How did you hear about us */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <Sparkles className="h-5 w-5" />
                        About You
                      </h3>

                      <div className="space-y-2">
                        <Label htmlFor="howDidYouHear">How did you hear about BuzzTrip? *</Label>
                        <Input
                          id="howDidYouHear"
                          required
                          placeholder="Social media, friend, search, etc."
                          value={formData.howDidYouHear}
                          onChange={(e) =>
                            setFormData({ ...formData, howDidYouHear: e.target.value })
                          }
                        />
                      </div>

                      <div className="space-y-3">
                        <Label>Primary Use Case *</Label>
                        <RadioGroup
                          value={formData.primaryUseCase}
                          onValueChange={(value) =>
                            setFormData({ ...formData, primaryUseCase: value })
                          }
                          required
                        >
                          {useCases.map((useCase) => (
                            <div key={useCase.value} className="flex items-center space-x-2">
                              <RadioGroupItem value={useCase.value} id={useCase.value} />
                              <Label htmlFor={useCase.value} className="font-normal cursor-pointer">
                                {useCase.label}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <Zap className="h-5 w-5" />
                        Feature Preferences
                      </h3>

                      <div className="space-y-2">
                        <Label>Which features are you most excited about? (Select all that apply)</Label>
                        <div className="grid md:grid-cols-2 gap-3 pt-2">
                          {features.map((feature) => (
                            <div key={feature} className="flex items-center space-x-2">
                              <Checkbox
                                id={feature}
                                checked={formData.expectedFeatures.includes(feature)}
                                onCheckedChange={() => handleFeatureToggle(feature)}
                              />
                              <Label htmlFor={feature} className="font-normal cursor-pointer">
                                {feature}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="additionalComments">Additional Comments or Feature Requests</Label>
                        <Textarea
                          id="additionalComments"
                          placeholder="Tell us about any specific features or use cases you're interested in..."
                          rows={4}
                          value={formData.additionalComments}
                          onChange={(e) =>
                            setFormData({ ...formData, additionalComments: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    {/* Participation */}
                    <div className="space-y-4 border-t pt-6">
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="feedback"
                          checked={formData.willingToProvideHelpFeedback}
                          onCheckedChange={(checked) =>
                            setFormData({
                              ...formData,
                              willingToProvideHelpFeedback: checked === true,
                            })
                          }
                        />
                        <div className="space-y-1">
                          <Label htmlFor="feedback" className="font-normal cursor-pointer">
                            I'm willing to provide regular feedback and participate in user research
                          </Label>
                          <p className="text-sm text-gray-500">
                            Help us build the best mapping platform by sharing your experiences and insights
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="whatsapp"
                          checked={formData.whatsappOptIn}
                          onCheckedChange={(checked) =>
                            setFormData({ ...formData, whatsappOptIn: checked === true })
                          }
                        />
                        <div className="space-y-1">
                          <Label htmlFor="whatsapp" className="font-normal cursor-pointer">
                            Join our beta tester WhatsApp group
                          </Label>
                          <p className="text-sm text-gray-500">
                            Get instant updates, connect with other testers, and chat directly with our team
                          </p>
                        </div>
                      </div>
                    </div>

                    {error && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-900 text-sm">{error}</p>
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      disabled={loading}
                    >
                      {loading ? "Submitting..." : "Join Beta Program"}
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
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
