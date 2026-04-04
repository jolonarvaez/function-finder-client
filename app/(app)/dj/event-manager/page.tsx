"use client";

import { DJEventsView } from "@/components/dj/DJEventsView";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function DJEventsPage() {
  return (
    <AuthGuard>
      <DJEventsView />
    </AuthGuard>
  );
}
