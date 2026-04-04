"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import type { OnboardingRole } from "@/lib/constants";
import { useUserStore } from "./auth/use-user-store";

export function ConnectedAppSidebar() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { profile, loading } = useUserStore();

  const name = profile?.display_name ?? (user?.user_metadata?.full_name as string | undefined);
  const email = user?.email;
  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined;
  const role = profile?.profile_type ?? (user?.user_metadata?.role as OnboardingRole | undefined);

  async function handleSignOut() {
    await signOut();
    router.replace("/login");
  }

  return (
    <AppSidebar
      role={role}
      loading={loading}
      name={name}
      email={email}
      avatarUrl={avatarUrl}
      onProfile={() => router.push("/profile")}
      onSettings={() => router.push("/settings")}
      onSignOut={handleSignOut}
    />
  );
}
