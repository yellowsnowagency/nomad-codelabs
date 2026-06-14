import "server-only";
import { cookies } from "next/headers";
import crypto from "node:crypto";

// Shared-password gate for the hidden onboarding surfaces.
// Configure ONBOARDING_PASSWORD (required) and optionally ONBOARDING_SECRET
// (salt for the auth cookie) in the environment.

export const ONB_COOKIE = "onb_auth";
export const ONB_MAX_AGE = 60 * 60 * 8; // 8 hours

function configuredPassword(): string {
  return process.env.ONBOARDING_PASSWORD ?? "";
}

// Opaque cookie value — never stores the password itself.
export function authToken(): string {
  const salt = process.env.ONBOARDING_SECRET ?? "nmdcd-onboarding";
  return crypto
    .createHash("sha256")
    .update(`${configuredPassword()}:${salt}`)
    .digest("hex");
}

export function isConfigured(): boolean {
  return configuredPassword().length > 0;
}

export function verifyPassword(input: unknown): boolean {
  const pw = configuredPassword();
  if (pw.length === 0) return false;
  if (typeof input !== "string") return false;
  // constant-time compare
  const a = Buffer.from(input);
  const b = Buffer.from(pw);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function isAuthed(): Promise<boolean> {
  if (!isConfigured()) return false;
  const store = await cookies();
  const value = store.get(ONB_COOKIE)?.value;
  return !!value && value === authToken();
}
