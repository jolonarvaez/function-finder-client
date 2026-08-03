"use client";

import { CreateEventView } from "@/components/event/CreateEventView";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function HostCreateEventPage() {
  return (
    <AuthGuard>
      <CreateEventView />
    </AuthGuard>
  );
}
