"use client";

import * as React from "react";
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { OnboardingRole } from "@/components/OnboardingRolePage";

const GENRES = [
  "House",
  "Techno",
  "Drum & Bass",
  "Hip-Hop",
  "R&B",
  "Afrobeats",
  "Dancehall",
  "Reggaeton",
  "Pop",
  "Latin",
  "Soul",
  "Disco",
] as const;

export type Genre = (typeof GENRES)[number];

export type OnboardingGenrePageProps = Readonly<{
  role: OnboardingRole;
  onBack?: () => void;
  onContinue?: (selected: Genre[]) => void;
  onSkip?: () => void;
}>;

const STEP_COUNT = 3;
const CURRENT_STEP = 2;

const copy: Record<OnboardingRole, { heading: string; description: string }> = {
  dj: {
    heading: "What do you play?",
    description: "Select the genres in your sets. We'll match you with the right venues and crowds.",
  },
  "event-goer": {
    heading: "What's your sound?",
    description: "Pick the genres you vibe with. We'll personalise your feed.",
  },
};

export function OnboardingGenrePage({ role, onBack, onContinue, onSkip }: OnboardingGenrePageProps) {
  const [selected, setSelected] = React.useState<Genre[]>([]);
  const { heading, description } = copy[role];

  const toggle = (genre: Genre) => {
    setSelected((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

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
          {heading}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </div>

      {/* Genre grid */}
      <div className="flex w-full flex-wrap gap-2.5">
        {GENRES.map((genre) => {
          const isSelected = selected.includes(genre);
          return (
            <button
              key={genre}
              type="button"
              onClick={() => toggle(genre)}
              className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:opacity-70"
            >
              <Badge
                variant={isSelected ? "default" : "secondary"}
                className={cn(
                  "h-auto cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80",
                )}
              >
                {genre}
              </Badge>
            </button>
          );
        })}
      </div>

      <div className="flex-1" />

      {/* Actions */}
      <div className="mt-8 space-y-4">
        {selected.length > 0 && (
          <p className="text-center text-xs text-muted-foreground">
            {selected.length} genre{selected.length !== 1 ? "s" : ""} selected
          </p>
        )}
        <Button
          className="h-12 w-full rounded-xl text-sm font-medium"
          disabled={selected.length === 0}
          onClick={() => onContinue?.(selected)}
        >
          Continue
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={onSkip}
          className="w-full text-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:underline active:opacity-70"
        >
          Skip for now
        </Button>
      </div>
    </div>
  );
}
