"use client";

import * as React from "react";
import { MapPinIcon } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type LocationItemProps = Readonly<{
  name: string;
  address: string;
  distance: string;
  genre: string | string[];
  imageSrc?: string;
  dj?: string;
  isLive?: boolean;
  onGoNow?: () => void;
  className?: string;
}>;

export function LocationItem({
  name,
  address,
  distance,
  genre,
  imageSrc,
  dj,
  isLive = false,
  onGoNow,
  className,
}: LocationItemProps) {
  const genres = Array.isArray(genre) ? genre : [genre];

  return (
    <Card className={cn("gap-3", className)}>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-start gap-3">
          {/* Thumbnail */}
          {imageSrc && (
            <div className="relative size-24 shrink-0 overflow-hidden rounded-lg bg-muted">
              <Image
                src={imageSrc}
                alt={name}
                fill
                className="object-cover"
              />
              {isLive && (
                <div className="absolute top-1.5 left-1.5">
                  <Badge variant="default" className="h-auto px-2.5 py-0.5 text-xs">
                    Live
                  </Badge>
                </div>
              )}
            </div>
          )}

          {/* Info */}
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <div className="flex items-start justify-between gap-2">
              <span className="text-base font-semibold leading-tight">
                {name}
              </span>
              <span className="shrink-0 text-sm text-muted-foreground">
                {distance}
              </span>
            </div>

            {dj && (
              <span className="text-sm text-primary">
                {dj}
              </span>
            )}

            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPinIcon className="size-3 shrink-0" />
              {address}
            </span>

            <div className="flex flex-wrap gap-1">
              {genres.map((g) => (
                <Badge key={g} variant="outline" className="h-auto px-2.5 py-0.5 text-xs">
                  {g}
                </Badge>
              ))}
            </div>

          </div>
        </div>

        {onGoNow && (
          <Button size="sm" className="w-full" onClick={onGoNow}>
            Go Now
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
