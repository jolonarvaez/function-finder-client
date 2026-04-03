"use client";

import { VenueListView } from "@/components/VenueListView";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function ProfilePage() {
  return (
    <AuthGuard>
      <VenueListView />
    </AuthGuard>
  );
}
