"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDownIcon, CalendarDaysIcon } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Skeleton } from "@/components/ui/skeleton";
import { EventCard } from "./EventCard";
import { type DJEvent } from "./dj-event.types";
import { getUserEvents } from "@/lib/services/users";
import { useUserStore } from "@/components/auth/use-user-store";
import { PageContainer, PageHeader } from "../reusables/PageContainer";

export type { DJEvent };

function SectionLabel({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">{children}</p>
  );
}

export function DJEventsView() {
  const { profile } = useUserStore();
  const router = useRouter();
  const basePath = profile?.profile_type === "host" ? "/host" : "/dj";
  const [events, setEvents] = useState<DJEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;
    getUserEvents(profile.id)
      .then(setEvents)
      .finally(() => setLoading(false));
  }, [profile]);

  const liveEvents = events.filter((e) => e.status === "live");
  const upcomingEvents = events
    .filter((e) => e.status === "upcoming")
    .sort((a, b) =>
      a.date === b.date ? a.startTime.localeCompare(b.startTime) : a.date.localeCompare(b.date)
    );
  const doneEvents = events
    .filter((e) => e.status === "done")
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <PageContainer>
      {/* Header */}
      <PageHeader title="My Events" icon={CalendarDaysIcon} showBack />

      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      )}

      <div className="space-y-6">
        {/* ── Live ──────────────────────────────────── */}
        {liveEvents.length > 0 && (
          <section aria-label="Live events">
            <SectionLabel>Live</SectionLabel>
            <div className="mt-2 space-y-3">
              {liveEvents.map((e) => (
                <EventCard key={e.id} event={e} onView={() => router.push(`/events/${e.id}`)} />
              ))}
            </div>
          </section>
        )}

        {/* ── Upcoming ──────────────────────────────── */}
        <section aria-label="Upcoming events">
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="group flex w-full items-center justify-between">
              <SectionLabel>Upcoming ({upcomingEvents.length})</SectionLabel>
              <ChevronDownIcon className="size-5 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 space-y-3">
              {upcomingEvents.length === 0 ? (
                <p className="text-sm text-muted-foreground">No upcoming events.</p>
              ) : (
                upcomingEvents.map((e) => (
                  <EventCard
                    key={e.id}
                    event={e}
                    onView={() => router.push(`/events/${e.id}`)}
                    onEdit={() => router.push(`${basePath}/edit-event/${e.id}`)}
                  />
                ))
              )}
            </CollapsibleContent>
          </Collapsible>
        </section>

        {/* ── Past ──────────────────────────────────── */}
        <section aria-label="Past events">
          <Collapsible>
            <CollapsibleTrigger className="group flex w-full items-center justify-between">
              <SectionLabel>Past ({doneEvents.length})</SectionLabel>
              <ChevronDownIcon className="size-5 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 space-y-3">
              {doneEvents.length === 0 ? (
                <p className="text-sm text-muted-foreground">No past events.</p>
              ) : (
                doneEvents.map((e) => (
                  <EventCard key={e.id} event={e} onView={() => router.push(`/events/${e.id}`)} />
                ))
              )}
            </CollapsibleContent>
          </Collapsible>
        </section>
      </div>
    </PageContainer>
  );
}
