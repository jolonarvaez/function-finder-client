"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { OnboardingFlow } from "./OnboardingFlow";

export function OnboardingPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "";

  return (
    <main className="min-h-screen bg-background">
      <OnboardingFlow onComplete={() => router.replace(next || "/")} />
    </main>
  );
}
