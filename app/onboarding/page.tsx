"use client";

import { useRouter } from "next/navigation";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";

export default function OnboardingPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-background">
      <OnboardingFlow onComplete={() => router.replace("/")} />
    </main>
  );
}
