"use client";

import { useRouter } from "next/navigation";
import { EventCard } from "@/components/dj/EventCard";
import type { DJEvent } from "@/components/dj/dj-event.types";

type PublicLiveEventsProps = Readonly<{
  events: DJEvent[];
}>;

export function PublicLiveEvents({ events }: PublicLiveEventsProps) {
  const router = useRouter();

  if (events.length === 0) return null;

  return (
    <section aria-labelledby="live-events-heading" className="space-y-3">
      <h2 id="live-events-heading" className="text-base font-semibold text-foreground">
        Live Now
      </h2>
      <div className="space-y-3">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            status="live"
            onView={() => router.push(`/events/${event.id}`)}
          />
        ))}
      </div>
    </section>
  );
}
