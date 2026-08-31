import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(
  date: string | Date,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  },
) {
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("en-GB", options).format(d);
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function truncate(text: string, length = 160) {
  if (text.length <= length) return text;
  return `${text.slice(0, length).trimEnd()}…`;
}

/**
 * Money for display. Naira renders with its own symbol; anything else falls back
 * to the currency code, because a wrong symbol on a contribution figure is worse
 * than a plain one.
 */
export function formatCurrency(amount: number, currency = "NGN") {
  const value = new Intl.NumberFormat("en-NG", { maximumFractionDigits: 0 }).format(Math.round(amount));
  return currency === "NGN" ? `₦${value}` : `${currency} ${value}`;
}
