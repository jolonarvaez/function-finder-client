"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PageContainer, PageHeader } from "@/components/reusables/PageContainer";
import { getUser, getUserEvents, type UserProfile } from "@/lib/services/users";
import { getStatus, type DJEvent } from "@/components/dj/dj-event.types";
import { PublicProfileHeader } from "./PublicProfileHeader";
import { PublicUpcomingEvents } from "./PublicUpcomingEvents";

type ProfileViewProps = Readonly<{
  userId: string;
}>;

export function ProfileView({ userId }: ProfileViewProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [upcomingEvents, setUpcomingEvents] = useState<DJEvent[]>([]);

  useEffect(() => {
    Promise.all([getUser(userId), getUserEvents(userId)])
      .then(([fetchedProfile, events]) => {
        setProfile(fetchedProfile);
        const upcoming = events
          .filter((e) => getStatus(e) === "upcoming")
          .sort((a, b) =>
            a.date === b.date
              ? a.startTime.localeCompare(b.startTime)
              : a.date.localeCompare(b.date)
          );
        setUpcomingEvents(upcoming);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return (
      <PageContainer>
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <Skeleton className="size-14 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-36 rounded-lg" />
              <Skeleton className="h-3 w-20 rounded-lg" />
            </div>
          </div>
          <div className="h-px bg-border" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-28 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </PageContainer>
    );
  }

  if (error || !profile) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <p className="text-base font-semibold text-foreground">Profile not found</p>
          <p className="text-sm text-muted-foreground">
            This user doesn&apos;t exist or is unavailable.
          </p>
          <Button
            variant="outline"
            className="mt-2 h-10 rounded-lg text-sm"
            onClick={() => router.back()}
          >
            Go back
          </Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader title="Profile" showBack />
      <div className="flex flex-col gap-6">
        <PublicProfileHeader profile={profile} />
        <div className="h-px bg-border" />
        <PublicUpcomingEvents events={upcomingEvents} displayName={profile.display_name} />
      </div>
    </PageContainer>
  );
}
