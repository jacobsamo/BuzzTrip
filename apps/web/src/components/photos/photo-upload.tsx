"use client";

import { Button } from "@buzztrip/ui/components/button";
import { Input } from "@buzztrip/ui/components/input";
import { Label } from "@buzztrip/ui/components/label";
import { useFileUpload } from "@/hooks/use-file-upload";
import { api } from "@buzztrip/backend/api";
import { Id } from "@buzztrip/backend/dataModel";
import { useMutation } from "convex/react";
import { AlertCircleIcon, ImageUpIcon, Loader2Icon, XIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

interface PhotoUploadProps {
  type: "place" | "marker";
  entityId: Id<"places"> | Id<"markers">;
  onUploadComplete?: () => void;
  maxFiles?: number;
  className?: string;
}

export function PhotoUpload({
  type,
  entityId,
  onUploadComplete,
  maxFiles = 5,
  className,
}: PhotoUploadProps) {
  const [captions, setCaptions] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);

  const generateUploadUrl = useMutation(api.photos.generateUploadUrl);
  const savePlacePhoto = useMutation(api.photos.savePlacePhoto);
  const saveMarkerPhoto = useMutation(api.photos.saveMarkerPhoto);

  const maxSizeMB = 10;
  const maxSize = maxSizeMB * 1024 * 1024; // 10MB

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps,
      clearFiles,
    },
  ] = useFileUpload({
    accept: "image/*",
    maxSize,
    multiple: true,
    maxFiles,
  });

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error("Please select at least one photo to upload");
      return;
    }

    setIsUploading(true);

    try {
      for (const fileWithPreview of files) {
        if (!(fileWithPreview.file instanceof File)) continue;

        const file = fileWithPreview.file;

        // Generate upload URL
        const uploadUrl = await generateUploadUrl();

        // Upload the file to Convex storage
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });

        const { storageId } = await result.json();

        // Get image dimensions
        const dimensions = await getImageDimensions(file);

        // Save the photo metadata
        if (type === "place") {
          await savePlacePhoto({
            place_id: entityId as Id<"places">,
            storage_id: storageId,
            width: dimensions.width,
            height: dimensions.height,
            caption: captions[fileWithPreview.id] || "",
          });
        } else {
          await saveMarkerPhoto({
            marker_id: entityId as Id<"markers">,
            storage_id: storageId,
            width: dimensions.width,
            height: dimensions.height,
            caption: captions[fileWithPreview.id] || "",
          });
        }
      }

      toast.success(
        `Successfully uploaded ${files.length} photo${files.length > 1 ? "s" : ""}`
      );
      clearFiles();
      setCaptions({});
      onUploadComplete?.();
    } catch (error) {
      console.error("Error uploading photos:", error);
      toast.error("Failed to upload photos. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const getImageDimensions = (
    file: File
  ): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
        URL.revokeObjectURL(img.src);
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  };

  return (
    <div className={className}>
      <div className="space-y-4">
        {/* Upload area */}
        <div
          role="button"
          onClick={isUploading ? undefined : openFileDialog}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          data-dragging={isDragging || undefined}
          className="border-input hover:bg-accent/50 data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-32 flex-col items-center justify-center rounded-xl border border-dashed p-4 transition-colors has-disabled:pointer-events-none has-disabled:opacity-50 has-[input:focus]:ring-[3px]"
        >
          <input
            {...getInputProps()}
            className="sr-only"
            aria-label="Upload photos"
            disabled={isUploading}
          />
          <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
            <div
              className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
              aria-hidden="true"
            >
              <ImageUpIcon className="size-4 opacity-60" />
            </div>
            <p className="mb-1.5 text-sm font-medium">
              Drop your photos here or click to browse
            </p>
            <p className="text-muted-foreground text-xs">
              Max {maxFiles} photos, {maxSizeMB}MB each
            </p>
          </div>
        </div>

        {errors.length > 0 && (
          <div
            className="text-destructive flex items-center gap-1 text-xs"
            role="alert"
          >
            <AlertCircleIcon className="size-3 shrink-0" />
            <span>{errors[0]}</span>
          </div>
        )}

        {/* Preview grid */}
        {files.length > 0 && (
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Selected Photos ({files.length})
            </Label>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {files.map((fileWithPreview) => (
                <div
                  key={fileWithPreview.id}
                  className="group relative flex flex-col gap-2"
                >
                  <div className="relative aspect-square overflow-hidden rounded-lg border">
                    {fileWithPreview.preview && (
                      <Image
                        src={fileWithPreview.preview}
                        fill
                        sizes="(max-width: 768px) 50vw, 33vw"
                        unoptimized
                        alt={
                          fileWithPreview.file instanceof File
                            ? fileWithPreview.file.name
                            : fileWithPreview.file.name
                        }
                        className="size-full object-cover"
                      />
                    )}
                    <button
                      type="button"
                      className="focus-visible:border-ring focus-visible:ring-ring/50 absolute top-2 right-2 z-10 flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-all outline-none hover:bg-black/80 focus-visible:opacity-100 focus-visible:ring-[3px] group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(fileWithPreview.id);
                        const newCaptions = { ...captions };
                        delete newCaptions[fileWithPreview.id];
                        setCaptions(newCaptions);
                      }}
                      disabled={isUploading}
                      aria-label="Remove photo"
                    >
                      <XIcon className="size-4" aria-hidden="true" />
                    </button>
                  </div>
                  <Input
                    placeholder="Add caption (optional)"
                    value={captions[fileWithPreview.id] || ""}
                    onChange={(e) =>
                      setCaptions({
                        ...captions,
                        [fileWithPreview.id]: e.target.value,
                      })
                    }
                    disabled={isUploading}
                    className="text-xs"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload button */}
        {files.length > 0 && (
          <Button
            onClick={handleUpload}
            disabled={isUploading}
            className="w-full"
          >
            {isUploading ? (
              <>
                <Loader2Icon className="mr-2 size-4 animate-spin" />
                Uploading...
              </>
            ) : (
              `Upload ${files.length} Photo${files.length > 1 ? "s" : ""}`
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
