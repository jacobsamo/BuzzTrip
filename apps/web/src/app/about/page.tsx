"use client";
import GeneralCTA from "@/components/cta";
import SocialLinks from "@/components/social-links";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Globe, Heart, Users, Zap } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

export default function AboutPage() {
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
              About BuzzTrip
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're building the future of mapping and trip planning, one
              adventure at a time.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
                Our Story
              </h2>

              <div className="prose prose-lg mx-auto text-gray-600 leading-relaxed">
                <p className="mb-6">
                  BuzzTrip started with a simple frustration. As someone working
                  in the photography space, I often find myself discovering
                  great locations that I want to save, organize, and share.
                  Existing tools like Google My Maps and Wanderlog offer partial
                  solutions, but many are either too limited in scope or lack
                  proper mobile support.
                </p>

                <p className="mb-6">
                  The idea for BuzzTrip crystallized when my partner and I began
                  planning a road trip around Australia. We tried using Google
                  My Maps, which worked well at first—until we realized it was
                  desktop-only. She couldn't add new locations on her phone,
                  which quickly became frustrating.
                </p>

                <p className="mb-6">
                  So I decided to build something better: a modern,
                  mobile-friendly alternative that combines the best features of
                  Google My Maps, Wanderlog, Apple Maps, AllTrails, and others
                  into one unified platform.
                </p>

                <p>
                  BuzzTrip is designed to be simple enough for everyday planners
                  and powerful enough for organizing large trips, events, and
                  shared itineraries. We believe that great adventures start
                  with great planning, and great planning starts with great
                  tools.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Our Mission & Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're driven by the belief that everyone should have access to
              powerful, intuitive mapping tools.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: Heart,
                title: "User-Centered Design",
                description:
                  "Every feature we build starts with real user needs and frustrations. We listen, learn, and iterate based on your feedback.",
              },
              {
                icon: Zap,
                title: "Simplicity & Power",
                description:
                  "We believe powerful tools don't have to be complicated. Our goal is to make complex mapping tasks feel effortless.",
              },
              {
                icon: Globe,
                title: "Cross-Platform First",
                description:
                  "Whether you're on desktop, mobile, or tablet, BuzzTrip works seamlessly across all your devices.",
              },
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full text-center">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-2xl flex items-center justify-center">
                      <value.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Meet the Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're a small but passionate team based in Brisbane, Australia,
              dedicated to building the best mapping platform for creators,
              travelers, and planners.
            </p>
          </motion.div>

          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="text-center">
                <CardContent className="p-8">
                  <div className="w-24 h-24 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Small Team, Big Dreams
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    Currently, BuzzTrip is primarily developed by a solo founder{" "}
                    <Link
                      href={"https://jacobsamo.com"}
                      className="underline underline-offset-2"
                    >
                      Jacob Samorowski{" "}
                    </Link>
                    with a passion for photography, travel, and great user
                    experiences. We're growing slowly and thoughtfully, focusing
                    on building the right product before scaling the team.
                  </p>
                  <Badge className="bg-primary/10 text-primary border-primary/20">
                    Based in Brisbane, Australia
                  </Badge>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Links */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Stay Connected
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
              Follow our journey and get the latest updates on new features,
              development progress, and company news.
            </p>

            <SocialLinks />
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <GeneralCTA />
    </div>
  );
}
