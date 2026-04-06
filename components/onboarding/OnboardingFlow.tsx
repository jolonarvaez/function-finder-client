"use client";

import { useState } from "react";
import { OnboardingRolePage } from "@/components/onboarding/OnboardingRolePage";
import { OnboardingProfilePage } from "@/components/onboarding/OnboardingProfilePage";
import { OnboardingGenrePage } from "@/components/onboarding/OnboardingGenrePage";
import { OnboardingSummaryPage } from "@/components/onboarding/OnboardingSummaryPage";
import { useOnboardingStore } from "@/components/onboarding/use-onboarding-store";
import { updateUser, getUser } from "@/lib/services/users";
import { useUserStore } from "@/components/auth/use-user-store";
import { supabase } from "@/lib/supabase";
import { PageContainer } from "../reusables/PageContainer";

export type OnboardingFlowProps = Readonly<{
  onComplete?: () => void;
}>;

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const {
    step,
    role,
    displayName,
    bio,
    country,
    genres,
    setStep,
    setRole,
    setProfile,
    setGenres,
    reset,
  } = useOnboardingStore();
  const { setProfile: setUserProfile } = useUserStore();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleFinish() {
    if (!role) return;
    setSubmitting(true);
    setError("");
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        setError("Session expired. Please sign in again.");
        return;
      }
      await updateUser(session.user.id, {
        profile_type: role,
        genre_tags: genres,
        display_name: displayName,
        bio: bio || null,
        country: country || null,
      });
      const updated = await getUser(session.user.id);
      setUserProfile(updated);
      reset();
      onComplete?.();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageContainer>
      {step === 1 && (
        <OnboardingRolePage
          onContinue={(selectedRole) => {
            setRole(selectedRole);
            setStep(2);
          }}
        />
      )}

      {step === 2 && (
        <OnboardingProfilePage
          onContinue={(name, userBio, userCountry) => {
            setProfile(name, userBio, userCountry);
            setStep(3);
          }}
        />
      )}

      {step === 3 && role && (
        <OnboardingGenrePage
          role={role}
          onContinue={(selectedGenres) => {
            setGenres(selectedGenres);
            setStep(4);
          }}
          onSkip={() => {
            setGenres([]);
            setStep(4);
          }}
        />
      )}

      {step === 4 && role && (
        <OnboardingSummaryPage
          role={role}
          displayName={displayName}
          bio={bio}
          country={country}
          genres={genres}
          onBack={() => setStep(3)}
          onEditRole={() => setStep(1)}
          onEditProfile={() => setStep(2)}
          onEditGenres={() => setStep(3)}
          onFinish={handleFinish}
          submitting={submitting}
          error={error}
        />
      )}
    </PageContainer>
  );
}
