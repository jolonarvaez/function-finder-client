"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon, UserIcon, LogOutIcon, Trash2Icon } from "lucide-react";
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
  const { user, signOut } = useAuth();

  const name = user?.user_metadata?.full_name as string | undefined;
  const email = user?.email;
  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined;
  const savedGenres = (user?.user_metadata?.genres ?? []) as Genre[];

  const [genres, setGenres] = useState<Genre[]>(savedGenres);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function handleSaveGenres() {
    setSaving(true);
    await supabase.auth.updateUser({ data: { genres } });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleSignOut() {
    await signOut();
    router.replace("/login");
  }

  async function handleDeleteAccount() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setDeleting(true);
    await supabase.auth.admin?.deleteUser(user!.id).catch(() => null);
    await signOut();
    router.replace("/login");
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border px-4 py-4">
        <button
          onClick={() => router.back()}
          aria-label="Go back"
          className="rounded-full p-1 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ArrowLeftIcon className="size-5" />
        </button>
        <h1 className="text-lg font-semibold text-foreground">Profile</h1>
      </div>

      <div className="flex flex-col gap-6 px-4 py-6">
        {/* Avatar + identity */}
        <div className="flex items-center gap-4">
          <Avatar>
            {avatarUrl && <AvatarImage src={avatarUrl} alt={name ?? "Avatar"} />}
            <AvatarFallback>
              {getInitials(name) || <UserIcon className="size-5" />}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            {name && (
              <p className="truncate text-base font-semibold text-foreground">
                {name}
              </p>
            )}
            {email && (
              <p className="truncate text-sm text-muted-foreground">{email}</p>
            )}
          </div>
        </div>

        {/* Genre preferences */}
        <section aria-labelledby="genres-heading" className="space-y-3">
          <div className="space-y-0.5">
            <h2 id="genres-heading" className="text-lg font-medium text-foreground">
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
            className="h-10 w-full rounded-xl text-sm font-medium"
          >
            {saved ? "Saved!" : saving ? "Saving..." : "Save Genres"}
          </Button>
        </section>

        {/* Divider */}
        <div className="h-px bg-border" />

        {/* Actions */}
        <section className="space-y-3" aria-label="Account actions">
          <Button
            variant="outline"
            onClick={handleSignOut}
            className="h-11 w-full gap-2 rounded-xl text-sm"
          >
            <LogOutIcon className="size-4" />
            Sign Out
          </Button>

          {confirmDelete ? (
            <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-4 space-y-3">
              <p className="text-sm text-destructive font-medium">
                Are you sure? This cannot be undone.
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setConfirmDelete(false)}
                  className="h-10 flex-1 rounded-xl text-sm"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                  className="h-10 flex-1 rounded-xl bg-destructive text-sm text-destructive-foreground hover:bg-destructive/90"
                >
                  {deleting ? "Deleting..." : "Yes, delete"}
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="ghost"
              onClick={handleDeleteAccount}
              className="h-11 w-full gap-2 rounded-xl text-sm text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2Icon className="size-4" />
              Delete Account
            </Button>
          )}
        </section>
      </div>
    </div>
  );
}
