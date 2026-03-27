"use client";

import { XIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export const GENRES = [
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

export type GenreSelectorProps = Readonly<{
  selected?: Genre[];
  onChange?: (selected: Genre[]) => void;
  className?: string;
}>;

export function GenreSelector({
  selected = [],
  onChange,
  className,
}: GenreSelectorProps) {
  const toggle = (genre: Genre) => {
    const next = selected.includes(genre)
      ? selected.filter((g) => g !== genre)
      : [...selected, genre];
    onChange?.(next);
  };

  const clearAll = () => onChange?.([]);

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <span className="text-lg font-medium text-foreground">Genres</span>
        {selected.length > 0 && (
          <Button
            variant="ghost"
            onClick={clearAll}
            className="h-auto gap-1 px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <XIcon />
            Clear all
          </Button>
        )}
      </div>

      <ScrollArea className="w-full">
        <div className="flex gap-2 pb-3">
          {GENRES.map((genre) => {
            const isSelected = selected.includes(genre);
            return (
              <button
                key={genre}
                type="button"
                onClick={() => toggle(genre)}
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
                  {genre}
                </Badge>
              </button>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {selected.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {selected.length} genre{selected.length !== 1 ? "s" : ""} selected
        </p>
      )}
    </div>
  );
}
