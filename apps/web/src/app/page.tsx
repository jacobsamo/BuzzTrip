"use client";
import GeneralCTA from "@/components/cta";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Calendar,
  Camera,
  Check,
  Download,
  Map,
  MapPin,
  Palette,
  Route,
  Ruler,
  Share2,
  Smartphone,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

type Feature = {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
  available?: boolean;
  timeline?: string;
};

const availableFeatures: Feature[] = [
  {
    icon: <MapPin className="h-6 w-6 text-white" />,
    title: "Custom Markers & Collections",
    description:
      "Create personalized markers and organize them into collections for easy management.",
    delay: 0.1,
    available: true,
  },
  {
    icon: <Map className="h-6 w-6 text-white" />,
    title: "Multiple Maps",
    description:
      "Create and manage multiple maps for different projects, trips, or purposes.",
    delay: 0.2,
    available: true,
  },
  {
    icon: <Share2 className="h-6 w-6 text-white" />,
    title: "Easy Sharing",
    description:
      "Share your maps with friends, family, or colleagues with simple sharing links.",
    delay: 0.3,
    available: true,
  },
  {
    icon: <Smartphone className="h-6 w-6 text-white" />,
    title: "Responsive Design",
    description:
      "Access and edit your maps from any device with our responsive web interface.",
    delay: 0.4,
    available: true,
  },
  {
    icon: <Users className="h-6 w-6 text-amber-700" />,
    title: "Real-time Collaboration",
    description:
      "Work together with your team in real-time. See changes instantly as others edit the map.",
    delay: 0.4,
    available: true,
  },
];

const upComingFeatures: Feature[] = [
  {
    icon: <Route className="h-6 w-6 text-amber-700" />,
    title: "Paths & Routes",
    description:
      "Draw custom paths and routes with built-in measurement tools for distance and area calculations.",
    delay: 0.1,
    timeline: "Q2 2025",
  },
  {
    icon: <Ruler className="h-6 w-6 text-amber-700" />,
    title: "Advanced Measurements",
    description:
      "Precise measurement tools for distances, areas, and elevations with multiple unit options.",
    delay: 0.6,
    timeline: "Q3 2025",
  },
  {
    icon: <Download className="h-6 w-6 text-amber-700" />,
    title: "Import/Export Data",
    description:
      "Import and export your map data in popular formats including KML, GeoJSON, and CSV.",
    delay: 0.3,
    timeline: "Q4 2025",
  },
  {
    icon: <Palette className="h-6 w-6 text-amber-700" />,
    title: "Custom Map Styles",
    description:
      "Personalize your maps with custom themes, colors, and styling options to match your brand.",
    delay: 0.4,
    timeline: "Q1 2026",
  },
  {
    icon: <Smartphone className="h-6 w-6 text-amber-700" />,
    title: "Mobile Apps",
    description:
      "Native iOS and Android apps for seamless mapping on the go with offline capabilities.",
    delay: 0.5,
    timeline: "Q2 2026",
  },
];

const appHighlights = [
  {
    icon: Route,
    title: "Travel Planning",
    description:
      "Plan your perfect trip with custom markers for must-visit locations. Create detailed itineraries and share them with travel companions.",
    features: [
      "Custom location marking",
      "Easy sharing with companions",
      "Custom collections for trips",
    ],
    color: "blue",
    delay: 0.1,
  },
  {
    icon: Camera,
    title: "Photo Shoots",
    description:
      "Scout locations, plan shooting schedules, and coordinate with your team. Mark the perfect spots and share with clients.",
    features: [
      "Location scouting",
      "Team coordination",
      // "Client presentations",
    ],
    color: "purple",
    delay: 0.2,
  },
  {
    icon: Calendar,
    title: "Event Planning",
    description:
      "Design event layouts, coordinate vendor locations, and guide attendees. Create interactive maps for seamless event experiences.",
    // features: ["Venue layouts", "Vendor coordination", "Attendee navigation"],
    features: ["Custom paths for navigation", "Vendor coordination"],
    color: "green",
    delay: 0.3,
  },
];

const roadMap = [
  {
    quarter: "Q1 2025",
    status: "completed",
    title: "Foundation & Core Features",
    features: [
      "Custom markers & collections",
      "Multiple maps support",
      "Responsive web interface",
      "Basic sharing capabilities",
    ],
  },
  {
    quarter: "Q2 2025",
    status: "in-progress",
    title: "Paths, Routes & Measurements",
    features: [
      "Real-time collaborative editing",
      "Paths & routes with measurements",
      "Advanced marker customization",
      "Improved sharing options",
    ],
  },
  {
    quarter: "Q3 2025",
    status: "planned",
    title: "Collaboration & Sharing",
    features: [
      "Advanced sharing permissions",
      "Email notifications for collaborators",
      "Comments and annotations",
    ],
  },
  {
    quarter: "Q4 2025",
    status: "planned",
    title: "Data & Customization",
    features: [
      "Import/Export (KML, GeoJSON, CSV)",
      "Custom map styles & themes",
      "Advanced measurement tools",
      "API access",
    ],
  },
];

export default function BuzzTripLanding() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-primary/5 to-primary/10 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center lg:text-left"
            >
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
                  Next-Generation Mapping Platform
                </Badge>
              </motion.div>

              <motion.h1
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight"
              >
                Create Custom Maps
                <br />
                <span className="text-primary">
                  Anywhere, Anytime, with Anyone
                </span>
              </motion.h1>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed"
              >
                The powerful mapping platform that brings Google Maps and Google
                My Maps together. Create, customize, and share beautiful maps
                across all your devices.
              </motion.p>

              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center"
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    href="/auth/sign-up"
                    className={buttonVariants({
                      variant: "outline",
                      size: "lg",
                      className:
                        "bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg shadow-lg",
                    })}
                  >
                    Start Creating Maps
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </motion.div>
                {/* <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary hover:text-white px-8 py-4 text-lg"
                  >
                    View Demo
                  </Button>
                </motion.div> */}
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="mt-8 flex items-center justify-center lg:justify-start space-x-6 text-sm text-gray-600"
              >
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-primary mr-2" />
                  Free to start
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-primary mr-2" />
                  No credit card required
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-primary mr-2" />
                  Works on all devices
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
            >
              <div className="relative">
                <div className="bg-white rounded-2xl shadow-2xl p-4 max-w-md mx-auto lg:max-w-none">
                  <Image
                    src="/assets/desktop-app-screenshot.webp"
                    alt="BuzzTrip Desktop Interface"
                    width={600}
                    height={400}
                    className="w-full rounded-xl"
                  />
                </div>
              </div>

              {/* Floating mobile preview */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="absolute -bottom-16 -right-4 lg:-right-12"
              >
                <div className="bg-gray-900 rounded-3xl shadow-xl p-1 w-32 lg:w-40 relative">
                  <div className="bg-black rounded-3xl p-1">
                    <Image
                      src="/assets/mobile-app-screenshot.webp"
                      alt="BuzzTrip Mobile Interface"
                      width={160}
                      height={300}
                      className="w-full rounded-2xl"
                    />
                  </div>
                  {/* Phone notch */}
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gray-700 rounded-full"></div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Current Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Available Now
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Start creating beautiful, custom maps today with these powerful
              features
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {availableFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: feature.delay }}
                viewport={{ once: true }}
                whileHover={{ y: -2 }}
              >
                <Card className="border-2 border-primary/20 bg-primary/5 hover:border-primary/40 transition-all duration-300 hover:shadow-lg h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <motion.div
                        className="bg-primary w-12 h-12 rounded-xl flex items-center justify-center"
                        whileHover={{ scale: 1.05 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 10,
                        }}
                      >
                        {feature.icon}
                      </motion.div>
                      <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                        Available
                      </Badge>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-sm">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Coming Soon
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Exciting new features in development to make BuzzTrip even more
              powerful
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upComingFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: feature.delay }}
                viewport={{ once: true }}
                whileHover={{ y: -2 }}
              >
                <Card className="border-2 border-gray-200 hover:border-amber-300 transition-all duration-300 hover:shadow-lg h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <motion.div
                        className="bg-amber-100 w-12 h-12 rounded-xl flex items-center justify-center"
                        whileHover={{ scale: 1.05 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 10,
                        }}
                      >
                        {feature.icon}
                      </motion.div>
                      <Badge
                        variant="outline"
                        className="bg-amber-50 text-amber-700 border-amber-200 text-xs"
                      >
                        {feature.timeline}
                      </Badge>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-sm">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="use-cases" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Perfect for Every Adventure
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From travel planning to event coordination, BuzzTrip adapts to
              your unique mapping needs
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {appHighlights.map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: useCase.delay }}
                viewport={{ once: true }}
                whileHover={{ y: -3 }}
              >
                <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                  <CardContent className="p-8">
                    <motion.div
                      className={`bg-${useCase.color}-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6`}
                      whileHover={{ scale: 1.05 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 10,
                      }}
                    >
                      <useCase.icon
                        className={`h-8 w-8 text-${useCase.color}-600`}
                      />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {useCase.title}
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {useCase.description}
                    </p>
                    <ul className="space-y-2">
                      {useCase.features.map((feature, featureIndex) => (
                        <motion.li
                          key={featureIndex}
                          initial={{ x: -10, opacity: 0 }}
                          whileInView={{ x: 0, opacity: 1 }}
                          transition={{
                            duration: 0.4,
                            delay: useCase.delay + featureIndex * 0.1,
                          }}
                          viewport={{ once: true }}
                          className="flex items-center text-gray-600"
                        >
                          <Check className="h-4 w-4 text-primary mr-2" />
                          {feature}
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Roadmap Section */}
      <section
        id="roadmap"
        className="py-20 bg-gradient-to-br from-gray-50 to-primary/5"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Development Roadmap
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See what's coming next and be part of BuzzTrip's journey to
              becoming the ultimate mapping platform
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {roadMap.map((phase, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -50, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start space-x-6"
                >
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-4 h-4 rounded-full ${
                        phase.status === "completed"
                          ? "bg-primary"
                          : phase.status === "in-progress"
                            ? "bg-amber-500"
                            : "bg-gray-300"
                      }`}
                    />
                    {index < 3 && (
                      <div className="w-0.5 h-16 bg-gray-200 mt-2" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">
                        {phase.quarter}
                      </h3>
                      <Badge
                        className={
                          phase.status === "completed"
                            ? "bg-primary text-white"
                            : phase.status === "in-progress"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-gray-100 text-gray-700"
                        }
                      >
                        {phase.status === "completed"
                          ? "Completed"
                          : phase.status === "in-progress"
                            ? "In Progress"
                            : "Planned"}
                      </Badge>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">
                      {phase.title}
                    </h4>
                    <ul className="grid md:grid-cols-2 gap-2">
                      {phase.features.map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                          className="flex items-center text-gray-600 text-sm"
                        >
                          <Check className="h-3 w-3 text-primary mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
            <Link
              href="/roadmap"
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className:
                  "mt-8 inline-flex items-center justify-center bg-white text-primary hover:bg-gray-100 px-6 py-3 text-lg font-semibold shadow-md",
              })}
            >
              View the full roadmap
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <GeneralCTA />
      <div className="bg-purple-100" />
      <div className="text-purple-600" />
      <div className="bg-green-100" />
      <div className="text-green-600" />
      <div className="bg-blue-100" />
      <div className="text-blue-600" />
    </div>
  );
}
