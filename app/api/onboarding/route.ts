import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { Resend } from "resend";
import { isAuthed } from "@/app/lib/onboarding-auth";

export const runtime = "nodejs";

interface UploadRef {
  kind: string;
  name: string;
  pathname: string;
  size: number;
}

interface Submission {
  company_name: string;
  fields: Record<string, unknown>;
  uploads: UploadRef[];
  ts: string;
  ip: string | null;
  ua: string | null;
}

async function persist(record: Submission): Promise<boolean> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return false;
  const safe =
    record.company_name.replace(/[^a-z0-9]+/gi, "-").toLowerCase().slice(0, 60) ||
    "unknown";
  await put(
    `onboarding/${safe}/submission.json`,
    JSON.stringify(record, null, 2),
    {
      access: "private",
      addRandomSuffix: true,
      contentType: "application/json",
    }
  );
  return true;
}

async function notify(record: Submission): Promise<boolean> {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const to = process.env.ONBOARDING_NOTIFY_EMAIL ?? process.env.BETA_NOTIFY_EMAIL;
  const from = process.env.ONBOARDING_FROM_EMAIL ?? process.env.BETA_FROM_EMAIL;
  if (!RESEND_API_KEY || !to || !from) return false;

  const resend = new Resend(RESEND_API_KEY);
  const f = record.fields;
  const line = (k: string, label: string) =>
    f[k] != null && f[k] !== ""
      ? `${label}: ${Array.isArray(f[k]) ? (f[k] as string[]).join(", ") : f[k]}\n`
      : "";

  let text = `New AudioCrypt onboarding submission\n\n`;
  text += `Company: ${record.company_name}\n`;
  text += line("legal_form", "Legal form");
  text += line("vat_id", "VAT ID");
  text += line("contact_name", "Contact");
  text += line("contact_email", "Email");
  text += line("contact_phone", "Phone");
  text += line("ptype", "Product types");
  text += line("scenario", "Scenarios");
  text += line("platform", "Platforms");
  text += `\nUploads (${record.uploads.length}):\n`;
  for (const u of record.uploads) text += `  - [${u.kind}] ${u.name} (${u.pathname})\n`;
  text += `\nFull payload stored in Vercel Blob.\nWhen: ${record.ts}\nIP: ${record.ip ?? "—"}\n`;

  await resend.emails.send({
    from,
    to,
    subject: `Onboarding — ${record.company_name}`,
    text,
  });
  return true;
}

export async function POST(req: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { fields, uploads } = (body ?? {}) as {
    fields?: Record<string, unknown>;
    uploads?: UploadRef[];
  };

  const companyName =
    typeof fields?.company_name === "string" ? fields.company_name.trim() : "";
  if (!companyName) {
    return NextResponse.json({ error: "Company name is required" }, { status: 422 });
  }

  const record: Submission = {
    company_name: companyName,
    fields: fields ?? {},
    uploads: Array.isArray(uploads) ? uploads.slice(0, 50) : [],
    ts: new Date().toISOString(),
    ip: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
    ua: req.headers.get("user-agent"),
  };

  const [stored, notified] = await Promise.all([
    persist(record).catch((e) => {
      console.error("[onboarding] persist failed:", e);
      return false;
    }),
    notify(record).catch((e) => {
      console.error("[onboarding] notify failed:", e);
      return false;
    }),
  ]);

  if (!stored && !notified) {
    console.warn(
      `[onboarding] UNPERSISTED submission (configure BLOB_READ_WRITE_TOKEN or Resend): ${record.company_name} @ ${record.ts}`
    );
  } else {
    console.log(
      `[onboarding] submission ${record.company_name} (stored=${stored} notified=${notified})`
    );
  }

  return NextResponse.json({ ok: true });
}
