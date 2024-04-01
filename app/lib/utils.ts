import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function checkIfArray(value: any) {
  try {
    const parsedValue = JSON.parse(value);
    return Array.isArray(parsedValue) || Array.isArray(value);
  } catch (error) {
    return false; // Return false if parsing as JSON fails
  }
}

export function convertFormDataToObject(formData: FormData) {
  let object: any = {};
  const values = Object.fromEntries(formData.entries());

  formData.forEach((value, key) => {
    object[key] = values[key];

    if (/^\d+$/.test(value)) {
      values[key] = parseInt(values[key]);
    } else if (/^-?\d+(\.\d+)?$/.test(value)) {
      values[key] = parseFloat(values[key]);
    } else if (values[key] === "null") {
      values[key] = null;
    } else if (values[key] === "true") {
      values[key] = true;
    } else if (values[key] === "false") {
      values[key] = false;
    } else if (checkIfArray(values[key])) {
      values[key] = JSON.parse(values[key]);
    }

    object[key] = values[key];
  });

  return object;
}
