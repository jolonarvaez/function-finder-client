import { cn } from "@/lib/utils";

export type StepIndicatorProps = Readonly<{
  /** 1-based position of the active step. */
  currentStep: number;
  totalSteps: number;
  className?: string;
}>;

/**
 * Decorative step dots. Shared across multi-step flows, so `totalSteps` is
 * explicit rather than defaulting to any one flow's constant. Callers should
 * pair it with a text caption — the dots carry no accessible name of their own.
 */
export function StepIndicator({ currentStep, totalSteps, className }: StepIndicatorProps) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      {Array.from({ length: totalSteps }, (_, i) => (
        <div
          key={i}
          className={cn(
            "h-1 rounded-full transition-opacity",
            i < currentStep ? "w-6 bg-primary" : "w-3 bg-muted-foreground/30"
          )}
        />
      ))}
    </div>
  );
}
