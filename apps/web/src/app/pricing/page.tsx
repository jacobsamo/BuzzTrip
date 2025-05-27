"use client";
import GeneralCTA from "@/components/cta";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Check, Crown, Heart, MapPin, X } from "lucide-react";
import { motion } from "motion/react";

export default function PricingPage() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for personal use and getting started",
      icon: MapPin,
      color: "gray",
      features: [
        // { name: "Up to 3 maps", included: true, comingSoon: false },
        {
          name: "Custom markers & collections",
          included: true,
          comingSoon: false,
        },
        { name: "Basic sharing", included: true, comingSoon: false },
        { name: "Responsive web interface", included: true, comingSoon: false },
        { name: "Community support", included: true, comingSoon: false },
        { name: "Unlimited maps", included: true, comingSoon: false },
        // { name: "Real-time collaboration", included: false, comingSoon: false },
        // {
        //   name: "Advanced sharing options",
        //   included: false,
        //   comingSoon: false,
        // },
        // { name: "Priority support", included: false, comingSoon: false },
        // { name: "Custom map styles", included: false, comingSoon: false },
      ],
      cta: "Get Started Free",
      popular: false,
    },
    {
      name: "Pro",
      price: "$9",
      period: "per month",
      description: "For power users and professionals",
      icon: Crown,
      color: "primary",
      features: [
        { name: "Everything in Free", included: true, comingSoon: false },
        // { name: "Unlimited maps", included: true, comingSoon: false },
        // {
        //   name: "Custom markers & collections",
        //   included: true,
        //   comingSoon: false,
        // },
        // { name: "Advanced sharing options", included: true, comingSoon: false },
        // { name: "Real-time collaboration", included: true, comingSoon: true },
        // { name: "Import/Export data", included: true, comingSoon: true },
        // { name: "Custom map styles", included: true, comingSoon: true },
        // { name: "Priority support", included: true },
        // { name: "Mobile apps access", included: true, comingSoon: true },
        // { name: "Advanced measurements", included: true, comingSoon: true },
        // { name: "API access", included: true, comingSoon: true },
      ],
      cta: "Start Pro Trial",
      popular: false,
      disabled: true,
      supportNote: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "pricing",
      description: "For teams and organizations",
      icon: Building,
      color: "gray",
      features: [
        { name: "Everything in Pro", included: true, comingSoon: true },
        { name: "Team management", included: true, comingSoon: true },
        { name: "Advanced analytics", included: true, comingSoon: true },
        { name: "Custom integrations", included: true, comingSoon: true },
        { name: "Dedicated support", included: true, comingSoon: true },
        { name: "SLA guarantee", included: true, comingSoon: true },
        { name: "On-premise deployment", included: true, comingSoon: true },
        { name: "Custom branding", included: true, comingSoon: true },
        { name: "Advanced security", included: true, comingSoon: true },
        { name: "Training & onboarding", included: true, comingSoon: true },
      ],
      cta: "Coming Soon",
      popular: false,
      disabled: true,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Choose the plan that's right for you. Start free and upgrade as
              you grow.
            </p>
            {/* <Badge className="bg-primary/10 text-primary border-primary/20">
              14-day free trial on Pro plan • No credit card required
            </Badge> */}
            <Badge className="bg-primary/10 text-primary border-primary/20">
              Free while in beta • no credit card required
            </Badge>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-white px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <Card
                  className={`h-full ${plan.popular ? "border-primary border-2 shadow-lg" : "border-gray-200"} ${plan.disabled ? "opacity-60" : ""}`}
                >
                  <CardHeader className="text-center pb-8">
                    <div
                      className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-${plan.color === "gray" ? "gray" : plan.color}/10 flex items-center justify-center`}
                    >
                      <plan.icon
                        className={`h-8 w-8 text-${plan.color === "gray" ? "gray" : plan.color}-600`}
                      />
                    </div>
                    <CardTitle className="text-2xl font-bold">
                      {plan.name}
                    </CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-gray-600 ml-2">/{plan.period}</span>
                    </div>
                    <p className="text-gray-600 mt-2">{plan.description}</p>

                    {plan.supportNote && (
                      <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <div className="flex items-center justify-center space-x-2 text-amber-700">
                          <Heart className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            Supporting Development
                          </span>
                        </div>
                        <p className="text-xs text-amber-600 mt-1">
                          Help us build amazing new features coming soon!
                        </p>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          {feature.included ? (
                            <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                          ) : (
                            <X className="h-5 w-5 text-gray-300 mr-3 flex-shrink-0" />
                          )}
                          <span
                            className={`${feature.included ? "text-gray-900" : "text-gray-400"} ${feature.comingSoon ? "italic" : ""}`}
                          >
                            {feature.name}
                            {feature.comingSoon && (
                              <Badge
                                variant="outline"
                                className="ml-2 text-xs bg-amber-50 text-amber-700 border-amber-200"
                              >
                                Soon
                              </Badge>
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className={`w-full ${plan.popular ? "bg-primary hover:bg-primary/90 text-white" : "border-gray-300"}`}
                      variant={plan.popular ? "default" : "outline"}
                      disabled={plan.disabled}
                    >
                      {plan.cta}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      {/* <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-8">
            {[
              {
                question: "Can I change plans anytime?",
                answer:
                  "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing differences.",
              },
              {
                question: "What happens to my maps if I downgrade?",
                answer:
                  "Your maps will remain safe. If you exceed the free plan limits, you'll have read-only access to your extra maps until you upgrade again.",
              },
              {
                question: "Do you offer refunds?",
                answer:
                  "We offer a 14-day free trial, so you can test all Pro features before committing. If you're not satisfied, contact us within 30 days for a full refund.",
              },
              {
                question: "When will the upcoming features be available?",
                answer:
                  "We're actively developing new features. Check our roadmap for estimated timelines. Pro subscribers get early access to new features as they're released.",
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-lg p-6 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <GeneralCTA />
    </div>
  );
}
