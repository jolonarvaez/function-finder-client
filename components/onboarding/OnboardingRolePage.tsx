"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useOnboardingStore } from "@/components/onboarding/use-onboarding-store";

export type OnboardingRole = "dj" | "event-goer";

export type OnboardingRolePageProps = Readonly<{
  onContinue?: (role: OnboardingRole) => void;
  onSkip?: () => void;
}>;

const STEP_COUNT = 3;
const CURRENT_STEP = 1;

const roles: { value: OnboardingRole; label: string; description: string }[] = [
  {
    value: "dj",
    label: "I'm a DJ",
    description: "Find gigs, promote your sets, and grow your audience.",
  },
  {
    value: "event-goer",
    label: "I'm an Event-Goer",
    description: "Discover events, follow DJs, and never miss a night out.",
  },
];

export function OnboardingRolePage({ onContinue }: OnboardingRolePageProps) {
  const storedRole = useOnboardingStore((s) => s.role);
  const [selected, setSelected] = React.useState<OnboardingRole | null>(storedRole);

  return (
    <div className="flex min-h-screen flex-col px-6 pb-10 pt-14">
      {/* Step indicator */}
      <div className="mb-8 flex items-center gap-1.5">
        {Array.from({ length: STEP_COUNT }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1 rounded-full transition-opacity",
              i < CURRENT_STEP ? "w-6 bg-primary" : "w-3 bg-muted-foreground/30",
            )}
          />
        ))}
      </div>

      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Who are you?
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This helps us show you the right content from the start.
        </p>
      </div>

      {/* Role cards */}
      <div className="flex flex-1 flex-col gap-3">
        {roles.map(({ value, label, description }) => {
          const isSelected = selected === value;
          return (
            <Button
              key={value}
              variant="outline"
              onClick={() => setSelected(value)}
              className={cn(
                "h-auto w-full flex-col items-start gap-1 rounded-xl px-5 py-4 whitespace-normal text-left ring-1 transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:opacity-80",
                isSelected
                  ? "bg-primary/10 ring-primary"
                  : "bg-card ring-foreground/10 hover:ring-foreground/20",
              )}
            >
              <span className="text-base font-semibold text-foreground">{label}</span>
              <span className="truncate w-full text-sm text-muted-foreground">{description}</span>
            </Button>
          );
        })}
      </div>

      {/* Actions */}
      <div className="mt-8 space-y-4">
        <Button
          className="h-12 w-full rounded-xl text-sm font-medium"
          disabled={selected === null}
          onClick={() => selected && onContinue?.(selected)}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
