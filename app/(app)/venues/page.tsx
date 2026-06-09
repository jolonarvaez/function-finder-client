"use client";

import { VenueListView } from "@/components/venues/VenueListView";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function ProfilePage() {
  return (
    <AuthGuard>
      <VenueListView />
    </AuthGuard>
  );
}
