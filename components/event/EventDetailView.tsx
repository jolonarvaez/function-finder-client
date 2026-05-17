"use client";

import { useEffect, useState } from "react";
import { MapPinIcon, CalendarIcon, ClockIcon, TicketIcon } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Persona } from "@/components/Persona";
import { PageContainer, PageHeader } from "@/components/reusables/PageContainer";
import { getEvent, getEventStatus, formatTime, type ApiEvent } from "@/lib/services/events";
import type { Genre } from "@/lib/constants";

type Props = Readonly<{ eventId: string }>;

export function EventDetailView({ eventId }: Props) {
  const [event, setEvent] = useState<ApiEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getEvent(eventId)
      .then(setEvent)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [eventId]);

  return (
    <div>
      {loading ? (
        <EventDetailSkeleton />
      ) : error || !event ? (
        <PageContainer>
          <PageHeader title="Event" showBack />
          <p className="mt-6 text-center text-muted-foreground">Event not found.</p>
        </PageContainer>
      ) : (
        <EventDetailContent event={event} />
      )}
    </div>
  );
}

export function EventDetailContent({ event }: { event: ApiEvent }) {
  const status = getEventStatus(event);
  const address = event.custom_location?.address ?? event.location ?? "Location TBA";
  const startTime = formatTime(event.start_time.slice(0, 5));
  const endTime = formatTime(event.end_time.slice(0, 5));
  const djName = event.users.display_name;
  const djGenres =
    (event.genres as Genre[]).length > 0
      ? (event.genres as Genre[])
      : (event.users.genre_tags as Genre[]);

  return (
    <div>
      <PageContainer>
        <PageHeader title={event.name} showBack />

        <div className="flex flex-col gap-5">
          {/* Category + status */}
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="w-fit capitalize">
              {event.category}
            </Badge>
            <StatusBadge status={status} />
          </div>

          {/* When */}
          <Section icon={CalendarIcon} label="Date">
            {format(parseISO(event.date), "EEEE, MMMM d, yyyy")}
          </Section>

          <Section icon={ClockIcon} label="Time">
            {startTime} – {endTime}
          </Section>

          {/* Where */}
          <Section icon={MapPinIcon} label="Location">
            {address}
          </Section>

          {/* Entry */}
          <Section icon={TicketIcon} label="Entry">
            {event.entry_price != null ? `₱${event.entry_price.toLocaleString()}` : "Free entry"}
          </Section>

          {/* Genres */}
          {event.genres.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {event.genres.map((g) => (
                <Badge key={g} variant="outline">
                  {g}
                </Badge>
              ))}
            </div>
          )}

          {/* DJ */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-muted-foreground">Performed by</span>
            <Persona
              variant="full"
              name={djName}
              genre={djGenres.length > 0 ? djGenres : ["—"]}
              avatarSrc={event.users.avatar_url ?? undefined}
              avatarFallback={djName[0]}
              userId={event.created_by}
            />
          </div>

          {/* Flyer */}
          {event.flyer_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={event.flyer_url}
              alt={`${event.name} flyer`}
              className="w-full rounded-lg object-contain"
            />
          )}
        </div>
      </PageContainer>
    </div>
  );
}

function Section({
  icon: Icon,
  label,
  children,
}: Readonly<{ icon: React.ElementType; label: string; children: React.ReactNode }>) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
      <div className="flex flex-col gap-0.5">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-sm font-medium text-foreground">{children}</span>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "live") {
    return <Badge className="bg-primary text-primary-foreground">Live Now</Badge>;
  }
  if (status === "upcoming") {
    return <Badge variant="secondary">Upcoming</Badge>;
  }
  return (
    <Badge variant="outline" className="text-muted-foreground">
      Past
    </Badge>
  );
}

function EventDetailSkeleton() {
  return (
    <div>
      <Skeleton className="h-56 w-full rounded-none" />
      <PageContainer>
        <div className="flex flex-col gap-5 pt-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-4 w-56" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>
      </PageContainer>
    </div>
  );
}
