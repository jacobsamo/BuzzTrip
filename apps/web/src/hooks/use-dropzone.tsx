"use client";

import type React from "react";

import type { ChangeEvent, DragEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

export interface FileRejection {
  file: File;
  errors: FileError[];
}

export interface FileError {
  code: string;
  message: string;
}

export interface Accept {
  [key: string]: string[];
}

export interface DropzoneOptions {
  /** Accept only specified mime types */
  accept?: Accept;
  /** Disable the dropzone */
  disabled?: boolean;
  /** Maximum file size in bytes */
  maxSize?: number;
  /** Minimum file size in bytes */
  minSize?: number;
  /** Maximum number of files */
  maxFiles?: number;
  /** Allow multiple files */
  multiple?: boolean;
  /** Prevent default behavior for dragover, dragenter, etc. */
  preventDropOnDocument?: boolean;
  /** Don't reject files that don't match accept criteria */
  noClick?: boolean;
  /** Don't open file dialog when the dropzone is clicked */
  noDrag?: boolean;
  /** Don't reject files that don't match accept criteria */
  noKeyboard?: boolean;
  /** Auto focus the root element when the dropzone is clicked */
  autoFocus?: boolean;
  /** Called when files are dropped or selected */
  onDrop?: (
    acceptedFiles: File[],
    fileRejections: FileRejection[],
    event?: DropEvent
  ) => void;
  /** Called when files are accepted */
  onDropAccepted?: (files: File[], event?: DropEvent) => void;
  /** Called when files are rejected */
  onDropRejected?: (fileRejections: FileRejection[], event?: DropEvent) => void;
  /** Called when the dropzone is clicked */
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  /** Called when the dropzone receives focus */
  onFocus?: (event: React.FocusEvent<HTMLElement>) => void;
  /** Called when the dropzone loses focus */
  onBlur?: (event: React.FocusEvent<HTMLElement>) => void;
  /** Called when the dragover event occurs */
  onDragOver?: (event: DragEvent<HTMLElement>) => void;
  /** Called when the dragenter event occurs */
  onDragEnter?: (event: DragEvent<HTMLElement>) => void;
  /** Called when the dragleave event occurs */
  onDragLeave?: (event: DragEvent<HTMLElement>) => void;
}

export type DropEvent = DragEvent<HTMLElement> | ChangeEvent<HTMLInputElement>;

export interface DropzoneState {
  /** Whether the dropzone is focused */
  isFocused: boolean;
  /** Whether the dropzone is being dragged over */
  isDragActive: boolean;
  /** Whether the dropzone is being dragged over and the files are accepted */
  isDragAccept: boolean;
  /** Whether the dropzone is being dragged over and the files are rejected */
  isDragReject: boolean;
  /** Whether the dropzone is disabled */
  isFileDialogActive: boolean;
}

export interface DropzoneRootProps {
  /** Ref to the root element */
  refKey?: string;
  /** Role of the root element */
  role?: string;
  /** Other props to pass to the root element */
  [key: string]: any;
}

export interface DropzoneInputProps {
  /** Ref to the input element */
  refKey?: string;
  /** Other props to pass to the input element */
  [key: string]: any;
}

export interface UseDropzoneResult extends DropzoneState {
  /** Get props for the root element */
  getRootProps: (props?: DropzoneRootProps) => any;
  /** Get props for the input element */
  getInputProps: (props?: DropzoneInputProps) => any;
  /** Open the file dialog programmatically */
  open: () => void;
}

/**
 * useDropzone hook
 *
 * A React hook that creates a drag'n'drop zone for files
 */
export function useDropzone(options: DropzoneOptions = {}): UseDropzoneResult {
  const {
    accept,
    disabled = false,
    maxSize = Number.POSITIVE_INFINITY,
    minSize = 0,
    maxFiles = 0,
    multiple = true,
    preventDropOnDocument = true,
    noClick = false,
    noDrag = false,
    noKeyboard = false,
    autoFocus = false,
    onDrop,
    onDropAccepted,
    onDropRejected,
    onClick,
    onFocus,
    onBlur,
    onDragOver,
    onDragEnter,
    onDragLeave,
  } = options;

  const rootRef = useRef<HTMLElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [isFocused, setIsFocused] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isDragAccept, setIsDragAccept] = useState(false);
  const [isDragReject, setIsDragReject] = useState(false);
  const [isFileDialogActive, setIsFileDialogActive] = useState(false);

  // Validate files against accept, maxSize, minSize, maxFiles
  const validateFiles = useCallback(
    (
      files: File[]
    ): { acceptedFiles: File[]; fileRejections: FileRejection[] } => {
      const acceptedFiles: File[] = [];
      const fileRejections: FileRejection[] = [];

      files.forEach((file) => {
        const errors: FileError[] = [];

        // Validate file type
        if (accept) {
          const acceptedType = Object.keys(accept).some((type) => {
            if (type === "audio/*" && file.type.startsWith("audio/"))
              return true;
            if (type === "video/*" && file.type.startsWith("video/"))
              return true;
            if (type === "image/*" && file.type.startsWith("image/"))
              return true;
            if (type === file.type) return true;
            if (
              type.endsWith("/*") &&
              file.type.startsWith(type.replace("/*", "/"))
            )
              return true;

            // Check file extension
            const extensions = accept[type];
            if (extensions && extensions.length) {
              const fileName = file.name || "";
              const fileExt = fileName.split(".").pop()?.toLowerCase() || "";
              return extensions.some(
                (ext) => ext.toLowerCase() === `.${fileExt}`
              );
            }

            return false;
          });

          if (!acceptedType) {
            errors.push({
              code: "file-invalid-type",
              message: `File type must be ${Object.keys(accept).join(", ")}`,
            });
          }
        }

        // Validate file size
        if (file.size > maxSize) {
          errors.push({
            code: "file-too-large",
            message: `File is larger than ${maxSize} bytes`,
          });
        }

        if (file.size < minSize) {
          errors.push({
            code: "file-too-small",
            message: `File is smaller than ${minSize} bytes`,
          });
        }

        // Validate max files
        if (maxFiles > 0 && acceptedFiles.length >= maxFiles) {
          errors.push({
            code: "too-many-files",
            message: `Too many files (max: ${maxFiles})`,
          });
        }

        if (errors.length) {
          fileRejections.push({ file, errors });
        } else {
          acceptedFiles.push(file);
        }
      });

      return { acceptedFiles, fileRejections };
    },
    [accept, maxSize, minSize, maxFiles]
  );

  // Handle file drop
  const handleFiles = useCallback(
    (files: FileList | File[], event?: DropEvent) => {
      const fileList = Array.from(files);
      const { acceptedFiles, fileRejections } = validateFiles(fileList);

      if (onDrop) {
        onDrop(acceptedFiles, fileRejections, event);
      }

      if (acceptedFiles.length > 0 && onDropAccepted) {
        onDropAccepted(acceptedFiles, event);
      }

      if (fileRejections.length > 0 && onDropRejected) {
        onDropRejected(fileRejections, event);
      }
    },
    [validateFiles, onDrop, onDropAccepted, onDropRejected]
  );

  // Handle drop event
  const handleDrop = useCallback(
    (event: DragEvent<HTMLElement>) => {
      event.preventDefault();
      event.stopPropagation();

      setIsDragActive(false);
      setIsDragAccept(false);
      setIsDragReject(false);

      if (event.dataTransfer?.files) {
        handleFiles(event.dataTransfer.files, event);
      }
    },
    [handleFiles]
  );

  // Handle dragover event
  const handleDragOver = useCallback(
    (event: DragEvent<HTMLElement>) => {
      event.preventDefault();
      event.stopPropagation();

      if (disabled) return;

      if (onDragOver) {
        onDragOver(event);
      }

      // Set drag states
      if (event.dataTransfer) {
        try {
          event.dataTransfer.dropEffect = "copy";
        } catch {} // Edge doesn't support this
      }

      setIsDragActive(true);
    },
    [disabled, onDragOver]
  );

  // Handle dragenter event
  const handleDragEnter = useCallback(
    (event: DragEvent<HTMLElement>) => {
      event.preventDefault();
      event.stopPropagation();

      if (disabled) return;

      if (onDragEnter) {
        onDragEnter(event);
      }

      // Validate files on drag enter to show accept/reject state
      if (event.dataTransfer?.items) {
        const items = Array.from(event.dataTransfer.items);
        const files = items
          .filter((item) => item.kind === "file")
          .map((item) => item.getAsFile())
          .filter(Boolean) as File[];

        const { acceptedFiles, fileRejections } = validateFiles(files);
        setIsDragAccept(acceptedFiles.length > 0);
        setIsDragReject(fileRejections.length > 0);
      }
    },
    [disabled, onDragEnter, validateFiles]
  );

  // Handle dragleave event
  const handleDragLeave = useCallback(
    (event: DragEvent<HTMLElement>) => {
      event.preventDefault();
      event.stopPropagation();

      if (disabled) return;

      if (onDragLeave) {
        onDragLeave(event);
      }

      setIsDragActive(false);
      setIsDragAccept(false);
      setIsDragReject(false);
    },
    [disabled, onDragLeave]
  );

  // Handle click event
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (disabled) return;

      if (onClick) {
        onClick(event);
      }

      if (noClick) {
        return;
      }

      // Open file dialog
      if (inputRef.current) {
        setIsFileDialogActive(true);
        inputRef.current.value = "";
        inputRef.current.click();
      }
    },
    [disabled, noClick, onClick]
  );

  // Handle change event (file selection)
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target.files) {
        handleFiles(event.target.files, event);
      }
      setIsFileDialogActive(false);
    },
    [handleFiles]
  );

  // Handle focus event
  const handleFocus = useCallback(
    (event: React.FocusEvent<HTMLElement>) => {
      if (disabled) return;
      if (onFocus) {
        onFocus(event);
      }
      setIsFocused(true);
    },
    [disabled, onFocus]
  );

  // Handle blur event
  const handleBlur = useCallback(
    (event: React.FocusEvent<HTMLElement>) => {
      if (disabled) return;
      if (onBlur) {
        onBlur(event);
      }
      setIsFocused(false);
    },
    [disabled, onBlur]
  );

  // Handle key down event (for keyboard accessibility)
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      if (disabled || noKeyboard) return;
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        handleClick(event as unknown as React.MouseEvent<HTMLElement>);
      }
    },
    [disabled, noKeyboard, handleClick]
  );

  // Prevent default drag behaviors on the document
  useEffect(() => {
    if (preventDropOnDocument && !noDrag) {
      const handleWindowDragOver = (event: DragEvent) => {
        event.preventDefault();
      };

      const handleWindowDrop = (event: DragEvent) => {
        event.preventDefault();
      };

      window.addEventListener("dragover", handleWindowDragOver);
      window.addEventListener("drop", handleWindowDrop);

      return () => {
        window.removeEventListener("dragover", handleWindowDragOver);
        window.removeEventListener("drop", handleWindowDrop);
      };
    }
  }, [preventDropOnDocument, noDrag]);

  // Auto focus the root element
  useEffect(() => {
    if (autoFocus && rootRef.current) {
      rootRef.current.focus();
    }
  }, [autoFocus]);

  // Get props for the root element
  const getRootProps = useCallback(
    (props: DropzoneRootProps = {}) => {
      const { refKey = "ref", role = "presentation", ...rest } = props;
      return {
        [refKey]: rootRef,
        role,
        "aria-disabled": disabled,
        tabIndex: disabled || noKeyboard ? -1 : 0,
        onKeyDown: handleKeyDown,
        onFocus: handleFocus,
        onBlur: handleBlur,
        onClick: handleClick,
        onDragEnter: noDrag ? undefined : handleDragEnter,
        onDragOver: noDrag ? undefined : handleDragOver,
        onDragLeave: noDrag ? undefined : handleDragLeave,
        onDrop: noDrag ? undefined : handleDrop,
        ...rest,
      };
    },
    [
      disabled,
      noKeyboard,
      noDrag,
      handleKeyDown,
      handleFocus,
      handleBlur,
      handleClick,
      handleDragEnter,
      handleDragOver,
      handleDragLeave,
      handleDrop,
    ]
  );

  // Get props for the input element
  const getInputProps = useCallback(
    (props: DropzoneInputProps = {}) => {
      const { refKey = "ref", ...rest } = props;
      return {
        [refKey]: inputRef,
        accept: accept ? Object.keys(accept).join(",") : undefined,
        multiple: multiple && maxFiles !== 1,
        type: "file",
        style: { display: "none" },
        onChange: handleChange,
        autoComplete: "off",
        tabIndex: -1,
        ...rest,
      };
    },
    [accept, multiple, maxFiles, handleChange]
  );

  // Open file dialog programmatically
  const open = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.click();
    }
  }, []);

  return {
    getRootProps,
    getInputProps,
    open,
    isFocused,
    isDragActive,
    isDragAccept,
    isDragReject,
    isFileDialogActive,
  };
}
