"use client";

import Link from "next/link";
import { format, parseISO } from "date-fns";
import { MapPinIcon, Turntable } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar";
import { formatTime, getEventCoverOrNull } from "@/components/dj/dj-event.types";
import { getEventHost, getEventPerformers, type ApiEvent } from "@/lib/services/events";

type Props = Readonly<{ event: ApiEvent }>;

const MAX_VISIBLE_PERFORMERS = 4;

export function EventItem({ event }: Props) {
  const address = event.custom_location?.address ?? event.location ?? "Location TBA";
  const performers = getEventPerformers(event);
  const host = getEventHost(event);
  const coverUrl = getEventCoverOrNull(event);
  const startTime = formatTime(event.start_time.slice(0, 5));
  const endTime = formatTime(event.end_time.slice(0, 5));
  const isLive = event.status === "live";
  const isDone = event.status === "done";
  const isUpcoming = event.status === "upcoming";

  return (
    <div className="relative overflow-hidden rounded-lg border border-border bg-card">
      {/* Stretched card link — sits beneath all interactive children */}
      <Link
        href={`/events/${event.id}`}
        className="absolute inset-0 z-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        aria-label={event.name}
      />

      {/* Cover image — full width, clipped to the card's rounded corners */}
      {coverUrl && (
        <div className="relative aspect-16/10 w-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={coverUrl} alt={`${event.name} cover`} className="size-full object-cover" />
        </div>
      )}

      <div className="relative space-y-3 p-4">
        <div className="min-w-0 space-y-0.5">
          <div className="flex items-center gap-2">
            {isLive && (
              <span className="flex items-center gap-1.5 rounded-full bg-primary px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-primary-foreground">
                <span className="relative flex size-1.5">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary-foreground opacity-75 motion-reduce:animate-none" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-primary-foreground" />
                </span>
                Live
              </span>
            )}
            {isUpcoming && <Badge variant="secondary">Upcoming</Badge>}
            {isDone && <Badge variant="outline">Done</Badge>}
            <p className="truncate text-lg font-semibold text-foreground">{event.name}</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-foreground">
            <MapPinIcon className="size-3.5 shrink-0" />
            <span className="truncate">{address}</span>
          </div>
          {host?.profile_type === "host" && (
            <p className="truncate text-xs text-muted-foreground">
              Hosted by:{" "}
              <Link
                href={`/profile/${host.id}`}
                className="hover:underline hover:underline-offset-2 focus-visible:underline"
              >
                {host.display_name}
              </Link>
            </p>
          )}
        </div>

        {event.description && (
          <p className="line-clamp-2 text-xs text-muted-foreground">{event.description}</p>
        )}

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
          <span>{format(parseISO(event.date), "EEE, MMM d, yyyy")}</span>
          <span>
            {startTime} - {endTime}
          </span>
          {event.entry_price ? (
            <span>₱{event.entry_price.toLocaleString()}</span>
          ) : (
            <span>Free</span>
          )}
        </div>

        {event.genres.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {event.genres.map((g) => (
              <Badge key={g} variant="default">
                {g}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Lineup — full width footer */}
      <div className="relative z-10 border-t border-border px-4 pb-4 pt-3">
        {performers.length > 0 && (
          <div className="mb-3 flex flex-col gap-2">
            <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <Turntable className="size-3.5 shrink-0" />
              {isLive ? "Now Playing" : "Lineup"}
            </p>
            <div className="flex items-center gap-3">
              {performers.length > 1 ? (
                <AvatarGroup>
                  {performers.slice(0, MAX_VISIBLE_PERFORMERS).map((p) => (
                    <Avatar key={p.id} size="sm">
                      <AvatarImage
                        src={p.users.avatar_url ?? undefined}
                        alt={p.users.display_name}
                      />
                      <AvatarFallback>{p.users.display_name[0]}</AvatarFallback>
                    </Avatar>
                  ))}
                  {performers.length > MAX_VISIBLE_PERFORMERS && (
                    <AvatarGroupCount>
                      +{performers.length - MAX_VISIBLE_PERFORMERS}
                    </AvatarGroupCount>
                  )}
                </AvatarGroup>
              ) : (
                <Avatar size="sm">
                  <AvatarImage
                    src={performers[0]!.users.avatar_url ?? undefined}
                    alt={performers[0]!.users.display_name}
                  />
                  <AvatarFallback>{performers[0]!.users.display_name[0]}</AvatarFallback>
                </Avatar>
              )}
              <p className="min-w-0 truncate text-sm font-medium text-foreground">
                {performers.map((p, i) => (
                  <span key={p.id}>
                    <Link
                      href={`/profile/${p.user_id}`}
                      className="hover:underline hover:underline-offset-2 focus-visible:underline"
                    >
                      {p.users.display_name}
                    </Link>
                    {i < performers.length - 1 && ", "}
                  </span>
                ))}
              </p>
            </div>
          </div>
        )}
        <Button asChild className="w-full">
          <Link href={`/events/${event.id}`}>View details</Link>
        </Button>
      </div>
    </div>
  );
}
