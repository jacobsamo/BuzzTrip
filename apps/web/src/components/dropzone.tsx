"use client"

import React, { useCallback, useState } from "react"
import { useDropzone, type FileRejection } from "../hooks/use-dropzone"
import { cn } from "@/lib/utils"
import { FileIcon, XIcon, UploadIcon } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export type FileWithPreview = File & {
  preview: string
}

export interface DropzoneProps {
  /** Function called when files are added or removed */
  onFileChange: (files: File | File[] | null) => void
  /** Accepted file types (e.g., { 'image/*': [] }) */
  accept?: Record<string, string[]>
  /** Maximum file size in bytes */
  maxSize?: number
  /** Minimum file size in bytes */
  minSize?: number
  /** Maximum number of files allowed */
  maxFiles?: number
  /** Whether to allow multiple file selection */
  multiple?: boolean
  /** Custom class name for the dropzone container */
  className?: string
  /** Placeholder text shown when no files are selected */
  placeholder?: React.ReactNode
  /** Whether to show file previews */
  showPreviews?: boolean
  /** Initial files to display */
  initialFiles?: File[]
  /** Whether the dropzone is disabled */
  disabled?: boolean
  /** Whether to show the file dialog when the dropzone is clicked */
  noClick?: boolean
  /** Whether to disable drag and drop */
  noDrag?: boolean
}

export function Dropzone({
  onFileChange,
  accept,
  maxSize = 5 * 1024 * 1024, // 5MB default
  minSize = 0,
  maxFiles = 0,
  multiple = false,
  className,
  placeholder,
  showPreviews = true,
  initialFiles = [],
  disabled = false,
  noClick = false,
  noDrag = false,
}: DropzoneProps) {
  const [files, setFiles] = useState<FileWithPreview[]>(
    () =>
      initialFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        }),
      ) as FileWithPreview[],
  )

  const [rejectedFiles, setRejectedFiles] = useState<FileRejection[]>([])

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (acceptedFiles?.length) {
        const newFiles = acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          }),
        ) as FileWithPreview[]

        setFiles((prevFiles) => {
          // If not multiple, replace files
          if (!multiple) {
            // Revoke previous preview URLs to avoid memory leaks
            prevFiles.forEach((file) => URL.revokeObjectURL(file.preview))
            return newFiles.slice(0, 1)
          }

          // If multiple, add new files up to maxFiles
          const combinedFiles = [...prevFiles, ...newFiles]
          return maxFiles > 0 ? combinedFiles.slice(0, maxFiles) : combinedFiles
        })
      }

      if (rejectedFiles?.length) {
        setRejectedFiles(rejectedFiles)
      }
    },
    [maxFiles, multiple],
  )

  const removeFile = (file: FileWithPreview) => {
    setFiles((prevFiles) => {
      const newFiles = prevFiles.filter((f) => f !== file)
      URL.revokeObjectURL(file.preview)
      return newFiles
    })
  }

  const removeRejectedFile = (index: number) => {
    setRejectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
  }

  // Clean up preview URLs when component unmounts
  React.useEffect(() => {
    return () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview))
    }
  }, [files])

  // Use a ref to track previous files to avoid unnecessary updates
  const prevFilesRef = React.useRef<FileWithPreview[]>([])

  // Call onFileChange only when files actually change
  React.useEffect(() => {
    // Skip the initial call when the component mounts
    if (prevFilesRef.current.length === 0 && files.length === 0) {
      prevFilesRef.current = files
      return
    }

    // Check if files have actually changed
    const filesChanged =
      prevFilesRef.current.length !== files.length || files.some((file, i) => prevFilesRef.current[i] !== file)

    if (filesChanged) {
      prevFilesRef.current = files

      if (multiple) {
        onFileChange(files.length > 0 ? files : [])
      } else {
        onFileChange(files[0] || null)
      }
    }
  }, [files, multiple, onFileChange])

  const isImageFile = (file: File) => {
    return file.type.startsWith("image/")
  }

  const { getRootProps, getInputProps, isDragActive, isDragReject, isDragAccept, open } = useDropzone({
    onDrop,
    accept,
    maxSize,
    minSize,
    maxFiles,
    multiple,
    disabled,
    noClick,
    noDrag,
  })

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "relative flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-lg transition-colors",
          isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
          isDragAccept && "border-green-500 bg-green-500/5",
          isDragReject && "border-destructive bg-red-500/5",
          disabled && "opacity-50 cursor-not-allowed",
          className,
        )}
      >
        <input {...getInputProps()} />

        {placeholder || (
          <div className="flex flex-col items-center justify-center space-y-2 text-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted">
              <UploadIcon className="w-6 h-6 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">
                {isDragActive
                  ? "Drop the files here..."
                  : `Drag & drop ${multiple ? "files" : "a file"} here, or click to select`}
              </p>
              <p className="text-xs text-muted-foreground">
                {accept ? `Accepts: ${Object.keys(accept).join(", ")}` : "Accepts all file types"}
                {maxSize && ` · Max size: ${(maxSize / (1024 * 1024)).toFixed(1)}MB`}
                {multiple && maxFiles > 0 && ` · Max files: ${maxFiles}`}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Rejected files */}
      {rejectedFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-red-500">Rejected files</p>
          <ul className="space-y-2">
            {rejectedFiles.map((rejection, index) => (
              <li
                key={`${rejection.file.name}-${index}`}
                className="flex items-center justify-between p-2 text-sm bg-red-50 border border-red-200 rounded-md"
              >
                <div className="flex items-center space-x-2">
                  <FileIcon className="w-4 h-4 text-red-500" />
                  <span className="text-red-700">{rejection.file.name}</span>
                  <span className="text-xs text-red-500">{rejection.errors.map((e) => e.message).join(", ")}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeRejectedFile(index)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <XIcon className="w-4 h-4" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* File previews */}
      {showPreviews && files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Selected {files.length > 1 ? `files (${files.length})` : "file"}</p>
          <ul className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {files.map((file) => (
              <li key={file.name} className="relative group overflow-hidden border rounded-md p-2">
                <div className="flex items-center space-x-2">
                  {isImageFile(file) ? (
                    <div className="relative w-full aspect-square rounded-md overflow-hidden bg-muted">
                      <Image
                        src={file.preview || "/placeholder.svg"}
                        alt={file.name}
                        fill
                        className="object-cover"
                        onLoad={() => {
                          URL.revokeObjectURL(file.preview)
                        }}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-full aspect-square rounded-md bg-muted">
                      <FileIcon className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="mt-2 text-xs truncate">{file.name}</div>
                <div className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFile(file)}
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white"
                >
                  <XIcon className="w-4 h-4" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
