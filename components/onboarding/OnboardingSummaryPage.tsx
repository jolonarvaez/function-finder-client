"use client";

import { ArrowLeftIcon, PencilIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ROLE_LABELS, type OnboardingRole, type Genre } from "@/lib/constants";
import { StepIndicator } from "@/components/onboarding/StepIndicator";

export type OnboardingSummaryPageProps = Readonly<{
  role: OnboardingRole;
  displayName: string;
  bio: string;
  country: string;
  genres: Genre[];
  onBack?: () => void;
  onEditRole?: () => void;
  onEditProfile?: () => void;
  onEditGenres?: () => void;
  onFinish?: () => void;
  submitting?: boolean;
  error?: string;
}>;

const GENRES_HEADING: Record<OnboardingRole, string> = {
  dj: "Genres You Play",
  host: "Genres You Host",
  "event-goer": "Favourite Genres",
};

export function OnboardingSummaryPage({
  role,
  displayName,
  bio,
  country,
  genres,
  onBack,
  onEditRole,
  onEditProfile,
  onEditGenres,
  onFinish,
  submitting,
  error,
}: OnboardingSummaryPageProps) {
  return (
    <div className="flex min-h-screen flex-col px-6 pb-10 pt-14">
      <StepIndicator currentStep={4} className="mb-8" />

      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">You&apos;re all set!</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Here&apos;s a summary of your profile before we get started.
        </p>
      </div>

      {/* Summary card */}
      <div className="space-y-6 rounded-2xl border border-border bg-card p-5">
        {/* Role */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Role
            </p>
            <p className="text-base font-semibold text-foreground">{ROLE_LABELS[role]}</p>
          </div>
          <button
            type="button"
            onClick={onEditRole}
            className="rounded-md p-1.5 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:opacity-70"
            aria-label="Edit role"
          >
            <PencilIcon className="size-4" />
          </button>
        </div>

        {/* Profile */}
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1 space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Profile
            </p>
            <p className="text-base font-semibold text-foreground">{displayName}</p>
            {bio && <p className="text-sm text-muted-foreground">{bio}</p>}
            {country && <p className="text-sm text-muted-foreground">{country}</p>}
          </div>
          <button
            type="button"
            onClick={onEditProfile}
            className="ml-3 rounded-md p-1.5 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:opacity-70"
            aria-label="Edit profile"
          >
            <PencilIcon className="size-4" />
          </button>
        </div>

        {/* Genres */}
        {genres.length > 0 && (
          <div className="space-y-2.5">
            <div className="flex items-start justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {GENRES_HEADING[role]}
              </p>
              <button
                type="button"
                onClick={onEditGenres}
                className="rounded-md p-1.5 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:opacity-70"
                aria-label="Edit genres"
              >
                <PencilIcon className="size-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => (
                <Badge
                  key={genre}
                  variant="secondary"
                  className="h-auto rounded-full px-3 py-1 text-sm"
                >
                  {genre}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex-1" />

      <div className="mt-8 space-y-4">
        {error && (
          <p
            role="alert"
            className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {error}
          </p>
        )}
        <Button
          className="h-12 w-full rounded-xl text-sm font-medium"
          onClick={onFinish}
          disabled={submitting}
        >
          {submitting ? "Saving..." : "Get Started"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          className="w-full text-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:underline active:opacity-70"
        >
          <ArrowLeftIcon className="mr-1.5 size-4" />
          Back
        </Button>
      </div>
    </div>
  );
}
