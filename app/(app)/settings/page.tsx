"use client";

import { SettingsView } from "@/components/settings/SettingsView";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function SettingsPage() {
  return (
    <AuthGuard>
      <SettingsView />
    </AuthGuard>
  );
}
