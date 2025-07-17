import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
// this is mongo db connetciuonnx
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
