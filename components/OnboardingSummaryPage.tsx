"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { OnboardingRole } from "@/components/OnboardingRolePage";
import type { Genre } from "@/components/OnboardingGenrePage";

export type OnboardingSummaryPageProps = Readonly<{
  role: OnboardingRole;
  genres: Genre[];
  onFinish?: () => void;
}>;

const STEP_COUNT = 3;
const CURRENT_STEP = 3;

const roleLabel: Record<OnboardingRole, string> = {
  dj: "DJ",
  "event-goer": "Event-Goer",
};

export function OnboardingSummaryPage({ role, genres, onFinish }: OnboardingSummaryPageProps) {
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
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Role</p>
          <p className="text-base font-semibold text-foreground">{roleLabel[role]}</p>
        </div>

        {genres.length > 0 && (
          <div className="space-y-2.5">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {role === "dj" ? "Genres You Play" : "Favourite Genres"}
            </p>
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

      <div className="mt-8">
        <Button
          className="h-12 w-full rounded-xl text-sm font-medium"
          onClick={onFinish}
        >
          Get Started
        </Button>
      </div>
    </div>
  );
}
