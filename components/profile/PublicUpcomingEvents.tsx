"use client";

import { EventCard } from "@/components/dj/EventCard";
import type { DJEvent } from "@/components/dj/dj-event.types";

type PublicUpcomingEventsProps = Readonly<{
  events: DJEvent[];
  displayName: string;
}>;

export function PublicUpcomingEvents({ events, displayName }: PublicUpcomingEventsProps) {
  return (
    <section aria-labelledby="upcoming-events-heading" className="space-y-3">
      <h2 id="upcoming-events-heading" className="text-base font-semibold text-foreground">
        Upcoming Events
      </h2>
      {events.length === 0 ? (
        <p className="text-sm text-muted-foreground">{displayName} has no upcoming events.</p>
      ) : (
        <div className="space-y-3">
          {events.map((event) => (
            <EventCard key={event.id} event={event} status="upcoming" />
          ))}
        </div>
      )}
    </section>
  );
}
