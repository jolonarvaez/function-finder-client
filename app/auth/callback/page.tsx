"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) {
        router.replace("/login");
        return;
      }

      // Check if this user has completed onboarding (profile_type is set)
      const { data } = await supabase
        .from("users")
        .select("profile_type")
        .eq("id", session.user.id)
        .single();

      if (data?.profile_type) {
        router.replace("/");
      } else {
        router.replace("/onboarding");
      }
    });
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div
        role="status"
        aria-label="Signing you in"
        className="size-6 animate-spin rounded-full border-2 border-muted-foreground border-t-primary"
      />
    </div>
  );
}
