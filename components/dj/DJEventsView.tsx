"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDownIcon, CalendarDaysIcon } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Skeleton } from "@/components/ui/skeleton";
import { EventCard } from "./EventCard";
import { getStatus, type DJEvent } from "./dj-event.types";
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

  const liveEvents = events.filter((e) => getStatus(e) === "live");
  const upcomingEvents = events
    .filter((e) => getStatus(e) === "upcoming")
    .sort((a, b) =>
      a.date === b.date ? a.startTime.localeCompare(b.startTime) : a.date.localeCompare(b.date)
    );
  const pastEvents = events
    .filter((e) => getStatus(e) === "past")
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
        {/* ── Live Now ──────────────────────────────── */}
        {liveEvents.length > 0 && (
          <section aria-label="Live events">
            <SectionLabel>Live Now</SectionLabel>
            <div className="mt-2 space-y-3">
              {liveEvents.map((e) => (
                <EventCard
                  key={e.id}
                  event={e}
                  status="live"
                  onView={() => router.push(`/events/${e.id}`)}
                />
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
                    status="upcoming"
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
              <SectionLabel>Past ({pastEvents.length})</SectionLabel>
              <ChevronDownIcon className="size-5 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 space-y-3">
              {pastEvents.length === 0 ? (
                <p className="text-sm text-muted-foreground">No past events.</p>
              ) : (
                pastEvents.map((e) => (
                  <EventCard
                    key={e.id}
                    event={e}
                    status="past"
                    onView={() => router.push(`/events/${e.id}`)}
                  />
                ))
              )}
            </CollapsibleContent>
          </Collapsible>
        </section>
      </div>
    </PageContainer>
  );
}
