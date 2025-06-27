"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getBlogPosts } from "@/lib/blog";
import { Bell, BookOpen } from "lucide-react";
import { motion } from "motion/react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blogs",
  description: "Keep up to date with BuzzTrips latest news and updates.",
};

export default function BlogPage() {
  const data = getBlogPosts();

  const posts = data
  .sort((a, b) => {
    if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
      return -1;
    }
    return 1;
  })
  
  return (
    <div className="min-h-screen bg-white">
      {/* Coming Soon Section */}
      <section className="py-32 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl mx-auto"
          >
            <div className="w-24 h-24 mx-auto mb-8 bg-primary/10 rounded-full flex items-center justify-center">
              <BookOpen className="h-12 w-12 text-primary" />
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Cool Blog Coming Soon
            </h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              We're working on an awesome blog where we'll share mapping tips,
              travel stories, development updates, and insights from the
              BuzzTrip community. Stay tuned!
            </p>

            <Badge className="bg-primary/10 text-primary border-primary/20 mb-8">
              Coming in Q2 2025
            </Badge>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                What to expect:
              </h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Mapping tips and best practices</li>
                <li>• Travel planning guides and stories</li>
                <li>• Product updates and feature announcements</li>
                <li>• Community spotlights and user stories</li>
                <li>• Behind-the-scenes development insights</li>
              </ul>
            </div>

            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white"
              >
                <Bell className="mr-2 h-5 w-5" />
                Notify Me When It's Ready
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-white"
              >
                Follow Our Updates
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
