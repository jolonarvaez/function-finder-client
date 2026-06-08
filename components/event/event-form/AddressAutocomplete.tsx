"use client";

import { useEffect, useRef, useState } from "react";
import { MapPinIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  searchAddress,
  getPlaceDetails,
  type AddressSuggestion,
  type PlacePrediction,
} from "@/lib/services/geocode/geocode";
import { cn } from "@/lib/utils";

type Props = Readonly<{
  value: string;
  onChange: (value: string) => void;
  onSelect: (suggestion: AddressSuggestion) => void;
}>;

export function AddressAutocomplete({ value, onChange, onSelect }: Props) {
  const [suggestions, setSuggestions] = useState<PlacePrediction[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [resolving, setResolving] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skipSearchRef = useRef(false);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      if (skipSearchRef.current) {
        skipSearchRef.current = false;
        return;
      }
      if (!value.trim()) {
        setSuggestions([]);
        setOpen(false);
        return;
      }
      const results = await searchAddress(value);
      setSuggestions(results);
      setOpen(results.length > 0);
      setActiveIndex(-1);
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      void handleSelect(suggestions[activeIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  async function handleSelect(prediction: PlacePrediction) {
    setOpen(false);
    setSuggestions([]);
    skipSearchRef.current = true;
    onChange(prediction.display_name);
    setResolving(true);
    const details = await getPlaceDetails(prediction.place_id);
    setResolving(false);
    if (details) onSelect({ ...details, display_name: prediction.display_name });
  }

  return (
    <div ref={containerRef} className="relative">
      <MapPinIcon className="absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        id="address"
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search for an address"
        autoComplete="off"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-busy={resolving}
        className={cn("h-11 rounded-lg pl-10 dark:bg-card", resolving && "opacity-70")}
      />

      {open && suggestions.length > 0 && (
        <ul
          role="listbox"
          aria-live="polite"
          aria-label="Address suggestions"
          className="absolute z-50 mt-1 w-full overflow-hidden rounded-lg border border-border bg-popover shadow-lg"
        >
          {suggestions.map((s, i) => (
            <li
              key={s.place_id}
              role="option"
              aria-selected={i === activeIndex}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => void handleSelect(s)}
              className={cn(
                "flex cursor-pointer items-start gap-2.5 px-3 py-2.5 text-sm transition-colors",
                i === activeIndex ? "bg-accent" : "hover:bg-accent/60"
              )}
            >
              <MapPinIcon className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
              <span className="line-clamp-2 leading-snug text-foreground">{s.display_name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
