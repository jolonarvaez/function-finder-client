"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { PageContainer, PageHeader } from "@/components/reusables/PageContainer";
import { EventForm, type EventFormValues } from "./event-form/EventForm";
import {
  getEvent,
  updateEvent,
  reorderEventPerformers,
  type ApiEvent,
} from "@/lib/services/events";
import { useUserStore } from "@/components/auth/use-user-store";

type Props = Readonly<{ eventId: string }>;

export function EditEventView({ eventId }: Props) {
  const { profile } = useUserStore();
  const router = useRouter();
  const basePath = profile?.profile_type === "host" ? "/host" : "/dj";
  const [event, setEvent] = useState<ApiEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getEvent(eventId)
      .then((e) => {
        if (profile && e.created_by !== profile.id) {
          toast.error("You are not authorized to edit this event.");
          router.replace(`${basePath}/event-manager`);
          return;
        }
        setEvent(e);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [eventId, profile, router, basePath]);

  if (loading) return <EditEventSkeleton />;

  if (error || !event) {
    return (
      <PageContainer>
        <PageHeader title="Edit Event" showBack />
        <p className="mt-6 text-center text-muted-foreground">Event not found.</p>
      </PageContainer>
    );
  }

  return <EditEventContent eventId={eventId} event={event} />;
}

export function EditEventContent({ eventId, event }: { eventId: string; event: ApiEvent }) {
  const router = useRouter();
  const { profile } = useUserStore();
  const basePath = profile?.profile_type === "host" ? "/host" : "/dj";

  async function handleSubmit(values: EventFormValues) {
    const updated = await updateEvent(eventId, values);

    // The lineup order isn't part of the general event patch — persist it
    // explicitly via the dedicated reorder endpoint once we know each
    // performer's row id (including any just-added by the update above).
    if (values.event_performers.length > 1) {
      const rowIdByUserId = new Map(updated.event_performers?.map((p) => [p.user_id, p.id]));
      const orderedIds = values.event_performers
        .map((p) => rowIdByUserId.get(p.user_id))
        .filter((id): id is string => Boolean(id));
      if (orderedIds.length === updated.event_performers?.length) {
        await reorderEventPerformers(eventId, orderedIds);
      }
    }

    router.push(`${basePath}/event-manager`);
    toast.success("Event updated successfully.");
  }

  return <EventForm mode="edit" initialEvent={event} onSubmit={handleSubmit} />;
}

function EditEventSkeleton() {
  return (
    <PageContainer>
      <div className="flex flex-col gap-5 pt-2">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-11 w-full rounded-lg" />
        <Skeleton className="h-11 w-full rounded-lg" />
        <Skeleton className="mt-2 h-4 w-24" />
        <Skeleton className="h-11 w-full rounded-lg" />
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-11 rounded-lg" />
          <Skeleton className="h-11 rounded-lg" />
        </div>
        <Skeleton className="h-11 w-full rounded-lg" />
        <Skeleton className="mt-2 h-4 w-20" />
        <Skeleton className="h-40 w-full rounded-lg" />
      </div>
    </PageContainer>
  );
}
