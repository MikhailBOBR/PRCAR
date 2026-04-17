import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function normalizePhone(phone: string) {
  const digits = phone.replace(/\D/g, "");

  if (digits.length === 11 && digits.startsWith("8")) {
    return `7${digits.slice(1)}`;
  }

  return digits;
}

export function formatPhoneInput(phone: string) {
  const digits = normalizePhone(phone).slice(0, 11);
  const normalized = digits.startsWith("7") ? digits : `7${digits}`;
  const padded = normalized.padEnd(11, "_");

  return `+${padded[0]} (${padded.slice(1, 4)}) ${padded.slice(4, 7)}-${padded.slice(
    7,
    9,
  )}-${padded.slice(9, 11)}`;
}
