"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDownIcon, CalendarDaysIcon, CalendarIcon, ListIcon } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventCard } from "./EventCard";
import { EventCalendarView } from "./EventCalendarView";
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

type EventActions = Readonly<{
  onView: (id: string) => void;
  onEdit: (id: string) => void;
}>;

function CollapsibleSection({
  label,
  events,
  empty,
  defaultOpen,
  onView,
  onEdit,
}: EventActions &
  Readonly<{ label: string; events: DJEvent[]; empty: string; defaultOpen?: boolean }>) {
  return (
    <section aria-label={`${label} events`}>
      <Collapsible defaultOpen={defaultOpen}>
        <CollapsibleTrigger className="group flex w-full items-center justify-between">
          <SectionLabel>
            {label} ({events.length})
          </SectionLabel>
          <ChevronDownIcon className="size-5 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2 space-y-3">
          {events.length === 0 ? (
            <p className="text-sm text-muted-foreground">{empty}</p>
          ) : (
            events.map((e) => (
              <EventCard
                key={e.id}
                event={e}
                onView={() => onView(e.id)}
                onEdit={() => onEdit(e.id)}
              />
            ))
          )}
        </CollapsibleContent>
      </Collapsible>
    </section>
  );
}

function EventListSections({ events, ...actions }: EventActions & { events: DJEvent[] }) {
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
    <div className="space-y-6">
      {liveEvents.length > 0 && (
        <section aria-label="Live events">
          <SectionLabel>Live</SectionLabel>
          <div className="mt-2 space-y-3">
            {liveEvents.map((e) => (
              <EventCard key={e.id} event={e} onView={() => actions.onView(e.id)} />
            ))}
          </div>
        </section>
      )}
      <CollapsibleSection
        label="Upcoming"
        events={upcomingEvents}
        empty="No upcoming events."
        defaultOpen
        {...actions}
      />
      <CollapsibleSection label="Past" events={doneEvents} empty="No past events." {...actions} />
    </div>
  );
}

export type DJEventsContentProps = EventActions &
  Readonly<{
    events: DJEvent[];
    loading?: boolean;
    defaultView?: "list" | "calendar";
  }>;

/** Display-only event manager; data and navigation are injected by {@link DJEventsView}. */
export function DJEventsContent({
  events,
  loading = false,
  defaultView = "calendar",
  onView,
  onEdit,
}: DJEventsContentProps) {
  return (
    <PageContainer>
      {/* Header */}
      <PageHeader title="My Events" icon={CalendarDaysIcon} showBack />

      <Tabs defaultValue={defaultView} className="gap-4">
        <TabsList className="h-11! w-full">
          <TabsTrigger value="calendar" className="h-full">
            <CalendarIcon />
            Calendar
          </TabsTrigger>
          <TabsTrigger value="list" className="h-full">
            <ListIcon />
            List
          </TabsTrigger>
        </TabsList>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <>
            <TabsContent value="list">
              <EventListSections events={events} onView={onView} onEdit={onEdit} />
            </TabsContent>
            <TabsContent value="calendar">
              <EventCalendarView events={events} onView={onView} onEdit={onEdit} />
            </TabsContent>
          </>
        )}
      </Tabs>
    </PageContainer>
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

  return (
    <DJEventsContent
      events={events}
      loading={loading}
      onView={(id) => router.push(`/events/${id}`)}
      onEdit={(id) => router.push(`${basePath}/edit-event/${id}`)}
    />
  );
}
