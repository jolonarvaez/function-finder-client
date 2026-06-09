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

export function EventsContent({ events, loading = false }: ContentProps) {
  return (
    <div>
      <div className="sticky top-0 z-20 border-b border-border bg-card px-4 py-3">
        <PageHeader title="Events" icon={PartyPopper} />
        <MobileMapFilters className="mt-2 sm:hidden" />
        <EventListFilters className="mt-2 hidden sm:flex" />
      </div>

      <PageContainer>
        <div className="space-y-3 py-4">
          {loading ? (
            <EventsSkeleton />
          ) : events.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">
              No events found for the selected filters.
            </p>
          ) : (
            events.map((event) => <EventItem key={event.id} event={event} />)
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
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-lg border border-border">
          <div className="flex">
            <div className="flex-1 space-y-3 p-4">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-2/5" />
            </div>
            <Skeleton className="w-1/2" />
          </div>
          <div className="border-t border-border p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="size-10 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
