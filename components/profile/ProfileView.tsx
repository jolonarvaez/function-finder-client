"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserIcon } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { GenreSelector } from "@/components/GenreSelector";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/lib/supabase";
import type { Genre } from "@/lib/constants";

function getInitials(name?: string): string {
  if (!name) return "";
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

export function ProfileView() {
  const router = useRouter();
  const { user } = useAuth();

  const name = user?.user_metadata?.full_name as string | undefined;
  const email = user?.email;
  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined;
  const savedGenres = (user?.user_metadata?.genres ?? []) as Genre[];

  const [genres, setGenres] = useState<Genre[]>(savedGenres);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSaveGenres() {
    setSaving(true);
    await supabase.auth.updateUser({ data: { genres } });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="flex min-h-full flex-col bg-background">
      <div className="flex flex-col gap-6 px-4 py-6">
        {/* Avatar + identity */}
        <div className="flex items-center gap-4">
          <Avatar className="size-14">
            {avatarUrl && <AvatarImage src={avatarUrl} alt={name ?? "Avatar"} />}
            <AvatarFallback>
              {getInitials(name) || <UserIcon className="size-5" />}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            {name && (
              <p className="truncate text-base font-semibold text-foreground">{name}</p>
            )}
            {email && (
              <p className="truncate text-sm text-muted-foreground">{email}</p>
            )}
          </div>
        </div>

        <div className="h-px bg-border" />

        {/* Genre preferences */}
        <section aria-labelledby="genres-heading" className="space-y-3">
          <div className="space-y-0.5">
            <h2 id="genres-heading" className="text-base font-semibold text-foreground">
              Preferred Genres
            </h2>
            <p className="text-sm text-muted-foreground">
              Used to personalise your map feed.
            </p>
          </div>
          <GenreSelector selected={genres} onChange={setGenres} variant="wrap" />
          <Button
            onClick={handleSaveGenres}
            disabled={saving}
            className="h-10 w-full rounded-lg text-sm font-medium"
          >
            {saved ? "Saved!" : saving ? "Saving..." : "Save Genres"}
          </Button>
        </section>

        <div className="h-px bg-border" />

        <Button
          variant="outline"
          onClick={() => router.push("/settings")}
          className="h-11 w-full rounded-lg text-sm"
        >
          Go to Settings
        </Button>
      </div>
    </div>
  );
}
