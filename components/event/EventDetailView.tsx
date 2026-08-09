"use client";

import { useEffect, useState } from "react";
import { MapPinIcon, CalendarIcon, ClockIcon, TicketIcon, AlignLeftIcon } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CopyLinkButton } from "@/components/reusables/CopyLinkButton";
import { Persona } from "@/components/shared/Persona";
import { PageContainer, PageHeader } from "@/components/reusables/PageContainer";
import { getEvent, getEventHost, type ApiEvent } from "@/lib/services/events";
import { formatTime } from "@/components/dj/dj-event.types";
import { useAuth } from "@/components/providers/AuthProvider";
import { EventImageGallery } from "./EventImageGallery";

type Props = Readonly<{ eventId: string }>;

export function EventDetailView({ eventId }: Props) {
  const { loading: authLoading } = useAuth();
  const [event, setEvent] = useState<ApiEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    const controller = new AbortController();
    getEvent(eventId, controller.signal)
      .then(setEvent)
      .catch((err: unknown) => {
        if ((err as { name?: string }).name !== "CanceledError") setError(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [eventId, authLoading]);

  let content: React.ReactNode;
  if (loading) {
    content = <EventDetailSkeleton />;
  } else if (error || !event) {
    content = (
      <PageContainer>
        <PageHeader title="Event" showBack />
        <p className="mt-6 text-center text-muted-foreground">Event not found.</p>
      </PageContainer>
    );
  } else {
    content = <EventDetailContent event={event} />;
  }

  return <div>{content}</div>;
}

export function EventDetailContent({ event }: Readonly<{ event: ApiEvent }>) {
  const address = event.custom_location?.address ?? event.location ?? "Location TBA";
  const startTime = formatTime(event.start_time);
  const endTime = formatTime(event.end_time);
  const performers = [...(event.event_performers ?? [])].sort(
    (a, b) => a.performance_order - b.performance_order
  );
  const host = getEventHost(event);
  const showHost = host?.profile_type === "host";

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
            <StatusBadge status={event.status} />
          </div>

          {/* Genres */}
          {event.genres.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {event.genres.map((g) => (
                <Badge key={g}>{g}</Badge>
              ))}
            </div>
          )}

          {/* Hosted by */}
          {showHost && host && (
            <div className="flex flex-col gap-3">
              <span className="text-sm font-medium text-muted-foreground">Hosted by</span>
              <Persona
                variant="min"
                name={host.display_name}
                avatarSrc={host.avatar_url ?? undefined}
                avatarFallback={host.display_name[0]}
                userId={host.id}
              />
            </div>
          )}

          {/* Copy link */}
          <CopyLinkButton text="Copy Link to Event" />

          {/* Description */}
          {event.description && (
            <Section icon={AlignLeftIcon} label="Description">
              <span className="whitespace-pre-wrap">{event.description}</span>
            </Section>
          )}

          {/* When */}
          <Section icon={CalendarIcon} label="Date">
            {format(parseISO(event.date), "EEEE, MMMM d, yyyy")}
          </Section>

          <Section icon={ClockIcon} label="Time">
            {startTime} - {endTime}
          </Section>

          {/* Where */}
          <Section icon={MapPinIcon} label="Location">
            {address}
          </Section>

          {/* Entry */}
          <Section icon={TicketIcon} label="Entry">
            {event.entry_price != null ? `₱${event.entry_price.toLocaleString()}` : "Free entry"}
          </Section>

          {/* Lineup */}
          {performers.length > 0 && (
            <div className="flex flex-col gap-3">
              <span className="text-sm font-medium text-muted-foreground">Performed by</span>
              {performers.map((p) => (
                <Persona
                  key={p.id}
                  variant="full"
                  name={p.users.display_name}
                  genre={p.users.genre_tags.length > 0 ? p.users.genre_tags : event.genres}
                  avatarSrc={p.users.avatar_url ?? undefined}
                  avatarFallback={p.users.display_name[0]}
                  userId={p.user_id}
                  setTime={formatSetTime(p.set_start_time, p.set_end_time)}
                />
              ))}
            </div>
          )}

          {/* Images */}
          <EventImageGallery event={event} alt={`${event.name} cover`} />
        </div>
      </PageContainer>
    </div>
  );
}

function formatSetTime(start?: string | null, end?: string | null): string | undefined {
  if (!start && !end) return undefined;
  return `${start ? formatTime(start) : "—"} - ${end ? formatTime(end) : "—"}`;
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

function StatusBadge({ status }: Readonly<{ status: string }>) {
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
