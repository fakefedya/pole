import "server-only";

import { randomBytes } from "node:crypto";

// Exclude visually ambiguous 0, 1, I and O in customer-facing references.
const ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
const CODE_LENGTH = 4;

/** 32 equally likely characters per position (each byte masked to 5 bits). */
export function createLeadShortCode(): string {
  const bytes = randomBytes(CODE_LENGTH);
  return Array.from(bytes, (byte) => ALPHABET[byte & 31]).join("");
}

/** Retry ONLY unique-code conflicts, never unrelated database errors. */
export function isLeadShortCodeConflict(error: unknown): boolean {
  if (
    !error ||
    typeof error !== "object" ||
    !("code" in error) ||
    error.code !== "P2002"
  ) {
    return false;
  }
  if (
    !("meta" in error) ||
    !error.meta ||
    typeof error.meta !== "object" ||
    !("target" in error.meta)
  ) {
    return false;
  }
  const { target } = error.meta;
  return Array.isArray(target)
    ? target.includes("shortCode")
    : typeof target === "string" && target.includes("shortCode");
}
