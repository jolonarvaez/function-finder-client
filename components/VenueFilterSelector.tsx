"use client";

import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  VENUE_FILTERS,
  VENUE_FILTER_LABELS,
  type VenueFilter,
} from "@/lib/constants";

export type VenueFilterSelectorProps = Readonly<{
  selected: VenueFilter;
  onChange?: (filter: VenueFilter) => void;
  className?: string;
}>;

export function VenueFilterSelector({
  selected,
  onChange,
  className,
}: VenueFilterSelectorProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <span className="text-md font-medium text-foreground">Status</span>
      <ScrollArea className="w-full">
      <div className="flex flex-wrap gap-2 py-3">
        {VENUE_FILTERS.map((filter) => {
          const isSelected = filter === selected;
          return (
            <button
              key={filter}
              type="button"
              onClick={() => onChange?.(filter)}
              className="shrink-0 rounded-4xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
            >
              <Badge
                variant={isSelected ? "default" : "secondary"}
                className={cn(
                  "cursor-pointer px-4 py-1 text-xs transition-opacity h-auto",
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted",
                )}
              >
                {VENUE_FILTER_LABELS[filter]}
              </Badge>
            </button>
          );
        })}
      </div>
      <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  );
}
