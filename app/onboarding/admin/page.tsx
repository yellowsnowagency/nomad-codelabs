import type { Metadata } from "next";
import { isAuthed } from "@/app/lib/onboarding-auth";
import OnboardingGate from "@/app/components/onboarding-gate";
import OnboardingAdmin from "@/app/components/onboarding-admin";

export const metadata: Metadata = {
  title: "Onboarding · Admin",
  description: "Generate a prefilled onboarding link.",
  robots: { index: false, follow: false },
};

export default async function OnboardingAdminPage() {
  if (!(await isAuthed())) {
    return <OnboardingGate heading="Onboarding admin" />;
  }
  return <OnboardingAdmin />;
}
