import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDustCost(id: number | null) {
  switch (id) {
    case 1: //common
    case 3:
      return 100;
    case 4:
      return 400;
    case 5:
      return 1600;
    default:
      return 0;
  }
}

export function getYouTubeVideoID(url: string) {
  try {
    const urlObj = new URL(url);
    if (
      urlObj.hostname === "www.youtube.com" ||
      urlObj.hostname === "youtube.com"
    ) {
      return urlObj.searchParams.get("v");
    }
    if (urlObj.hostname === "youtu.be") {
      return urlObj.pathname.substring(1); // Skip the leading "/"
    }
    return null;
  } catch (error) {
    return null;
  }
}

export function toCapital(value: string) {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

export function findData<T, K extends keyof T>(
  array: T[],
  key: K,
  value: T[K] | undefined | null,
) {
  const item = array.find((item) => item[key] === value);
  if (!item) {
    throw new Error(`Item with ${String(key)}=${value} not found`);
  }

  return item;
}
