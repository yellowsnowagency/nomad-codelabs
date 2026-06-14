import { NextResponse } from "next/server";
import {
  ONB_COOKIE,
  ONB_MAX_AGE,
  authToken,
  isConfigured,
  verifyPassword,
} from "@/app/lib/onboarding-auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!isConfigured()) {
    return NextResponse.json(
      { error: "Onboarding access is not configured." },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { password } = (body ?? {}) as { password?: string };

  if (!verifyPassword(password)) {
    return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ONB_COOKIE, authToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ONB_MAX_AGE,
  });
  return res;
}
