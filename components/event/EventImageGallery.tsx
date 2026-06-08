"use client";

import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { EventImage } from "@/components/dj/dj-event.types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

type GalleryEvent = {
  event_images?: EventImage[] | null;
};

type Props = Readonly<{
  event: GalleryEvent;
  alt: string;
}>;

/** Detail-page gallery: Embla-powered carousel with a thumbnail strip. */
export function EventImageGallery({ event, alt }: Props) {
  const urls = (event.event_images ?? []).map((img) => img.url);
  const [api, setApi] = useState<CarouselApi>();
  const [active, setActive] = useState(0);

  const onSelect = useCallback((api: CarouselApi) => {
    if (!api) return;
    setActive(api.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!api) return;
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api, onSelect]);

  if (urls.length === 0) return null;

  return (
    <div className="space-y-2">
      <Carousel setApi={setApi} opts={{ loop: false }}>
        <CarouselContent>
          {urls.map((url, idx) => (
            <CarouselItem key={url}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={idx === 0 ? alt : ""}
                className="w-full rounded-lg object-contain"
              />
            </CarouselItem>
          ))}
        </CarouselContent>

        {urls.length > 1 && (
          <>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </>
        )}
      </Carousel>

      {urls.length > 1 && (
        <ul className="m-0 flex list-none gap-2 overflow-x-auto p-0 pb-1">
          {urls.map((url, idx) => (
            <li key={url}>
              <button
                type="button"
                aria-label={`View image ${idx + 1}`}
                aria-current={idx === active}
                onClick={() => api?.scrollTo(idx)}
                className={cn(
                  "relative size-16 shrink-0 overflow-hidden rounded-md border-2 transition-colors",
                  idx === active
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
