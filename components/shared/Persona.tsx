"use client";
import { MapPinIcon, CalendarIcon } from "lucide-react";
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
  nextEvent?: string;
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
  nextEvent,
  variant = "full",
  className,
  userId,
}: PersonaProps) {
  if (variant === "min") {
    return (
      <div className={cn("flex items-center gap-4", className)}>
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
        </div>

        <Link href={userId ? `/profile/${userId}` : "#"} className="ml-auto">
          <Button variant="ghost" className="shrink-0 text-muted-foreground">
            View Profile →
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <Card className={cn("gap-3", className)}>
      <CardContent>
        <div className="flex items-center gap-4">
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
            {nextEvent && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <CalendarIcon className="size-3 shrink-0" />
                <span>Next: {nextEvent}</span>
              </div>
            )}
          </div>

          <Link href={userId ? `/profile/${userId}` : "#"} className="ml-auto self-center">
            <Button variant="ghost" className="shrink-0 text-muted-foreground">
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
