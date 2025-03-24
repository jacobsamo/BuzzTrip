"use client";

import type React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { usersEditSchema } from "@buzztrip/db/zod-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Icons } from "./icons";

interface ProfileSetupProps {
  email: string;
  onComplete: (profileData: any) => void;
}

const schema = usersEditSchema.pick({
  first_name: true,
  last_name: true,
  username: true,
  profile_picture: true,
  bio: true,
});

export function ProfileSetup({ email, onComplete }: ProfileSetupProps) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      first_name: "",
      last_name: "",
      username: "",
    },
  });

  const [avatarUrl, setAvatarUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload the file to a server
      // For this demo, we'll create a local object URL
      const objectUrl = URL.createObjectURL(file);
      form.setValue("profile_picture", objectUrl);
    }
  };

  const handleSubmit = (data: z.infer<typeof schema>) => {
    setIsLoading(true);

    // Prepare profile data
    const profileData = data;

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onComplete(profileData);
    }, 1500);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAvatarClick}
            className="cursor-pointer relative"
          >
            <Avatar className="h-20 w-20">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback className="bg-primary/10">
                <Icons.user className="h-8 w-8 text-primary" />
              </AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1">
              <Icons.camera className="h-4 w-4" />
            </div>
          </motion.div>
        </div>

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="first_name"
            rules={{ required: true }}
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input value={field?.value ?? ""} {...field} />
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="last_name"
            rules={{ required: true }}
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            rules={{ required: true }}
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              Saving profile...
            </>
          ) : (
            "Complete Setup"
          )}
        </Button>
      </form>
    </Form>
  );
}
