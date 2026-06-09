import { Suspense } from "react";
import { OnboardingPageClient } from "@/components/onboarding/OnboardingPageClient";

export default function OnboardingPage() {
  return (
    <Suspense>
      <OnboardingPageClient />
    </Suspense>
  );
}
