"use client";
import { sendContactEmail } from "@/actions/send-contact-email";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { contactSchema } from "@/types/scheams";
import { zodResolver } from "@hookform/resolvers/zod";
import { Clock, Loader2, Mail, MapPin, MessageCircle } from "lucide-react";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

export default function ContactPage() {
  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
  });

  const {
    control,
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (data: z.infer<typeof contactSchema>) => {
    try {
      const send = sendContactEmail(data);
      toast.promise(send, {
        loading: "Sending your message...",
        success: "Message sent successfully! We'll get back to you soon.",
        error: "Failed to send message. Please try again later.",
      });
      form.reset();
    } catch (error) {
      // Handle error (e.g., show an error message)
    }
  };

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
              Get in Touch
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Have a question, suggestion, or need help? We'd love to hear from
              you. Send us a message and we'll get back to you as soon as
              possible.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    Send us a message
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={control}
                          name="firstName"
                          render={({ field }) => {
                            return (
                              <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="John"
                                    className="mt-1"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            );
                          }}
                        />

                        <FormField
                          control={control}
                          name="lastName"
                          render={({ field }) => {
                            return (
                              <FormItem>
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="Doe"
                                    className="mt-1"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            );
                          }}
                        />
                      </div>

                      <FormField
                        control={control}
                        name="email"
                        render={({ field }) => {
                          return (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  id="email"
                                  type="email"
                                  placeholder="john@example.com"
                                  className="mt-1"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />

                      <FormField
                        control={control}
                        name="subject"
                        render={({ field }) => {
                          return (
                            <FormItem>
                              <FormLabel>Subject</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  id="subject"
                                  placeholder="How can we help you?"
                                  className="mt-1"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />

                      <FormField
                        control={control}
                        name="message"
                        render={({ field }) => {
                          return (
                            <FormItem>
                              <FormLabel>Message</FormLabel>
                              <FormControl>
                                <Textarea
                                  {...field}
                                  id="message"
                                  placeholder="Tell us more about your question or feedback..."
                                  className="mt-1 min-h-[120px]"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />

                      <Button
                        className="w-full bg-primary hover:bg-primary/90 text-white"
                        disabled={isSubmitting}
                        type="submit"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="size-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          "Send Message"
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Other ways to reach us
                </h2>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Email Support
                      </h3>
                      <p className="text-gray-600">support@buzztrip.co</p>
                      <p className="text-sm text-gray-500">
                        We typically respond within 24 hours
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <MessageCircle className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        General Inquiries
                      </h3>
                      <p className="text-gray-600">hello@buzztrip.co</p>
                      <p className="text-sm text-gray-500">
                        For partnerships, press, and general questions
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Response Time
                      </h3>
                      <p className="text-gray-600">24-48 hours</p>
                      <p className="text-sm text-gray-500">
                        Monday to Friday, 9 AM - 5 PM AEST
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Location</h3>
                      <p className="text-gray-600">Brisbane, Australia</p>
                      <p className="text-sm text-gray-500">
                        Building the future of mapping, one trip at a time
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Quick Tips
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>
                      • Include as much detail as possible in your message
                    </li>
                    <li>• For bug reports, mention your browser and device</li>
                    <li>• Check our roadmap for upcoming features</li>
                    <li>• Follow us on social media for updates</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
