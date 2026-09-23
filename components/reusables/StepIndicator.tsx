import { cn } from "@/lib/utils";
import { ONBOARDING_STEP_COUNT } from "@/lib/constants";

export type StepIndicatorProps = Readonly<{
  currentStep: number;
  totalSteps?: number;
  className?: string;
}>;

export function StepIndicator({
  currentStep,
  totalSteps = ONBOARDING_STEP_COUNT,
  className,
}: StepIndicatorProps) {
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
