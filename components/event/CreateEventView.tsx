"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { EventForm, type EventFormValues } from "./event-form/EventForm";
import { addEventImages, createEvent, EventImageError } from "@/lib/services/events";
import { uploadEventImages } from "@/lib/services/storage";
import { useUserStore } from "@/components/auth/use-user-store";

export function CreateEventView() {
  const router = useRouter();
  const { profile } = useUserStore();
  const basePath = profile?.profile_type === "host" ? "/host" : "/dj";

  async function handleSubmit(values: EventFormValues, pendingImages: File[]) {
    if (!profile) return;

    const created = await createEvent({
      ...values,
      created_by: profile.id,
      location: null,
    });

    if (pendingImages.length > 0) {
      try {
        const urls = await uploadEventImages(pendingImages, profile.id);
        await addEventImages(created.id, urls);
      } catch (err) {
        // Event was created, but image attach failed — keep the event and surface
        // a focused error so the user can retry from the edit page.
        if (err instanceof EventImageError) {
          toast.error(`Event created, but images failed: ${err.message}`);
        } else {
          toast.error("Event created, but image upload failed. Edit the event to retry.");
        }
        router.push(`${basePath}/edit-event/${created.id}`);
        return;
      }
    }

    router.push(`${basePath}/event-manager`);
    toast.success("Event created successfully.");
  }

  return <EventForm mode="create" onSubmit={handleSubmit} />;
}
