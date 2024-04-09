import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export * from "./checks";
export * from "./subsciptions";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
