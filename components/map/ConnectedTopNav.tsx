"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { TopNav } from "./TopNav";

export function ConnectedTopNav() {
  const router = useRouter();
  const { user, signOut } = useAuth();

  const name = user?.user_metadata?.full_name as string | undefined;
  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined;
  const email = user?.email;

  async function handleSignOut() {
    await signOut();
    router.replace("/login");
  }

  return (
    <TopNav
      name={name}
      email={email}
      avatarUrl={avatarUrl}
      onProfile={() => router.push("/profile")}
      onSettings={() => router.push("/settings")}
      onSignOut={handleSignOut}
    />
  );
}
