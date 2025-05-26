"use client";
import DevelopmentCTA from "@/components/cta/development";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar,
  Check,
  Clock,
  Download,
  MapPin,
  Palette,
  Route,
  Ruler,
  Shield,
  Smartphone,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";

export default function RoadmapPage() {
  const roadmapItems = [
    {
      month: "January 2025",
      status: "completed",
      title: "Foundation & Core Features",
      description:
        "Built the essential mapping functionality that makes BuzzTrip useful from day one.",
      features: [
        { name: "Custom markers with descriptions and photos", icon: MapPin },
        { name: "Collections for organizing markers", icon: MapPin },
        { name: "Multiple maps support", icon: MapPin },
        { name: "Basic sharing via public links", icon: MapPin },
        { name: "Responsive web interface", icon: Smartphone },
        { name: "User authentication and profiles", icon: Users },
      ],
    },
    {
      month: "March 2025",
      status: "completed",
      title: "Enhanced User Experience",
      description:
        "Improved the core experience with better performance and usability.",
      features: [
        { name: "Improved map performance and loading", icon: Zap },
        { name: "Better mobile responsiveness", icon: Smartphone },
        { name: "Enhanced marker customization", icon: MapPin },
        { name: "Search and filter functionality", icon: MapPin },
        // { name: "Keyboard shortcuts for power users", icon: Zap },
      ],
    },
    {
      month: "June 2025",
      status: "in-progress",
      title: "Paths, Routes & Measurements",
      description:
        "Adding powerful tools for planning routes and measuring distances.",
      features: [
        { name: "Draw custom paths and routes", icon: Route },
        { name: "Distance and area measurements", icon: Ruler },
        { name: "Elevation profiles for routes", icon: Route },
        { name: "Turn-by-turn directions", icon: Route },
        { name: "Route optimization", icon: Route },
        { name: "Create custom points of interest (POIs)", icon: MapPin },
      ],
    },
    {
      month: "August 2025",
      status: "planned",
      title: "Collaboration & Sharing",
      description:
        "Making it easier to work together and share your maps with others.",
      features: [
        { name: "Real-time collaborative editing", icon: Users },
        { name: "Advanced sharing permissions", icon: Users },
        { name: "Comments and annotations", icon: Users },
        { name: "Activity feed for shared maps", icon: Users },
        { name: "Email notifications for collaborators", icon: Users },
      ],
    },
    {
      month: "May 2025",
      status: "planned",
      title: "Data Import & Export",
      description:
        "Seamlessly work with data from other mapping tools and formats.",
      features: [
        { name: "Import KML files from Google My Maps", icon: Download },
        { name: "Export to KML, GeoJSON, and CSV", icon: Download },
        { name: "Bulk import from spreadsheets", icon: Download },
        { name: "Integration with popular travel apps", icon: Download },
        { name: "Backup and restore functionality", icon: Download },
      ],
    },
    {
      month: "June 2025",
      status: "planned",
      title: "Custom Styling & Themes",
      description: "Make your maps truly yours with custom styling options.",
      features: [
        { name: "Custom map themes and color schemes", icon: Palette },
        { name: "Custom marker icons and styles", icon: Palette },
        { name: "Brand customization for teams", icon: Palette },
        { name: "Dark mode support", icon: Palette },
        { name: "Print-friendly map layouts", icon: Palette },
      ],
    },
    {
      month: "July 2025",
      status: "planned",
      title: "Mobile Apps Launch",
      description: "Native iOS and Android apps for mapping on the go.",
      features: [
        { name: "Native iOS app", icon: Smartphone },
        { name: "Native Android app", icon: Smartphone },
        { name: "Offline map support", icon: Smartphone },
        { name: "GPS tracking and location services", icon: Smartphone },
        {
          name: "Camera integration for quick photo markers",
          icon: Smartphone,
        },
      ],
    },
    {
      month: "August 2025",
      status: "planned",
      title: "Advanced Features & API",
      description:
        "Power user features and developer tools for advanced use cases.",
      features: [
        { name: "Public API for developers", icon: Zap },
        { name: "Webhook integrations", icon: Zap },
        { name: "Advanced analytics and insights", icon: Zap },
        { name: "Team management and permissions", icon: Shield },
        { name: "Enterprise security features", icon: Shield },
      ],
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
              Development Roadmap
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              See what we're building and what's coming next. We're committed to
              transparent development and regular updates to make BuzzTrip the
              best mapping platform.
            </p>
            <Badge className="bg-primary/10 text-primary border-primary/20">
              Updated monthly • Last updated: March 2025
            </Badge>
          </motion.div>
        </div>
      </section>

      {/* Roadmap Timeline */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-12">
              {roadmapItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -50, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start space-x-6"
                >
                  {/* Timeline indicator */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        item.status === "completed"
                          ? "bg-primary text-white"
                          : item.status === "in-progress"
                            ? "bg-amber-500 text-white"
                            : "bg-gray-300 text-gray-600"
                      }`}
                    >
                      {item.status === "completed" ? (
                        <Check className="h-4 w-4" />
                      ) : item.status === "in-progress" ? (
                        <Clock className="h-4 w-4" />
                      ) : (
                        <Calendar className="h-4 w-4" />
                      )}
                    </div>
                    {index < roadmapItems.length - 1 && (
                      <div className="w-0.5 h-24 bg-gray-200 mt-4" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <Card
                      className={`${
                        item.status === "completed"
                          ? "border-primary/30 bg-primary/5"
                          : item.status === "in-progress"
                            ? "border-amber-300 bg-amber-50"
                            : "border-gray-200"
                      }`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                              {item.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {item.month}
                            </p>
                          </div>
                          <Badge
                            className={
                              item.status === "completed"
                                ? "bg-primary text-white"
                                : item.status === "in-progress"
                                  ? "bg-amber-500 text-white"
                                  : "bg-gray-100 text-gray-700"
                            }
                          >
                            {item.status === "completed"
                              ? "Completed"
                              : item.status === "in-progress"
                                ? "In Progress"
                                : "Planned"}
                          </Badge>
                        </div>

                        <p className="text-gray-600 mb-6">{item.description}</p>

                        <div className="grid md:grid-cols-2 gap-3">
                          {item.features.map((feature, featureIndex) => (
                            <div
                              key={featureIndex}
                              className="flex items-center space-x-3"
                            >
                              <feature.icon
                                className={`h-4 w-4 ${
                                  item.status === "completed"
                                    ? "text-primary"
                                    : item.status === "in-progress"
                                      ? "text-amber-600"
                                      : "text-gray-400"
                                }`}
                              />
                              <span className="text-sm text-gray-700">
                                {feature.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-gray-400 mt-4">
          Subject to change over time as we gather feedback and prioritize
          features.
          <br />
          We value your input!
        </p>
      </section>

      {/* CTA Section */}
      <DevelopmentCTA />
    </div>
  );
}
