"use client";
import { MapPinIcon, ClockIcon, ExternalLinkIcon } from "lucide-react";
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

function GenreBadges({ genre }: Readonly<{ genre: string[] }>) {
  return (
    <div className="flex flex-wrap gap-1">
      {genre.map((g) => (
        <Badge key={g} variant="outline" className="w-fit">
          {g}
        </Badge>
      ))}
    </div>
  );
}

function ProfileLink({ userId, className }: Readonly<{ userId?: string; className?: string }>) {
  return (
    <Link href={userId ? `/profile/${userId}` : "#"} className={cn("ml-auto shrink-0", className)}>
      <Button variant="ghost" size="icon" aria-label="View profile">
        <ExternalLinkIcon className="size-5" />
      </Button>
    </Link>
  );
}

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
          {genre && genre.length > 0 && <GenreBadges genre={genre} />}
          {setTime && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <ClockIcon className="size-3 shrink-0" />
              <span>Set: {setTime}</span>
            </div>
          )}
        </div>

        <ProfileLink userId={userId} />
      </div>
    );
  }

  return (
    <Card className={cn("@container gap-3", className)}>
      <CardContent>
        <div className="flex flex-wrap items-center gap-4">
          <Avatar size="lg" className="w-16 h-16 shrink-0">
            {avatarSrc && <AvatarImage src={avatarSrc} alt={name} />}
            <AvatarFallback>{avatarFallback ?? name[0]}</AvatarFallback>
            {isActive && <AvatarBadge />}
          </Avatar>

          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <span className="text-lg font-semibold leading-tight">{name}</span>
            {genre && genre.length > 0 && <GenreBadges genre={genre} />}
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

          <ProfileLink userId={userId} className="self-center" />
        </div>
      </CardContent>
    </Card>
  );
}
