"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useOnboardingStore } from "@/components/onboarding/use-onboarding-store";
import { StepIndicator } from "@/components/onboarding/StepIndicator";
import { CountrySelect } from "@/components/reusables/CountrySelect";

export type OnboardingProfilePageProps = Readonly<{
  onContinue?: (displayName: string, bio: string, country: string) => void;
}>;

export function OnboardingProfilePage({ onContinue }: OnboardingProfilePageProps) {
  const storedDisplayName = useOnboardingStore((s) => s.displayName);
  const storedBio = useOnboardingStore((s) => s.bio);
  const storedCountry = useOnboardingStore((s) => s.country);

  const [displayName, setDisplayName] = React.useState(storedDisplayName);
  const [bio, setBio] = React.useState(storedBio);
  const [country, setCountry] = React.useState(storedCountry);

  const canContinue = displayName.trim().length > 0;

  return (
    <div className="flex min-h-screen flex-col px-6 pb-10 pt-14">
      <StepIndicator currentStep={2} className="mb-8" />

      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Set up your profile</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Tell us a bit about yourself. Only your display name is required.
        </p>
      </div>

      {/* Fields */}
      <div className="flex flex-1 flex-col gap-5">
        <div className="space-y-2">
          <Label htmlFor="display-name" className="text-sm font-medium text-foreground">
            Display name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="display-name"
            placeholder="e.g. DJ Nova"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="h-12 rounded-xl"
            autoComplete="nickname"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio" className="text-sm font-medium text-foreground">
            Bio <span className="text-xs font-normal text-muted-foreground">(optional)</span>
          </Label>
          <Textarea
            id="bio"
            placeholder="A short bio about yourself…"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="resize-none rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="country" className="text-sm font-medium text-foreground">
            Country <span className="text-xs font-normal text-muted-foreground">(optional)</span>
          </Label>
          <CountrySelect
            id="country"
            value={country}
            onValueChange={setCountry}
            className="h-12 rounded-xl"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 space-y-4">
        <Button
          className="h-12 w-full rounded-xl text-sm font-medium"
          disabled={!canContinue}
          onClick={() => canContinue && onContinue?.(displayName.trim(), bio.trim(), country)}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
