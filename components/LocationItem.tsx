"use client";

import * as React from "react";
import { MapPinIcon, MusicIcon } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type LocationItemProps = Readonly<{
  name: string;
  address: string;
  distance: string;
  genre: string;
  imageSrc?: string;
  dj?: string;
  isLive?: boolean;
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
  className,
}: LocationItemProps) {
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

            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPinIcon className="size-3 shrink-0" />
              {address}
            </span>

            <span className="flex items-center gap-1 text-sm text-primary">
              <MusicIcon className="size-3 shrink-0" />
              {dj ? `${dj} · ${genre}` : genre}
            </span>

            {isLive && (
              <Badge variant="default" className="w-fit">
                Live
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
