import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function stripExtension(str: string) {
  return str.slice(0, str.lastIndexOf("."));
}

// Sentence case, replace dash with space
export function formatTagHuman(str: string) {
  return str
    .split("-")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}
