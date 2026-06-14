import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { VisibilityType } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Name shown publicly based on the submitter's visibility preference */
export function getPublicDisplayName(
  fullName: string,
  visibility: VisibilityType | "" | null | undefined
): string {
  const name = fullName.trim();
  if (!name || visibility === "anonymous") return "Anonymous";
  if (visibility === "first_name") {
    return name.split(/\s+/)[0] ?? name;
  }
  return name;
}

export function getVisibilityLabel(
  visibility: VisibilityType | string | null | undefined
): string {
  const labels: Record<string, string> = {
    full_name: "Full Name",
    first_name: "First Name Only",
    anonymous: "Anonymous",
  };
  return labels[visibility ?? ""] ?? "Not set";
}

/** Fixed-format date to avoid server/client locale hydration mismatches */
export function formatDate(iso: string | Date): string {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  const month = d.getUTCMonth() + 1;
  const day = d.getUTCDate();
  const year = d.getUTCFullYear();
  return `${month}/${day}/${year}`;
}

export function formatDateTime(iso: string | Date): string {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  const hours = d.getUTCHours().toString().padStart(2, "0");
  const minutes = d.getUTCMinutes().toString().padStart(2, "0");
  return `${formatDate(d)} ${hours}:${minutes}`;
}
