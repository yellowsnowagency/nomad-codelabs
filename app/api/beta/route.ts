import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { Resend } from "resend";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface Signup {
  email: string;
  product: string;
  ts: string;
  ip: string | null;
  ua: string | null;
}

// Durable sink: store each signup as a PRIVATE blob (emails are never exposed
// via a public URL). Returns true if the record was persisted.
async function persist(record: Signup): Promise<boolean> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return false;
  const safe = record.email.replace(/[^a-z0-9]/gi, "_").toLowerCase();
  await put(`beta/${record.product}/${safe}.json`, JSON.stringify(record, null, 2), {
    access: "private",
    addRandomSuffix: true,
    contentType: "application/json",
  });
  return true;
}

// Optional notification: emails the team when configured. Requires
// RESEND_API_KEY, BETA_NOTIFY_EMAIL, and BETA_FROM_EMAIL (a verified sender).
async function notify(record: Signup): Promise<boolean> {
  const { RESEND_API_KEY, BETA_NOTIFY_EMAIL, BETA_FROM_EMAIL } = process.env;
  if (!RESEND_API_KEY || !BETA_NOTIFY_EMAIL || !BETA_FROM_EMAIL) return false;
  const resend = new Resend(RESEND_API_KEY);
  await resend.emails.send({
    from: BETA_FROM_EMAIL,
    to: BETA_NOTIFY_EMAIL,
    subject: `Beta signup — ${record.product}`,
    text: `New beta signup\n\nEmail:   ${record.email}\nProduct: ${record.product}\nWhen:    ${record.ts}\nIP:      ${record.ip ?? "—"}`,
  });
  return true;
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { email, product } = (body ?? {}) as { email?: string; product?: string };
  const trimmed = typeof email === "string" ? email.trim() : "";

  if (!EMAIL_RE.test(trimmed)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 422 });
  }

  const record: Signup = {
    email: trimmed,
    product: (product || "all").trim().slice(0, 64),
    ts: new Date().toISOString(),
    ip: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
    ua: req.headers.get("user-agent"),
  };

  const [stored, notified] = await Promise.all([
    persist(record).catch((e) => {
      console.error("[beta] persist failed:", e);
      return false;
    }),
    notify(record).catch((e) => {
      console.error("[beta] notify failed:", e);
      return false;
    }),
  ]);

  // Don't lose a lead just because no sink is configured — log it loudly so it
  // is recoverable from runtime logs until storage is wired.
  if (!stored && !notified) {
    console.warn(
      `[beta] UNPERSISTED signup (configure BLOB_READ_WRITE_TOKEN or Resend): ${record.email} → ${record.product} @ ${record.ts}`
    );
  } else {
    console.log(`[beta] signup ${record.email} → ${record.product} (stored=${stored} notified=${notified})`);
  }

  return NextResponse.json({ ok: true });
}
