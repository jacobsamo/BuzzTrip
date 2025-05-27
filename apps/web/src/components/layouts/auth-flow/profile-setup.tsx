"use client";
import ImageUploadModal from "@/components/modals/image-upload-modal";
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
import { User, useSession } from "@/lib/auth-client";
import { apiClient } from "@/server/api.client";
import { usersEditSchema } from "@buzztrip/db/zod-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Icons } from "./helpers";

interface ProfileSetupProps {
  onComplete: (profileData: User) => void;
}

const schema = usersEditSchema.pick({
  first_name: true,
  last_name: true,
  username: true,
  image: true,
  bio: true,
});

export function ProfileSetup({ onComplete }: ProfileSetupProps) {
  const auth = useSession();
  const router = useRouter();
  const { data } = auth;
  const user = data?.user as User | null ?? null;
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      first_name:user?.first_name ?? "",
      last_name:user?.last_name ?? "",
      username:user?.username ?? "",
      bio:user?.bio ?? "",
      image:user?.image ?? "",
    },
  });

  const [uploadImageModalOpen, setUploadImageModalOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(data?.user?.image ?? undefined);
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (data?.user) {
      console.log("Auth data:", {
        data,
        userImage: data.user.image,
      });
      form.setValue("first_name", data.user.first_name ?? "");
      form.setValue("last_name", data.user.last_name ?? "");
      form.setValue("username", data.user.username ?? "");
      form.setValue("bio", data.user.bio ?? "");
      form.setValue("image", data.user.image ?? "");
      setAvatarUrl(data.user.image ?? undefined);
    }
  }, [auth.isPending]);

  const handleFileChange = (file: File) => {
    const objectUrl = URL.createObjectURL(file);
    setProfilePictureFile(file);
    setAvatarUrl(objectUrl);
  };

  const handleSubmit = async (formData: z.infer<typeof schema>) => {
    let profilePicture = formData.image;

    if (profilePictureFile) {
      try {
        // Upload using the new files endpoint
        const formData = new FormData();
        formData.append("file", profilePictureFile);
        formData.append("folder", "profile-pictures");
        formData.append(
          "metadata",
          JSON.stringify({
            userId: data?.user?.id,
            uploadType: "profile",
          })
        );

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload profile picture");
        }

        const uploadResult = (await uploadResponse.json()) as any;
        profilePicture = uploadResult.fileUrl;
      } catch (error) {
        console.error("Failed to upload profile picture:", error);
        toast.error("Failed to upload profile picture");
      }
    }

    console.log("Profile picture", {
      profilePicture,
      user: data,
    });

    const updateUserProfile = apiClient.users[":userId"].$put({
      param: {
        userId: data?.user?.id!,
      },
      json: {
        image: profilePicture,
        first_name: formData.first_name,
        last_name: formData.last_name,
        username: formData.username,
      },
    });

    toast.promise(updateUserProfile, {
      loading: "Saving profile...",
      success: async (res) => {
        return "Profile saved successfully!";
      },
      error: "Failed to save profile",
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="cursor-pointer relative"
          >
            <div
              aria-label="Upload profile picture"
              role="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setUploadImageModalOpen(true);
              }}
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
            </div>

            <ImageUploadModal
              showTrigger={false}
              open={uploadImageModalOpen}
              onClose={() => setUploadImageModalOpen(false)}
              dropZoneProps={{
                onFilesAdded: (files) => {
                  const file = files[0]?.file;
                  if (file instanceof File) handleFileChange(file);
                },
              }}
            />
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
                  <Input {...field} value={field.value ?? ""} />
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
                  <Input {...field} value={field.value ?? ""} />
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
                  <Input {...field} value={field.value ?? ""} />
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
