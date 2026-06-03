"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { EventForm, type EventFormValues } from "./EventForm";
import { createEvent } from "@/lib/services/events";
import { useUserStore } from "@/components/auth/use-user-store";

export function CreateEventView() {
  const router = useRouter();
  const { profile } = useUserStore();

  async function handleSubmit(values: EventFormValues) {
    if (!profile) return;
    await createEvent({
      ...values,
      created_by: profile.id,
      location: null,
    });
    router.push("/dj/event-manager");
    toast.success("Event created successfully.");
  }

  return <EventForm mode="create" onSubmit={handleSubmit} />;
}
