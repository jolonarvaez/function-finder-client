import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/** Emphasis descends with the lifecycle: filled, muted, then outline only. */
const STATUS_VARIANTS = {
  live: "default",
  upcoming: "secondary",
  done: "outline",
} as const;

export const STATUS_LABELS = {
  live: "Live",
  upcoming: "Upcoming",
  done: "Done",
} as const;

export type StatusBadgeStatus = keyof typeof STATUS_LABELS;

export type StatusBadgeProps = Readonly<{
  /** Which event status the badge describes. */
  status: StatusBadgeStatus;
  className?: string;
}>;

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge variant={STATUS_VARIANTS[status]} className={cn("w-fit", className)}>
      {STATUS_LABELS[status]}
    </Badge>
  );
}
