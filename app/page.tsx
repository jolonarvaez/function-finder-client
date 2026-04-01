"use client";

import { MapView } from "@/components/map/MapView";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function Home() {
  return (
    <AuthGuard>
      <MapView />
    </AuthGuard>
  );
}
