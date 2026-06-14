import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { isAuthed } from "@/app/lib/onboarding-auth";

export const runtime = "nodejs";

const MAX_BYTES = 25 * 1024 * 1024; // 25 MB per file
const ALLOWED = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // xlsx
  "application/vnd.ms-excel", // xls
  "text/csv",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // docx
  "application/msword", // doc
  "text/plain",
]);

export async function POST(req: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Storage is not configured (BLOB_READ_WRITE_TOKEN)." },
      { status: 503 }
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = form.get("file");
  const kind = (form.get("kind") as string | null)?.slice(0, 40) || "document";
  const company =
    (form.get("company") as string | null)
      ?.replace(/[^a-z0-9]+/gi, "-")
      .toLowerCase()
      .slice(0, 60) || "unknown";

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file" }, { status: 422 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File too large (max 25 MB)" }, { status: 413 });
  }
  if (file.type && !ALLOWED.has(file.type)) {
    return NextResponse.json(
      { error: `Unsupported file type: ${file.type}` },
      { status: 415 }
    );
  }

  const safeName = (file.name || "file").replace(/[^a-z0-9._-]+/gi, "_").slice(0, 120);

  try {
    const blob = await put(
      `onboarding/${company}/${kind}/${safeName}`,
      file,
      {
        access: "private",
        addRandomSuffix: true,
        contentType: file.type || "application/octet-stream",
      }
    );
    return NextResponse.json({
      ok: true,
      pathname: blob.pathname,
      url: blob.url,
      name: file.name,
      size: file.size,
      kind,
    });
  } catch (e) {
    console.error("[onboarding] upload failed:", e);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
