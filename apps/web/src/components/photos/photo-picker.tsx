"use client";

import { Button } from "@buzztrip/ui/components/button";
import { Input } from "@buzztrip/ui/components/input";
import { useFileUpload, type FileWithPreview } from "@/hooks/use-file-upload";
import { AlertCircleIcon, ImageUpIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export interface PendingPhoto {
  file: File;
  preview: string;
  caption: string;
  width: number;
  height: number;
  id: string;
}

interface PhotoPickerProps {
  maxFiles?: number;
  value?: PendingPhoto[];
  onChange?: (photos: PendingPhoto[]) => void;
  className?: string;
}

/**
 * PhotoPicker - A stateful component that allows users to select photos
 * Photos are kept in state and not uploaded until explicitly saved
 * Used for marker photos where we want to batch upload on save
 */
export function PhotoPicker({
  maxFiles = 5,
  value = [],
  onChange,
  className,
}: PhotoPickerProps) {
  const [pendingPhotos, setPendingPhotos] = useState<PendingPhoto[]>(value);
  const [captions, setCaptions] = useState<Record<string, string>>({});

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
    },
  ] = useFileUpload({
    accept: "image/*",
    maxSize,
    multiple: true,
    maxFiles: maxFiles - pendingPhotos.length,
    onFilesAdded: async (addedFiles) => {
      // Process new files and add dimensions
      const newPhotos: PendingPhoto[] = [];

      for (const fileWithPreview of addedFiles) {
        if (!(fileWithPreview.file instanceof File)) continue;

        const file = fileWithPreview.file;
        const dimensions = await getImageDimensions(file);

        newPhotos.push({
          file,
          preview: fileWithPreview.preview!,
          caption: "",
          width: dimensions.width,
          height: dimensions.height,
          id: fileWithPreview.id,
        });
      }

      const updated = [...pendingPhotos, ...newPhotos];
      setPendingPhotos(updated);
      onChange?.(updated);
    },
  });

  // Sync with external value changes
  useEffect(() => {
    if (value.length === 0 && pendingPhotos.length > 0) {
      setPendingPhotos([]);
      setCaptions({});
    }
  }, [value]);

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

  const handleRemovePhoto = (photoId: string) => {
    const updated = pendingPhotos.filter((p) => p.id !== photoId);
    setPendingPhotos(updated);
    onChange?.(updated);

    const newCaptions = { ...captions };
    delete newCaptions[photoId];
    setCaptions(newCaptions);

    // Also remove from file upload state
    removeFile(photoId);
  };

  const handleCaptionChange = (photoId: string, caption: string) => {
    setCaptions({ ...captions, [photoId]: caption });

    // Update the pending photo with the new caption
    const updated = pendingPhotos.map((p) =>
      p.id === photoId ? { ...p, caption } : p
    );
    setPendingPhotos(updated);
    onChange?.(updated);
  };

  const canAddMore = pendingPhotos.length < maxFiles;

  return (
    <div className={className}>
      <div className="space-y-4">
        {/* Upload area - only show if can add more */}
        {canAddMore && (
          <>
            <div
              role="button"
              onClick={openFileDialog}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              data-dragging={isDragging || undefined}
              className="border-input hover:bg-accent/50 data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-24 flex-col items-center justify-center rounded-xl border border-dashed p-4 transition-colors has-disabled:pointer-events-none has-disabled:opacity-50 has-[input:focus]:ring-[3px]"
            >
              <input
                {...getInputProps()}
                className="sr-only"
                aria-label="Upload photos"
              />
              <div className="flex flex-col items-center justify-center text-center">
                <ImageUpIcon className="text-muted-foreground mb-2 size-5" />
                <p className="text-xs font-medium">
                  Add photos ({pendingPhotos.length}/{maxFiles})
                </p>
                <p className="text-muted-foreground text-xs">
                  Max {maxSizeMB}MB each
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
          </>
        )}

        {/* Preview grid */}
        {pendingPhotos.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {pendingPhotos.map((photo) => (
              <div key={photo.id} className="group relative flex flex-col gap-1.5">
                <div className="relative aspect-square overflow-hidden rounded-lg border">
                  <Image
                    src={photo.preview}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    unoptimized
                    alt={photo.caption || "Photo preview"}
                    className="size-full object-cover"
                  />
                  <button
                    type="button"
                    className="focus-visible:border-ring focus-visible:ring-ring/50 absolute top-1.5 right-1.5 z-10 flex size-7 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-all outline-none hover:bg-black/80 focus-visible:opacity-100 focus-visible:ring-[3px] group-hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemovePhoto(photo.id);
                    }}
                    aria-label="Remove photo"
                  >
                    <XIcon className="size-3.5" aria-hidden="true" />
                  </button>
                </div>
                <Input
                  placeholder="Add caption (optional)"
                  value={captions[photo.id] || photo.caption || ""}
                  onChange={(e) => handleCaptionChange(photo.id, e.target.value)}
                  className="h-7 text-xs"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
