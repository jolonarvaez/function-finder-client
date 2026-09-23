"use client";

import { ArrowLeftIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapLinks } from "@/components/reusables/MapLinks";
import { Persona } from "@/components/shared/Persona";
import { cn } from "@/lib/utils";
import type { EventSummaryData } from "./types";

export type EventSummaryProps = Readonly<{
  data: EventSummaryData;
  onConfirm: () => void;
  onBack: () => void;
  submitting?: boolean;
  /** Persistent failure message. Toasts vanish after a few seconds; this does not. */
  error?: string;
  confirmLabel?: string;
  busyLabel?: string;
  confirmDisabled?: boolean;
  /** Focused when the step opens, so screen readers announce the change. */
  headingRef?: React.Ref<HTMLHeadingElement>;
  className?: string;
}>;

function SummaryRow({ label, children }: Readonly<{ label: string; children: React.ReactNode }>) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}

function Value({ children }: Readonly<{ children: React.ReactNode }>) {
  return <p className="text-base font-semibold text-foreground">{children}</p>;
}

export function EventSummary({
  data,
  onConfirm,
  onBack,
  submitting = false,
  error,
  confirmLabel = "Create Event",
  busyLabel = "Creating...",
  confirmDisabled = false,
  headingRef,
  className,
}: EventSummaryProps) {
  const imageCount = data.imagePreviews.length;

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="mb-6">
        {/* Visually redundant with the page's own "Review Event" h1, so it is
            sr-only — but it still earns its place: it keeps the summary in the
            heading outline, and it is the focus target on step change. Without
            it focus falls to <body>, since the button that was focused is by
            then inside the hidden form. */}
        <h2 ref={headingRef} tabIndex={-1} className="sr-only">
          Review your event
        </h2>
        <p className="text-sm text-muted-foreground">
          Check the details below. Nothing is published until you confirm.
        </p>
      </div>

      <div className="space-y-6 rounded-2xl border border-border bg-card p-5">
        <SummaryRow label="Event Name">
          <Value>{data.name}</Value>
        </SummaryRow>

        {data.description && (
          <SummaryRow label="Description">
            <p className="whitespace-pre-wrap text-sm text-muted-foreground">{data.description}</p>
          </SummaryRow>
        )}

        {data.category && (
          <SummaryRow label="Category">
            <Badge variant="secondary" className="h-auto rounded-full px-3 py-1 text-sm">
              {data.category}
            </Badge>
          </SummaryRow>
        )}

        <SummaryRow label="Date & Time">
          <Value>{data.dateLabel}</Value>
          <p className="text-sm text-muted-foreground">
            {data.timeLabel} · {data.timezoneLabel}
          </p>
        </SummaryRow>

        <SummaryRow label="Entry">
          <Value>{data.entryLabel}</Value>
          {data.ticketLink && (
            <a
              href={data.ticketLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block truncate rounded-sm text-sm text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {data.ticketLink}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          )}
        </SummaryRow>

        {data.genres.length > 0 && (
          <SummaryRow label="Genres">
            <div className="flex flex-wrap gap-2">
              {data.genres.map((g) => (
                <Badge key={g} variant="secondary" className="h-auto rounded-full text-sm">
                  {g}
                </Badge>
              ))}
            </div>
          </SummaryRow>
        )}

        <SummaryRow label="Lineup">
          {data.performers.length === 0 ? (
            <p className="text-sm text-muted-foreground">No performers added.</p>
          ) : (
            <ul className="space-y-4 pt-1">
              {data.performers.map((p) => (
                <li key={p.id}>
                  {/* No profile link: navigating away would discard the draft. */}
                  <Persona
                    variant="min"
                    showProfileLink={false}
                    name={p.name}
                    genre={p.genres}
                    avatarSrc={p.avatarUrl}
                    avatarFallback={p.name[0]}
                    setTime={p.setTime}
                  />
                </li>
              ))}
            </ul>
          )}
        </SummaryRow>

        <SummaryRow label="Location">
          <Value>{data.address}</Value>
          <MapLinks address={data.address} className="mt-3" />
        </SummaryRow>

        {imageCount > 0 && (
          <SummaryRow label="Images">
            <ul
              className="flex gap-2 overflow-x-auto pb-1"
              aria-label={`${imageCount} image${imageCount === 1 ? "" : "s"}, first is the cover`}
            >
              {data.imagePreviews.map((src, i) => (
                <li
                  key={src}
                  className="relative size-24 shrink-0 overflow-hidden rounded-lg border border-border bg-muted"
                >
                  {/* Decorative: the count and cover are conveyed by the list label
                      and the visible chip. blob: URLs cannot use next/image. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" className="size-full object-cover" />
                  {i === 0 && (
                    <span className="absolute left-1 top-1 rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-primary-foreground">
                      Cover
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </SummaryRow>
        )}
      </div>

      <div className="sticky bottom-0 z-20 mt-8 space-y-2 border-t border-border bg-background py-3">
        {error && (
          <p
            role="alert"
            className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {error}
          </p>
        )}
        {/* type="button" with no `form` attribute: submitting the hidden form would
            trip browser validation on its display:none required fields. */}
        <Button
          type="button"
          onClick={onConfirm}
          disabled={submitting || confirmDisabled}
          className="h-12 w-full rounded-lg text-sm font-semibold"
        >
          {submitting ? busyLabel : confirmLabel}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          disabled={submitting}
          className="h-11 w-full text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeftIcon className="mr-1.5 size-4" />
          Back to form
        </Button>
      </div>
    </div>
  );
}
