"use client";

import React from "react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { EditEventView } from "@/components/event/EditEventView";

export default function HostEditEventPage({
  params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
  const { id } = React.use(params);
  return (
    <AuthGuard>
      <EditEventView eventId={id} />
    </AuthGuard>
  );
}
