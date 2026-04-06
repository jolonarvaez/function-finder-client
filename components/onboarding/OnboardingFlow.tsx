"use client";

import { useState } from "react";
import { OnboardingRolePage } from "@/components/onboarding/OnboardingRolePage";
import { OnboardingGenrePage } from "@/components/onboarding/OnboardingGenrePage";
import { OnboardingSummaryPage } from "@/components/onboarding/OnboardingSummaryPage";
import { useOnboardingStore } from "@/components/onboarding/use-onboarding-store";
import { updateUser } from "@/lib/services/users";
import { supabase } from "@/lib/supabase";

export type OnboardingFlowProps = Readonly<{
  onComplete?: () => void;
}>;

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const { step, role, genres, setStep, setRole, setGenres } = useOnboardingStore();
  const [submitting, setSubmitting] = useState(false);

  async function handleFinish() {
    if (!role) return;
    setSubmitting(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;
      await updateUser(session.user.id, { profile_type: role, genre_tags: genres });
      onComplete?.();
    } finally {
      setSubmitting(false);
    }
  }

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
          onFinish={handleFinish}
          submitting={submitting}
        />
      )}
    </>
  );
}
