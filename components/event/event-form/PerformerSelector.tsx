"use client";

import { useEffect, useRef, useState } from "react";
import { ClockIcon, GripVerticalIcon, SearchIcon, UserPlusIcon, XIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { searchUsers } from "@/lib/services/users";
import { cn } from "@/lib/utils";
import { useClickOutside } from "@/lib/hooks/use-click-outside";
import { toPerformer } from "./utils";
import type { Performer, PerformerProfile } from "./types";

const MIN_QUERY_LENGTH = 2;

function clearSetTimes(p: Performer): Performer {
  return { ...p, set_start_time: "", set_end_time: "" };
}

type Props = Readonly<{
  selected: Performer[];
  onChange: (performers: Performer[]) => void;
  /** Enables the "Add myself" shortcut and the "(You)" badge. */
  currentUser?: PerformerProfile | null;
  /** Injectable for Storybook; defaults to the users service. */
  search?: (query: string, signal?: AbortSignal) => Promise<PerformerProfile[]>;
}>;

export function PerformerSelector({
  selected,
  onChange,
  currentUser,
  search = searchUsers,
}: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PerformerProfile[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [searching, setSearching] = useState(false);
  // Set times only make sense for a multi-DJ lineup.
  const [withSetTimes, setWithSetTimes] = useState(() =>
    selected.some((p) => p.set_start_time || p.set_end_time)
  );
  // Drag-to-reorder: rows are only draggable while grabbed by their handle so
  // the set-time inputs keep normal text interaction.
  const [dragEnabledIndex, setDragEnabledIndex] = useState<number | null>(null);
  const [dragSourceIndex, setDragSourceIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const selectedIds = new Set(selected.map((p) => p.id));
  const options = results.filter((p) => !selectedIds.has(p.id));
  const selfSelected = currentUser ? selectedIds.has(currentUser.id) : true;
  const setTimesAllowed = selected.length >= 2;
  const showSetTimes = withSetTimes && setTimesAllowed;

  useEffect(() => {
    if (query.trim().length < MIN_QUERY_LENGTH) {
      setResults([]);
      setOpen(false);
      setSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      const controller = new AbortController();
      abortRef.current = controller;
      setSearching(true);
      try {
        const found = await search(query.trim(), controller.signal);
        if (controller.signal.aborted) return;
        setResults(found);
        setOpen(true);
        setActiveIndex(-1);
      } catch (err: unknown) {
        if ((err as { name?: string }).name === "CanceledError") return;
        setResults([]);
        setOpen(false);
      } finally {
        if (!controller.signal.aborted) setSearching(false);
      }
    }, 300);

    // Cancels both the pending debounce and any in-flight request on retype/unmount.
    return () => {
      clearTimeout(timer);
      abortRef.current?.abort();
    };
  }, [query, search]);

  useClickOutside(containerRef, () => setOpen(false), open);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, options.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && activeIndex >= 0 && options[activeIndex]) {
      e.preventDefault();
      handleAdd(options[activeIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  function handleAdd(performer: PerformerProfile) {
    onChange([...selected, toPerformer(performer)]);
    setQuery("");
    setResults([]);
    setOpen(false);
  }

  function handleRemove(performer: Performer) {
    const next = selected.filter((p) => p.id !== performer.id);
    // Dropping below two performers disables set times — clear any entered values.
    onChange(next.length < 2 ? next.map((p) => clearSetTimes(p)) : next);
  }

  function handleSetTimesToggle(checked: boolean) {
    setWithSetTimes(checked);
    if (!checked) onChange(selected.map((p) => clearSetTimes(p)));
  }

  function handleSetTimeChange(
    id: string,
    field: "set_start_time" | "set_end_time",
    value: string
  ) {
    onChange(selected.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  }

  function handleReorder(from: number, to: number) {
    if (to < 0 || to >= selected.length || from === to) return;
    const next = [...selected];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved!);
    // Set times belong to the slot, not the performer — keep the time sequence
    // anchored to positions so reordering swaps who plays each slot.
    onChange(
      next.map((p, i) => ({
        ...p,
        set_start_time: selected[i]!.set_start_time,
        set_end_time: selected[i]!.set_end_time,
      }))
    );
  }

  function endDrag() {
    setDragEnabledIndex(null);
    setDragSourceIndex(null);
    setDragOverIndex(null);
  }

  return (
    <div className="flex flex-col gap-2">
      <div ref={containerRef} className="relative">
        <SearchIcon className="absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          id="performer-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search DJs by name"
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-busy={searching}
          className="h-11 rounded-lg pl-10 pr-9 dark:bg-card"
        />
        {searching && (
          <Spinner className="absolute right-3 top-1/2 z-10 -translate-y-1/2 text-muted-foreground" />
        )}

        {open && (
          <ul
            role="listbox"
            aria-live="polite"
            aria-label="DJ search results"
            className="absolute z-50 mt-1 w-full overflow-hidden rounded-lg border border-border bg-popover shadow-lg"
          >
            {options.length === 0 ? (
              <li className="px-3 py-2.5 text-sm text-muted-foreground">No DJs found</li>
            ) : (
              options.map((p, i) => (
                <li
                  key={p.id}
                  role="option"
                  aria-selected={i === activeIndex}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleAdd(p)}
                  className={cn(
                    "flex cursor-pointer items-center gap-2.5 px-3 py-2.5 text-sm transition-colors",
                    i === activeIndex ? "bg-accent" : "hover:bg-accent/60"
                  )}
                >
                  <Avatar size="sm">
                    <AvatarImage src={p.avatar_url ?? undefined} alt="" />
                    <AvatarFallback>{p.display_name[0]?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="min-w-0 flex-1 truncate font-medium text-foreground">
                    {p.display_name}
                  </span>
                  <span className="flex shrink-0 gap-1">
                    {p.genre_tags.slice(0, 2).map((g) => (
                      <Badge key={g} variant="outline">
                        {g}
                      </Badge>
                    ))}
                  </span>
                </li>
              ))
            )}
          </ul>
        )}
      </div>

      {selected.length > 0 && (
        <>
          <div className="flex min-h-11 items-center justify-between gap-2">
            <Label
              htmlFor="set-times-toggle"
              className={cn(
                "flex items-center gap-1.5 text-sm font-normal",
                !setTimesAllowed && "text-muted-foreground"
              )}
            >
              <ClockIcon className="size-4 text-muted-foreground" />
              Add Set Times
              {!setTimesAllowed && (
                <span className="text-xs text-muted-foreground">(needs 2+ performers)</span>
              )}
            </Label>
            <Switch
              id="set-times-toggle"
              checked={showSetTimes}
              onCheckedChange={handleSetTimesToggle}
              disabled={!setTimesAllowed}
            />
          </div>

          <ul className="flex flex-col gap-2" aria-label="Selected performers">
            {selected.map((p, index) => (
              <li
                key={p.id}
                draggable={dragEnabledIndex === index}
                onDragStart={() => setDragSourceIndex(index)}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOverIndex(index);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  if (dragSourceIndex !== null && dragSourceIndex !== index) {
                    handleReorder(dragSourceIndex, index);
                  }
                  endDrag();
                }}
                onDragEnd={endDrag}
                className={cn(
                  "flex flex-col rounded-lg border border-border bg-card px-3 py-1.5",
                  dragOverIndex === index &&
                    dragSourceIndex !== null &&
                    dragSourceIndex !== index &&
                    "opacity-50 ring-2 ring-primary"
                )}
              >
                <div className="flex min-h-11 items-center gap-2.5">
                  {selected.length >= 2 && (
                    <button
                      type="button"
                      aria-label={`Reorder ${p.display_name} (position ${index + 1} of ${selected.length}, use arrow keys to move)`}
                      onMouseDown={() => setDragEnabledIndex(index)}
                      onMouseUp={() => setDragEnabledIndex(null)}
                      onKeyDown={(e) => {
                        if (e.key === "ArrowUp") {
                          e.preventDefault();
                          handleReorder(index, index - 1);
                        } else if (e.key === "ArrowDown") {
                          e.preventDefault();
                          handleReorder(index, index + 1);
                        }
                      }}
                      className="flex shrink-0 cursor-grab items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing active:text-foreground"
                    >
                      <GripVerticalIcon className="size-4" />
                    </button>
                  )}
                  <Avatar size="sm">
                    <AvatarImage src={p.avatar_url ?? undefined} alt="" />
                    <AvatarFallback>{p.display_name[0]?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
                    {p.display_name}
                  </span>
                  {p.id === currentUser?.id && <Badge variant="secondary">You</Badge>}
                  <button
                    type="button"
                    aria-label={`Remove ${p.display_name}`}
                    onClick={() => handleRemove(p)}
                    className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:text-foreground"
                  >
                    <XIcon className="size-4" />
                  </button>
                </div>

                {showSetTimes && (
                  <div className="grid grid-cols-2 gap-3 py-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-muted-foreground">Set Start</span>
                      <Input
                        type="time"
                        step={60}
                        value={p.set_start_time}
                        onChange={(e) =>
                          handleSetTimeChange(p.id, "set_start_time", e.target.value)
                        }
                        aria-label={`Set start time for ${p.display_name}`}
                        className="h-11 appearance-none rounded-lg [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-muted-foreground">Set End</span>
                      <Input
                        type="time"
                        step={60}
                        value={p.set_end_time}
                        onChange={(e) => handleSetTimeChange(p.id, "set_end_time", e.target.value)}
                        aria-label={`Set end time for ${p.display_name}`}
                        className="h-11 appearance-none rounded-lg [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                      />
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </>
      )}

      {currentUser && !selfSelected && (
        <Button
          type="button"
          variant="ghost"
          onClick={() => handleAdd(currentUser)}
          className="h-11 w-fit rounded-lg text-sm"
        >
          <UserPlusIcon className="size-4" />
          Add myself
        </Button>
      )}
    </div>
  );
}
