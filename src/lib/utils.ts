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
