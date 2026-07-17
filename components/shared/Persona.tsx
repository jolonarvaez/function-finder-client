"use client";
import { MapPinIcon, ClockIcon } from "lucide-react";
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";

export type PersonaProps = Readonly<{
  name: string;
  genre?: string[];
  avatarSrc?: string;
  avatarFallback?: string;
  isActive?: boolean;
  venue?: string;
  setTime?: string;
  variant?: "full" | "min";
  className?: string;
  userId?: string;
}>;

export function Persona({
  name,
  genre,
  avatarSrc,
  avatarFallback,
  isActive,
  venue,
  setTime,
  variant = "full",
  className,
  userId,
}: PersonaProps) {
  if (variant === "min") {
    return (
      <div className={cn("@container flex flex-wrap items-center gap-4", className)}>
        <Avatar size="lg">
          {avatarSrc && <AvatarImage src={avatarSrc} alt={name} />}
          <AvatarFallback>{avatarFallback ?? name[0]}</AvatarFallback>
          {isActive && <AvatarBadge />}
        </Avatar>

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="truncate text-md font-semibold">{name}</span>
          {genre && genre.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {genre.map((g) => (
                <Badge key={g} variant="outline" className="w-fit">
                  {g}
                </Badge>
              ))}
            </div>
          )}
          {setTime && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <ClockIcon className="size-3 shrink-0" />
              <span>Set: {setTime}</span>
            </div>
          )}
        </div>

        <Link
          href={userId ? `/profile/${userId}` : "#"}
          className="ml-auto @max-sm:ml-0 @max-sm:basis-full"
        >
          <Button variant="ghost" className="shrink-0 text-muted-foreground @max-sm:w-full">
            View Profile →
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <Card className={cn("@container gap-3", className)}>
      <CardContent>
        <div className="flex flex-wrap items-center gap-4">
          <Avatar size="lg" className="w-16 h-16">
            {avatarSrc && <AvatarImage src={avatarSrc} alt={name} />}
            <AvatarFallback>{avatarFallback ?? name[0]}</AvatarFallback>
            {isActive && <AvatarBadge />}
          </Avatar>

          <div className="flex flex-col gap-2">
            <span className="text-lg font-semibold leading-tight">{name}</span>
            {genre && genre.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {genre.map((g) => (
                  <Badge key={g} variant="outline" className="w-fit">
                    {g}
                  </Badge>
                ))}
              </div>
            )}
            {venue && (
              <Badge variant="default" className="w-fit">
                <MapPinIcon />
                {venue}
              </Badge>
            )}
            {setTime && (
              <div className="flex items-center gap-1 text-sm text-foreground">
                <ClockIcon className="size-3.5 shrink-0" />
                <span> {setTime}</span>
              </div>
            )}
          </div>

          <Link
            href={userId ? `/profile/${userId}` : "#"}
            className="ml-auto self-center @max-sm:ml-0 @max-sm:basis-full"
          >
            <Button variant="ghost" className="shrink-0 text-muted-foreground @max-sm:w-full">
              View Profile →
            </Button>
          </Link>
        </div>

        {/* <div className="flex flex-col gap-1.5">

          </div> */}
      </CardContent>
    </Card>
  );
}
