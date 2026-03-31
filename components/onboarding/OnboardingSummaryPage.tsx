"use client";

import { ArrowLeftIcon, PencilIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { OnboardingRole } from "@/components/onboarding/OnboardingRolePage";
import type { Genre } from "@/components/onboarding/OnboardingGenrePage";

export type OnboardingSummaryPageProps = Readonly<{
  role: OnboardingRole;
  genres: Genre[];
  onBack?: () => void;
  onEditRole?: () => void;
  onEditGenres?: () => void;
  onFinish?: () => void;
}>;

const STEP_COUNT = 3;
const CURRENT_STEP = 3;

const roleLabel: Record<OnboardingRole, string> = {
  dj: "DJ",
  "event-goer": "Event-Goer",
};

export function OnboardingSummaryPage({ role, genres, onBack, onEditRole, onEditGenres, onFinish }: OnboardingSummaryPageProps) {
  return (
    <div className="flex min-h-screen flex-col px-6 pb-10 pt-14">
      {/* Step indicator */}
      <div className="mb-8 flex items-center gap-1.5">
        {Array.from({ length: STEP_COUNT }, (_, i) => i).map((step) => (
          <div
            key={step}
            className={cn(
              "h-1 rounded-full transition-opacity",
              step < CURRENT_STEP ? "w-6 bg-primary" : "w-3 bg-muted-foreground/30",
            )}
          />
        ))}
      </div>

      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          You&apos;re all set!
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Here&apos;s a summary of your profile before we get started.
        </p>
      </div>

      {/* Summary card */}
      <div className="space-y-6 rounded-2xl border border-border bg-card p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Role</p>
            <p className="text-base font-semibold text-foreground">{roleLabel[role]}</p>
          </div>
          <button
            type="button"
            onClick={onEditRole}
            className="rounded-md p-1.5 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:opacity-70"
          >
            <PencilIcon className="size-4" />
          </button>
        </div>

        {genres.length > 0 && (
          <div className="space-y-2.5">
            <div className="flex items-start justify-between">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {role === "dj" ? "Genres You Play" : "Favourite Genres"}
              </p>
              <button
                type="button"
                onClick={onEditGenres}
                className="rounded-md p-1.5 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:opacity-70"
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
        <Button
          className="h-12 w-full rounded-xl text-sm font-medium"
          onClick={onFinish}
        >
          Get Started
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
