import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility to merge Tailwind class names safely.
 * Falls back to simple concatenation if clsx/tailwind-merge aren't available.
 */
export function cn(...inputs) {
  try {
    return twMerge(clsx(inputs));
  } catch {
    // Fallback: flatten and join
    return inputs
      .flat()
      .filter(Boolean)
      .join(" ");
  }
}
