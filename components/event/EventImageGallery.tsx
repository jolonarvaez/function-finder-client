"use client";

import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EventImage } from "@/components/dj/dj-event.types";

type GalleryEvent = {
  event_images?: EventImage[] | null;
};

type Props = Readonly<{
  event: GalleryEvent;
  alt: string;
}>;

/** Detail-page gallery: prev/next controls and a thumbnail strip. */
export function EventImageGallery({ event, alt }: Props) {
  const urls = (event.event_images ?? []).map((img) => img.url);
  const [active, setActive] = useState(0);

  if (urls.length === 0) return null;

  const safeActive = Math.min(active, urls.length - 1);
  const current = urls[safeActive];

  const goPrev = () => setActive((safeActive - 1 + urls.length) % urls.length);
  const goNext = () => setActive((safeActive + 1) % urls.length);

  return (
    <div className="space-y-2">
      <div className="relative overflow-hidden rounded-lg bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={current} alt={alt} className="w-full object-contain" />

        {safeActive === 0 && urls.length > 1 && (
          <span className="absolute left-2 top-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-foreground">
            Cover
          </span>
        )}

        {urls.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={goPrev}
              className="absolute left-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-foreground backdrop-blur-sm transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ChevronLeftIcon className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={goNext}
              className="absolute right-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-foreground backdrop-blur-sm transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ChevronRightIcon className="size-5" />
            </button>
            <span className="absolute bottom-2 right-2 rounded-full bg-background/80 px-2 py-0.5 text-xs font-medium text-foreground backdrop-blur-sm">
              {safeActive + 1} / {urls.length}
            </span>
          </>
        )}
      </div>

      {urls.length > 1 && (
        <ul className="m-0 flex list-none gap-2 overflow-x-auto p-0 pb-1">
          {urls.map((url, idx) => (
            <li key={url}>
              <button
                type="button"
                aria-label={`View image ${idx + 1}`}
                aria-current={idx === safeActive}
                onClick={() => setActive(idx)}
                className={cn(
                  "relative size-16 shrink-0 overflow-hidden rounded-md border-2 transition-colors",
                  idx === safeActive
                    ? "border-primary"
                    : "border-transparent opacity-70 hover:opacity-100"
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="size-full object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
