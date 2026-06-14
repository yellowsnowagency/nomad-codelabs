import type { Metadata } from "next";
import { isAuthed } from "@/app/lib/onboarding-auth";
import OnboardingGate from "@/app/components/onboarding-gate";
import OnboardingForm from "@/app/components/onboarding-form";

export const metadata: Metadata = {
  title: "Onboarding",
  description: "AudioCrypt partner onboarding.",
  robots: { index: false, follow: false },
};

function decodePrefill(c?: string): Record<string, unknown> {
  if (!c) return {};
  try {
    const json = Buffer.from(c, "base64url").toString("utf8");
    const obj = JSON.parse(json);
    return obj && typeof obj === "object" ? (obj as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ c?: string }>;
}) {
  if (!(await isAuthed())) {
    return <OnboardingGate heading="AudioCrypt onboarding" />;
  }
  const { c } = await searchParams;
  return <OnboardingForm prefill={decodePrefill(c)} />;
}
