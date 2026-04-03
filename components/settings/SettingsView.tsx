"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import {
  SunIcon,
  MoonIcon,
  MonitorIcon,
  Trash2Icon,
  LogOutIcon,
  ExternalLinkIcon,
  UserIcon,
  MailIcon,
  LockIcon,
  MusicIcon,
  PaletteIcon,
  GlobeIcon,
  InfoIcon,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { GenreSelector } from "@/components/GenreSelector";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import type { Genre } from "@/lib/constants";

// ── Types ────────────────────────────────────────────────────

type Theme = "light" | "dark" | "system";

// ── Helpers ──────────────────────────────────────────────────

function getInitials(name?: string): string {
  if (!name) return "";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// ── Sub-components ───────────────────────────────────────────

function SectionHeader({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 pb-1">
      <Icon className="size-4 text-foreground" />
      <h2 className="text-md font-semibold text-foreground">{label}</h2>
    </div>
  );
}

function SettingsRow({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children && <div className="shrink-0">{children}</div>}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────

export function SettingsView() {
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();

  const name = user?.user_metadata?.full_name as string | undefined;
  const email = user?.email;
  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined;
  const savedGenres = (user?.user_metadata?.genres ?? []) as Genre[];

  // Preferences state
  const [genres, setGenres] = useState<Genre[]>(savedGenres);
  const [genresSaving, setGenresSaving] = useState(false);
  const [genresSaved, setGenresSaved] = useState(false);
  // Danger zone state
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleSaveGenres() {
    setGenresSaving(true);
    setGenresSaving(false);
    setGenresSaved(true);
    setTimeout(() => setGenresSaved(false), 2000);
  }

  async function handleSignOut() {
    await signOut();
  }

  async function handleDeleteAccount() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setDeleting(true);
    await supabase.auth.admin?.deleteUser(user!.id).catch(() => null);
    await signOut();
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-6 space-y-8">
      {/* ── Account ─────────────────────────────────────── */}
      <section aria-labelledby="account-heading">
        <SectionHeader icon={UserIcon} label="Account" />
        <Separator className="mb-2" />

        {/* Identity card */}
        <div className="flex items-center gap-4 py-3">
          <Avatar className="size-12">
            {avatarUrl && (
              <AvatarImage src={avatarUrl} alt={name ?? "Avatar"} />
            )}
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

        <Separator className="my-1" />

        <SettingsRow
          label="Display Name"
          description="How you appear to others"
        >
          <Button variant="outline" size="sm" className="rounded-lg">
            <UserIcon className="size-3.5" />
            Edit
          </Button>
        </SettingsRow>

        <Separator className="my-0" />

        <SettingsRow label="Email" description={email ?? "No email set"}>
          <Button variant="outline" size="sm" className="rounded-lg">
            <MailIcon className="size-3.5" />
            Change
          </Button>
        </SettingsRow>

        <Separator className="my-0" />

        <SettingsRow label="Password">
          <Button variant="outline" size="sm" className="rounded-lg">
            <LockIcon className="size-3.5" />
            Change
          </Button>
        </SettingsRow>
      </section>

      {/* ── Preferences ─────────────────────────────────── */}
      <section aria-labelledby="preferences-heading">
        <SectionHeader icon={MusicIcon} label="Preferences" />
        <Separator className="mb-2" />

        {/* Genre preferences */}
        <div className="py-3 space-y-3">
          <div>
            <p className="text-sm font-medium text-foreground">
              Genre Preferences
            </p>
            <p className="text-sm text-muted-foreground">
              Used to personalise your map feed
            </p>
          </div>
          <GenreSelector
            selected={genres}
            onChange={setGenres}
            variant="wrap"
          />
          <Button
            size="sm"
            onClick={handleSaveGenres}
            disabled={genresSaving}
            className="rounded-lg"
          >
            {genresSaved
              ? "Saved!"
              : genresSaving
                ? "Saving..."
                : "Save Genres"}
          </Button>
        </div>
      </section>

      {/* ── Appearance ──────────────────────────────────── */}
      <section aria-labelledby="appearance-heading">
        <SectionHeader icon={PaletteIcon} label="Appearance" />
        <Separator className="mb-2" />

        <SettingsRow label="Theme" description="App colour scheme">
          <div className="flex items-center gap-1 rounded-lg border border-border p-1">
            {(
              [
                { value: "light", icon: SunIcon, label: "Light" },
                { value: "system", icon: MonitorIcon, label: "System" },
                { value: "dark", icon: MoonIcon, label: "Dark" },
              ] as const
            ).map(({ value, icon: Icon, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setTheme(value as Theme)}
                aria-label={label}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm transition-colors",
                  theme === value
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                <Icon className="size-3.5" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </SettingsRow>

        <Separator className="my-0" />

        <SettingsRow label="Language" description="App display language">
          <div className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground">
            <GlobeIcon className="size-3.5" />
            English
          </div>
        </SettingsRow>
      </section>

      {/* ── About ───────────────────────────────────────── */}
      <section aria-labelledby="about-heading">
        <SectionHeader icon={InfoIcon} label="About" />
        <Separator className="mb-2" />

        <SettingsRow label="Version" description="Function Finder">
          <span className="text-sm text-muted-foreground">1.0.0</span>
        </SettingsRow>

        <Separator className="my-0" />

        <SettingsRow label="Terms of Service">
          <a
            href="#"
            className="flex items-center gap-1 text-sm text-primary hover:underline"
          >
            View <ExternalLinkIcon className="size-3.5" />
          </a>
        </SettingsRow>

        <Separator className="my-0" />

        <SettingsRow label="Privacy Policy">
          <a
            href="#"
            className="flex items-center gap-1 text-sm text-primary hover:underline"
          >
            View <ExternalLinkIcon className="size-3.5" />
          </a>
        </SettingsRow>

        <Separator className="my-0" />

        <SettingsRow label="Send Feedback">
          <a
            href="mailto:feedback@functionfinder.app"
            className="flex items-center gap-1 text-sm text-primary hover:underline"
          >
            Email us <ExternalLinkIcon className="size-3.5" />
          </a>
        </SettingsRow>
      </section>

      {/* ── Danger zone ─────────────────────────────────── */}
      <section aria-labelledby="danger-heading" className="space-y-3">
        <SectionHeader icon={Trash2Icon} label="Account Actions" />
        <Separator className="mb-2" />

        <Button
          variant="outline"
          onClick={handleSignOut}
          className="h-11 w-full gap-2 rounded-lg text-sm"
        >
          <LogOutIcon className="size-4" />
          Sign Out
        </Button>

        {confirmDelete ? (
          <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 space-y-3">
            <p className="text-sm font-medium text-destructive">
              Are you sure? This cannot be undone.
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setConfirmDelete(false)}
                className="h-10 flex-1 rounded-lg text-sm"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="h-10 flex-1 rounded-lg bg-destructive text-sm text-destructive-foreground hover:bg-destructive/90"
              >
                {deleting ? "Deleting..." : "Yes, delete"}
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="ghost"
            onClick={handleDeleteAccount}
            className="h-11 w-full gap-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2Icon className="size-4" />
            Delete Account
          </Button>
        )}
      </section>
    </div>
  );
}
