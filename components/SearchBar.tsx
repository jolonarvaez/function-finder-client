"use client";

import * as React from "react";
import { SearchIcon, SlidersHorizontalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GenreSelector } from "@/components/GenreSelector";
import { useMapFilterStore } from "@/components/map/use-map-filter-store";
import { cn } from "@/lib/utils";

export type SearchBarProps = Readonly<{
  showFilter?: boolean;
  className?: string;
}>;

export function SearchBar({
  showFilter = false,
  className,
}: SearchBarProps) {
  const [filterOpen, setFilterOpen] = React.useState(showFilter);
  const { selectedGenres, query, setSelectedGenres, setQuery } = useMapFilterStore();

  return (
    <div className={cn("space-y-3", className)}>
      <div className="relative flex items-center">
        <SearchIcon
          size={15}
          className="pointer-events-none absolute left-3 text-muted-foreground"
        />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search venues, genres, and DJs..."
          className="h-10 border-border bg-muted/40 pl-9 pr-10 text-sm"
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setFilterOpen((prev: boolean) => !prev)}
          className={cn("absolute right-1 size-8")}
        >
          <SlidersHorizontalIcon size={15} />
        </Button>
      </div>

      {filterOpen && (
        <GenreSelector selected={selectedGenres} onChange={setSelectedGenres} />
      )}
    </div>
  );
}
