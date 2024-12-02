import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isEmail(data: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data);
}

export function isUsername(data: string) {
  return /^[a-zA-Z0-9_]{3,20}$/.test(data);
}
