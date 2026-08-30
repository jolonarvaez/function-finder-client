"use client";

import { useEffect, useState } from "react";
import { PartyPopper } from "lucide-react";
import { EventItem } from "@/components/event/EventItem";
import { EventListFilters } from "@/components/event/EventListFilters";
import { MobileMapFilters } from "@/components/map/MobileMapFilters";
import { useMapFilterStore } from "@/components/map/use-map-filter-store";
import { PageContainer, PageHeader } from "@/components/reusables/PageContainer";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/components/providers/AuthProvider";
import { useUserStore } from "@/components/auth/use-user-store";
import { getEventsList } from "@/lib/services/events";
import type { ApiEvent } from "@/lib/services/events";

// ── Display-only content (used by Storybook) ─────────────────

type ContentProps = Readonly<{
  events: ApiEvent[];
  loading?: boolean;
}>;

// One column on mobile, two on tablet and bigger.
const EVENT_GRID = "grid grid-cols-1 gap-4 sm:grid-cols-2";

// Keeps the sticky header's contents aligned with the grid below it.
const CONTENT_WIDTH = "mx-auto w-full max-w-6xl";

export function EventsContent({ events, loading = false }: ContentProps) {
  return (
    <div>
      <div className="sticky top-0 z-20 border-b border-border bg-card px-4 py-3">
        <div className={CONTENT_WIDTH}>
          <PageHeader title="Events" icon={PartyPopper} />
          <MobileMapFilters className="mt-2 sm:hidden" />
          <EventListFilters className="mt-2 hidden sm:flex" />
        </div>
      </div>

      <PageContainer className="max-w-6xl">
        <div className="py-4">
          {loading ? (
            <div className={EVENT_GRID}>
              <EventsSkeleton />
            </div>
          ) : events.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">
              No events found for the selected filters.
            </p>
          ) : (
            <div className={EVENT_GRID}>
              {events.map((event) => (
                <EventItem key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </PageContainer>
    </div>
  );
}

// ── Data-fetching view ────────────────────────────────────────

export function EventsView() {
  const selectedGenres = useMapFilterStore((s) => s.selectedGenres);
  const eventStatus = useMapFilterStore((s) => s.eventStatus);
  const startDate = useMapFilterStore((s) => s.startDate);
  const endDate = useMapFilterStore((s) => s.endDate);
  const setSelectedGenres = useMapFilterStore((s) => s.setSelectedGenres);
  const profile = useUserStore((s) => s.profile);
  const profileLoading = useUserStore((s) => s.loading);
  const { loading: authLoading } = useAuth();

  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // Seed genres from profile on first load if user hasn't filtered yet
  useEffect(() => {
    if (profile?.genre_tags?.length && selectedGenres.length === 0) {
      setSelectedGenres(profile.genre_tags);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  useEffect(() => {
    if (!startDate || authLoading || profileLoading) return;
    setLoading(true);
    getEventsList({
      startDate,
      endDate,
      genres: selectedGenres.length > 0 ? selectedGenres : undefined,
      status: eventStatus,
    })
      .then((data) => {
        const now = Date.now();
        setEvents(
          data.sort(
            (a, b) =>
              Math.abs(new Date(a.date).getTime() - now) -
              Math.abs(new Date(b.date).getTime() - now)
          )
        );
      })
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, [startDate, endDate, selectedGenres, eventStatus, authLoading, profileLoading]);

  return <EventsContent events={events} loading={loading} />;
}

// ── Skeleton ──────────────────────────────────────────────────

function EventsSkeleton() {
  // Mirrors EventItem's shape (cover → body → lineup footer) so the grid
  // doesn't reflow when the real cards arrive. Six fills whole rows at every
  // breakpoint (1, 2 and 3 columns).
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex flex-col overflow-hidden rounded-lg border border-border">
          <Skeleton className="aspect-21/9 w-full rounded-none" />
          <div className="flex-1 space-y-3 p-4">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-2/5" />
          </div>
          <div className="border-t border-border px-4 pb-4 pt-3">
            <div className="mb-3 flex items-center gap-3">
              <Skeleton className="size-8 rounded-full" />
              <Skeleton className="h-4 w-1/3" />
            </div>
            <Skeleton className="h-9 w-full rounded-md" />
          </div>
        </div>
      ))}
    </>
  );
}
