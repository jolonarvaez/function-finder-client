"use client";
// test deployment

import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import type { OnboardingRole } from "@/lib/constants";
import { useUserStore } from "@/components/auth/use-user-store";

export function ConnectedAppSidebar() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { profile, loading } = useUserStore();

  const name = profile?.display_name ?? (user?.user_metadata?.full_name as string | undefined);
  const email = user?.email;
  const avatarUrl = profile?.avatar_url ?? undefined;
  const role = profile?.profile_type ?? (user?.user_metadata?.role as OnboardingRole | undefined);

  async function handleSignOut() {
    await signOut();
    router.replace("/login");
  }

  const userId = user?.id;

  return (
    <AppSidebar
      role={role}
      loading={loading}
      name={name}
      email={email}
      avatarUrl={avatarUrl}
      userId={userId}
      onProfile={() => userId && router.push(`/profile/${userId}`)}
      onSettings={() => router.push("/settings")}
      onSignOut={handleSignOut}
    />
  );
}
