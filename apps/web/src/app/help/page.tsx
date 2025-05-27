"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Book, HelpCircle, Mail, MessageCircle } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Help Center Section */}
      <section className="py-32 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl mx-auto"
          >
            <div className="w-24 h-24 mx-auto mb-8 bg-primary/10 rounded-full flex items-center justify-center">
              <HelpCircle className="h-12 w-12 text-primary" />
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Help Center
            </h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              We're building a comprehensive help center with FAQs, guides,
              tutorials, and support resources. This section is currently under
              development.
            </p>

            <Badge className="bg-primary/10 text-primary border-primary/20 mb-8">
              Under Development
            </Badge>

            <div className="space-y-6 mb-12">
              <h3 className="text-lg font-semibold text-gray-900">
                Coming soon:
              </h3>
              <div className="grid md:grid-cols-2 gap-6 text-left">
                <div className="flex items-start space-x-3">
                  <Book className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Getting Started Guide
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Step-by-step tutorials for new users
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <HelpCircle className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Frequently Asked Questions
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Answers to common questions
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MessageCircle className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Video Tutorials
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Visual guides for all features
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Mail className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Support Articles
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Detailed troubleshooting guides
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Need Help Right Now?
              </h3>
              <p className="text-gray-600 mb-4">
                While we're building our help center, you can reach out to us
                directly:
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button className="bg-primary hover:bg-primary/90 text-white">
                    Contact Support
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-white"
                >
                  Email: support@buzztrip.co
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
