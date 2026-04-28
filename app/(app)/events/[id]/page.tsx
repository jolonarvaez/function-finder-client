"use client";

import React from "react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { EventDetailView } from "@/components/event/EventDetailView";

export default function EventPage({ params }: Readonly<{ params: Promise<{ id: string }> }>) {
  const { id } = React.use(params);
  return (
    <AuthGuard>
      <EventDetailView eventId={id} />
    </AuthGuard>
  );
}
