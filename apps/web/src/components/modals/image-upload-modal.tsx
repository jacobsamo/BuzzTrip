import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileUploadOptions, useFileUpload } from "@/hooks/use-file-upload";
import { AlertCircleIcon, ImageUpIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

interface ImageUploadModalProps {
  trigger?: React.ReactNode;
  showTrigger?: boolean;
  open?: boolean;
  onClose?: () => void;
  dropZoneProps?: Omit<FileUploadOptions, "accept" | "maxSize" | "multiple">;
}

const ImageUploadModal = ({
  trigger,
  showTrigger = true,
  open,
  onClose,
  dropZoneProps,
}: ImageUploadModalProps) => {
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = open !== undefined && onClose !== undefined;

  const currentOpen = isControlled ? open : internalOpen;
  const setCurrentOpen = isControlled ? onClose : setInternalOpen;

  const maxSizeMB = 5;
  const maxSize = maxSizeMB * 1024 * 1024; // 5MB default

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
    ...dropZoneProps,
    accept: "image/*",
    maxSize,
    multiple: false,
    maxFiles: 1,
  });

  const previewUrl = files[0]?.preview || null;

  useEffect(() => {
    if (isControlled) {
      setInternalOpen(open);
    }
  }, [open, isControlled]);

  return (
    <Dialog open={currentOpen} onOpenChange={setCurrentOpen}>
      {showTrigger && (
        <DialogTrigger asChild={trigger ? true : false}>
          {trigger ? (
            trigger
          ) : (
            <Button variant="outline">Upload an image</Button>
          )}
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload an image</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <div className="relative">
            <div
              role="button"
              onClick={openFileDialog}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              data-dragging={isDragging || undefined}
              className="border-input hover:bg-accent/50 data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-52 flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors has-disabled:pointer-events-none has-disabled:opacity-50 has-[img]:border-none has-[input:focus]:ring-[3px]"
            >
              <input
                {...getInputProps()}
                className="sr-only"
                aria-label="Upload file"
              />
              {previewUrl ? (
                <div className="absolute inset-0">
                  <Image
                    src={previewUrl}
                    fill
                    sizes="(max-width: 768px) 100vw, 768px"
                    unoptimized
                    alt={files[0]?.file?.name || "Uploaded image"}
                    className="size-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
                  <div
                    className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
                    aria-hidden="true"
                  >
                    <ImageUpIcon className="size-4 opacity-60" />
                  </div>
                  <p className="mb-1.5 text-sm font-medium">
                    Drop your image here or click to browse
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Max size: {maxSizeMB}MB
                  </p>
                </div>
              )}
            </div>
            {previewUrl && (
              <div className="absolute top-4 right-4">
                <button
                  type="button"
                  className="focus-visible:border-ring focus-visible:ring-ring/50 z-50 flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:ring-[3px]"
                  onClick={() => removeFile(files[0]?.id ?? "")}
                  aria-label="Remove image"
                >
                  <XIcon className="size-4" aria-hidden="true" />
                </button>
              </div>
            )}
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
        </div>

        <DialogClose asChild disabled={!previewUrl} type="button">
          <Button variant="outline" disabled={!previewUrl} type="button">
            Continue
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default ImageUploadModal;
