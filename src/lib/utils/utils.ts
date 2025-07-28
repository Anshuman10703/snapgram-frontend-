// ~/snapgram-amplify-original/frontend/src/lib/utils/utils.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
    
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}