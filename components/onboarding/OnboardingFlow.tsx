"use client";

import { OnboardingRolePage } from "@/components/onboarding/OnboardingRolePage";
import { OnboardingGenrePage } from "@/components/onboarding/OnboardingGenrePage";
import { OnboardingSummaryPage } from "@/components/onboarding/OnboardingSummaryPage";
import { useOnboardingStore } from "@/components/onboarding/use-onboarding-store";

export type OnboardingFlowProps = Readonly<{
  onComplete?: () => void;
}>;

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const { step, role, genres, setStep, setRole, setGenres } =
    useOnboardingStore();

  return (
    <>
      {step === 1 && (
        <OnboardingRolePage
          onContinue={(selectedRole) => {
            setRole(selectedRole);
            setStep(2);
          }}
        />
      )}

      {step === 2 && role && (
        <OnboardingGenrePage
          role={role}
          onContinue={(selectedGenres) => {
            setGenres(selectedGenres);
            setStep(3);
          }}
          onSkip={() => {
            setGenres([]);
            setStep(3);
          }}
        />
      )}

      {step === 3 && role && (
        <OnboardingSummaryPage
          role={role}
          genres={genres}
          onBack={() => setStep(2)}
          onEditRole={() => setStep(1)}
          onEditGenres={() => setStep(2)}
          onFinish={onComplete}
        />
      )}
    </>
  );
}
