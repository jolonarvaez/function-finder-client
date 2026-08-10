import { Suspense } from "react";
import { OnboardingPageClient } from "@/components/onboarding/OnboardingPageClient";
import { Footer } from "@/components/shared/Footer";

export default function OnboardingPage() {
  return (
    <>
      <Suspense>
        <OnboardingPageClient />
      </Suspense>
      <Footer />
    </>
  );
}
