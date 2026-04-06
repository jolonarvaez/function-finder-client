"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserIcon } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { GenreSelector } from "@/components/GenreSelector";
import { useAuth } from "@/components/auth/AuthProvider";
import { useUserStore } from "@/components/auth/use-user-store";
import { updateUser } from "@/lib/services/users";
import { toast } from "sonner";
import { PageContainer } from "../reusables/PageContainer";

function getInitials(name?: string): string {
  if (!name) return "";
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

export function ProfileView() {
  const router = useRouter();
  const { user } = useAuth();
  const { profile, setProfile } = useUserStore();

  const name = profile?.display_name ?? (user?.user_metadata?.full_name as string | undefined);
  const email = user?.email;
  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined;

  const [genres, setGenres] = useState<Genre[]>(profile?.genre_tags ?? []);
  const [saving, setSaving] = useState(false);

  async function handleSaveGenres() {
    if (!profile) return;
    setSaving(true);
    try {
      await updateUser(profile.id, { profile_type: profile.profile_type!, genre_tags: genres });
      setProfile({ ...profile, genre_tags: genres });
      toast.success("Genre preferences saved.");
    } catch {
      toast.error("Failed to save preferences.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
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
            {saving ? "Saving..." : "Save Genres"}
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
    </PageContainer>
  );
}
