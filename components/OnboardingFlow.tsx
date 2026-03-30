"use client";

import * as React from "react";
import { OnboardingRolePage } from "@/components/OnboardingRolePage";
import type { OnboardingRole } from "@/components/OnboardingRolePage";
import { OnboardingGenrePage } from "@/components/OnboardingGenrePage";
import type { Genre } from "@/components/OnboardingGenrePage";
import { OnboardingSummaryPage } from "@/components/OnboardingSummaryPage";

export type OnboardingFlowProps = Readonly<{
  onComplete?: () => void;
}>;

type Step = 1 | 2 | 3;

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = React.useState<Step>(1);
  const [role, setRole] = React.useState<OnboardingRole | null>(null);
  const [genres, setGenres] = React.useState<Genre[]>([]);

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
          onBack={() => setStep(1)}
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
          onFinish={onComplete}
        />
      )}
    </>
  );
}
