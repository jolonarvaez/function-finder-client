"use client";

import React from "react";
import { EventDetailView } from "@/components/event/EventDetailView";

export default function EventPage({ params }: Readonly<{ params: Promise<{ id: string }> }>) {
  const { id } = React.use(params);
  return <EventDetailView eventId={id} />;
}
