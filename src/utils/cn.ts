import { type ClassValue } from "clsx";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combine conditional classes (clsx) and resolve Tailwind conflicts (twMerge).
 *
 * Usage:
 *   class={cn("mb-8", isActive && "text-primary", props.class)}
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default cn;
