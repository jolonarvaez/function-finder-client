"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import {
  SunIcon,
  MoonIcon,
  MonitorIcon,
  Trash2Icon,
  LogOutIcon,
  ExternalLinkIcon,
  UserIcon,
  MusicIcon,
  PaletteIcon,
  GlobeIcon,
  InfoIcon,
  PlusIcon,
  XIcon,
  SettingsIcon,
  CameraIcon,
  LoaderCircleIcon,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { GenreSelector } from "@/components/GenreSelector";
import { CountrySelect } from "@/components/reusables/CountrySelect";
import { useAuth } from "@/components/auth/AuthProvider";
import { useUserStore } from "@/components/auth/use-user-store";
import { updateUser } from "@/lib/services/users";
import { uploadAvatarImage } from "@/lib/services/storage";
import { AvatarCropSheet } from "@/components/settings/AvatarCropSheet";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { Genre } from "@/lib/constants";
import { PageContainer, PageHeader } from "../reusables/PageContainer";
import { SOCIAL_PLATFORMS, SocialPlatform, SocialEntry } from "@/lib/constants";

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
}: Readonly<{
  icon: React.ElementType;
  label: string;
}>) {
  return (
    <div className="flex items-center gap-2 pb-1">
      <Icon className="size-5 text-foreground" />
      <h2 className="text-lg font-semibold text-foreground">{label}</h2>
    </div>
  );
}

function SettingsRow({
  label,
  description,
  children,
}: Readonly<{
  label: string;
  description?: string;
  children?: React.ReactNode;
}>) {
  return (
    <div className="flex items-center justify-between gap-4 py12">
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {description && <p className="text-sm text-muted-foreground mt-0.5">{description}</p>}
      </div>
      {children && <div className="shrink-0">{children}</div>}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────

export function SettingsView() {
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const { profile, setProfile } = useUserStore();

  const name = profile?.display_name ?? (user?.user_metadata?.full_name as string | undefined);
  const email = user?.email;
  const avatarUrl = profile?.avatar_url ?? undefined;

  // Avatar upload state
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [cropSrc, setCropSrc] = useState<string | null>(null);

  // Display name state
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(name ?? "");
  const [nameSaving, setNameSaving] = useState(false);
  // Profile state
  const [bio, setBio] = useState(profile?.bio ?? "");
  const [country, setCountry] = useState(profile?.country ?? "");
  const [profileSaving, setProfileSaving] = useState(false);
  // Social links state
  const [socials, setSocials] = useState<SocialEntry[]>(() => {
    const links = profile?.socmed_links ?? {};
    const entries = (Object.entries(links) as [SocialPlatform, string][]).filter(
      ([p]) => p === "twitter" || p === "instagram"
    );
    return entries.length > 0 ? entries.map(([platform, value]) => ({ platform, value })) : [];
  });
  const [socialsSaving, setSocialsSaving] = useState(false);

  useEffect(() => {
    const links = profile?.socmed_links ?? {};
    const entries = Object.entries(links) as [SocialPlatform, string][];
    setSocials(entries.length > 0 ? entries.map(([platform, value]) => ({ platform, value })) : []);
  }, [profile?.socmed_links]);
  // Preferences state
  const [genres, setGenres] = useState<Genre[]>(profile?.genre_tags ?? []);
  const [genresSaving, setGenresSaving] = useState(false);
  // Danger zone state
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleSaveName() {
    if (!profile || !nameValue.trim()) return;
    setNameSaving(true);
    try {
      await updateUser(profile.id, {
        profile_type: profile.profile_type!,
        genre_tags: profile.genre_tags,
        display_name: nameValue.trim(),
      });
      setProfile({ ...profile, display_name: nameValue.trim() });
      setEditingName(false);
      toast.success("Display name updated.");
    } catch {
      toast.error("Failed to update display name.");
    } finally {
      setNameSaving(false);
    }
  }

  async function handleSaveProfile() {
    if (!profile) return;
    setProfileSaving(true);
    try {
      await updateUser(profile.id, {
        profile_type: profile.profile_type!,
        genre_tags: profile.genre_tags,
        bio: bio.trim() || null,
        country: country || null,
      });
      setProfile({ ...profile, bio: bio.trim() || null, country: country || null });
      toast.success("Profile updated.");
    } catch {
      toast.error("Failed to update profile.");
    } finally {
      setProfileSaving(false);
    }
  }

  async function handleSaveSocials() {
    if (!profile) return;
    setSocialsSaving(true);
    try {
      const socmed_links = Object.fromEntries(
        socials.filter((s) => s.platform && s.value.trim()).map((s) => [s.platform, s.value.trim()])
      );
      await updateUser(profile.id, {
        profile_type: profile.profile_type!,
        genre_tags: profile.genre_tags,
        socmed_links,
      });
      setProfile({ ...profile, socmed_links });
      toast.success("Social links saved.");
    } catch {
      toast.error("Failed to save social links.");
    } finally {
      setSocialsSaving(false);
    }
  }

  async function handleSaveGenres() {
    if (!profile) return;
    setGenresSaving(true);
    try {
      await updateUser(profile.id, { profile_type: profile.profile_type!, genre_tags: genres });
      setProfile({ ...profile, genre_tags: genres });
      toast.success("Genre preferences saved.");
    } catch {
      toast.error("Failed to save preferences.");
    } finally {
      setGenresSaving(false);
    }
  }

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCropSrc(URL.createObjectURL(file));
    e.target.value = "";
  }

  async function handleCropConfirm(blob: Blob) {
    if (!profile) return;
    setCropSrc(null);
    setAvatarUploading(true);
    try {
      const file = new File([blob], "avatar.jpg", { type: "image/jpeg" });
      const url = await uploadAvatarImage(file, profile.id);
      await updateUser(profile.id, { avatar_url: url });
      setProfile({ ...profile, avatar_url: url });
      toast.success("Avatar updated.");
    } catch {
      toast.error("Failed to upload avatar.");
    } finally {
      setAvatarUploading(false);
    }
  }

  function handleCropCancel() {
    if (cropSrc) URL.revokeObjectURL(cropSrc);
    setCropSrc(null);
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
    <PageContainer>
      <PageHeader title="Settings" icon={SettingsIcon} showBack />
      <div className="flex flex-col gap-10">
        {/* ── Account ─────────────────────────────────────── */}
        <section aria-labelledby="account-heading" className="flex flex-col gap-4">
          <div>
            <SectionHeader icon={UserIcon} label="Account" />
            <Separator className="mt-3" />
          </div>

          {/* Identity card */}
          <div className="flex items-center gap-3">
            <label
              htmlFor="avatar-upload"
              className={cn(
                "relative size-12 shrink-0 cursor-pointer rounded-full",
                avatarUploading && "pointer-events-none"
              )}
              aria-label="Change avatar"
            >
              <Avatar className="size-12">
                {avatarUrl && <AvatarImage src={avatarUrl} alt={name ?? "Avatar"} />}
                <AvatarFallback>
                  {getInitials(name) || <UserIcon className="size-5" />}
                </AvatarFallback>
              </Avatar>
              <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity hover:opacity-100">
                {avatarUploading ? (
                  <LoaderCircleIcon className="size-4 animate-spin text-white" />
                ) : (
                  <CameraIcon className="size-4 text-white" />
                )}
              </span>
              {avatarUploading && (
                <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
                  <LoaderCircleIcon className="size-4 animate-spin text-white" />
                </span>
              )}
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleAvatarChange}
              disabled={avatarUploading}
            />
            <div className="min-w-0">
              {name && <p className="truncate text-sm font-semibold text-foreground">{name}</p>}
              {email && <p className="truncate text-sm text-muted-foreground">{email}</p>}
            </div>
          </div>

          <Separator />

          {/* Display name */}
          {editingName ? (
            <div className="flex flex-col gap-3">
              <p className="text-sm font-medium text-foreground">Display Name</p>
              <Input
                value={nameValue}
                onChange={(e) => setNameValue(e.target.value)}
                className="rounded-lg"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveName();
                  if (e.key === "Escape") setEditingName(false);
                }}
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg"
                  onClick={() => setEditingName(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="rounded-lg"
                  onClick={handleSaveName}
                  disabled={nameSaving || !nameValue.trim()}
                >
                  {nameSaving ? "Saving…" : "Save"}
                </Button>
              </div>
            </div>
          ) : (
            <SettingsRow label="Display Name" description={name ?? "Not set"}>
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg"
                onClick={() => {
                  setNameValue(name ?? "");
                  setEditingName(true);
                }}
              >
                <UserIcon className="size-3.5" />
                Edit
              </Button>
            </SettingsRow>
          )}

          <Separator />

          {/* Bio + Country */}
          <div className="flex flex-col gap-4">
            <p className="text-sm font-medium text-foreground">Profile Info</p>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="bio" className="text-sm font-medium text-muted-foreground">
                Bio
              </label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell people a little about yourself…"
                rows={3}
                maxLength={300}
                className="rounded-lg resize-none text-sm"
              />
              <p className="text-sm text-muted-foreground text-right">{bio.length}/300</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="country" className="text-sm font-medium text-muted-foreground">
                Country
              </label>
              <CountrySelect
                id="country"
                value={country}
                onValueChange={setCountry}
                className="rounded-lg"
              />
            </div>

            <div className="flex justify-end">
              <Button
                size="sm"
                onClick={handleSaveProfile}
                disabled={profileSaving}
                className="rounded-lg"
              >
                {profileSaving ? "Saving…" : "Save Profile"}
              </Button>
            </div>
          </div>

          <Separator />

          {/* Social links */}
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-sm font-medium text-foreground">Social Links</p>
              <p className="text-sm text-muted-foreground mt-0.5">
                Connect your social media profiles
              </p>
            </div>

            {socials.length > 0 && (
              <div className="flex flex-col gap-2">
                {socials.map((entry, i) => {
                  const usedPlatforms = socials.filter((_, j) => j !== i).map((s) => s.platform);
                  return (
                    <div key={i} className="flex items-center gap-2">
                      <Select
                        value={entry.platform}
                        onValueChange={(val) => {
                          const updated = [...socials];
                          updated[i] = { ...updated[i], platform: val as SocialPlatform };
                          setSocials(updated);
                        }}
                      >
                        <SelectTrigger className="w-32 shrink-0 rounded-lg text-sm">
                          <SelectValue placeholder="Platform" />
                        </SelectTrigger>
                        <SelectContent>
                          {SOCIAL_PLATFORMS.map((p) => (
                            <SelectItem
                              key={p.value}
                              value={p.value}
                              disabled={usedPlatforms.includes(p.value)}
                            >
                              {p.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        value={entry.value}
                        onChange={(e) => {
                          const updated = [...socials];
                          updated[i] = { ...updated[i], value: e.target.value };
                          setSocials(updated);
                        }}
                        placeholder="URL or handle"
                        className="rounded-lg text-sm"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 shrink-0 rounded-lg text-muted-foreground hover:text-destructive"
                        aria-label="Remove link"
                        onClick={() => setSocials(socials.filter((_, j) => j !== i))}
                      >
                        <XIcon className="size-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg"
                disabled={socials.length >= SOCIAL_PLATFORMS.length}
                onClick={() => setSocials([...socials, { platform: "", value: "" }])}
              >
                <PlusIcon className="size-3.5" />
                Add link
              </Button>
              {socials.length > 0 && (
                <Button
                  size="sm"
                  className="rounded-lg"
                  onClick={handleSaveSocials}
                  disabled={socialsSaving}
                >
                  {socialsSaving ? "Saving…" : "Save Links"}
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* ── Preferences ─────────────────────────────────── */}
        <section aria-labelledby="preferences-heading" className="flex flex-col gap-4">
          <div>
            <SectionHeader icon={MusicIcon} label="Preferences" />
            <Separator className="mt-3" />
          </div>

          <div className="flex flex-col gap-3">
            <div>
              <p className="text-sm font-medium text-foreground">Genre Preferences</p>
              <p className="text-sm text-muted-foreground mt-0.5">
                Used to personalise your map feed
              </p>
            </div>
            <GenreSelector selected={genres} onChange={setGenres} variant="wrap" />
            <div className="flex justify-end">
              <Button
                size="sm"
                onClick={handleSaveGenres}
                disabled={genresSaving}
                className="rounded-lg"
              >
                {genresSaving ? "Saving…" : "Save Genres"}
              </Button>
            </div>
          </div>
        </section>

        {/* ── Appearance ──────────────────────────────────── */}
        <section aria-labelledby="appearance-heading" className="flex flex-col gap-4">
          <div>
            <SectionHeader icon={PaletteIcon} label="Appearance" />
            <Separator className="mt-3" />
          </div>

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
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <Icon className="size-3.5" />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>
          </SettingsRow>

          <Separator />

          <SettingsRow label="Language" description="App display language">
            <div className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground">
              <GlobeIcon className="size-3.5" />
              English
            </div>
          </SettingsRow>
        </section>

        {/* ── About ───────────────────────────────────────── */}
        <section aria-labelledby="about-heading" className="flex flex-col gap-4">
          <div>
            <SectionHeader icon={InfoIcon} label="About" />
            <Separator className="mt-3" />
          </div>

          <SettingsRow label="Version" description="Function Finder">
            <span className="text-sm text-muted-foreground">1.0.0</span>
          </SettingsRow>
          {/* <Separator /> */}
          {/* <SettingsRow label="Terms of Service">
            <a href="#" className="flex items-center gap-1 text-sm text-primary hover:underline">
              View <ExternalLinkIcon className="size-3.5" />
            </a>
          </SettingsRow>
          <Separator />
          <SettingsRow label="Privacy Policy">
            <a href="#" className="flex items-center gap-1 text-sm text-primary hover:underline">
              View <ExternalLinkIcon className="size-3.5" />
            </a>
          </SettingsRow> */}
          <Separator />
          <SettingsRow label="Send Feedback">
            <a
              href="mailto:feedback@functionfinder.app"
              className="flex items-center gap-1 text-sm text-primary hover:underline"
            >
              Email us <ExternalLinkIcon className="size-3.5" />
            </a>
          </SettingsRow>
        </section>

        {/* ── Account Actions ──────────────────────────────── */}
        <section aria-labelledby="danger-heading" className="flex flex-col gap-4">
          <div>
            <SectionHeader icon={Trash2Icon} label="Account Actions" />
            <Separator className="mt-3" />
          </div>

          <div className="flex flex-col gap-3">
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="h-10 w-full rounded-lg text-sm"
            >
              <LogOutIcon className="size-4" />
              Sign Out
            </Button>

            {confirmDelete ? (
              <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 flex flex-col gap-3">
                <p className="text-sm font-medium text-destructive">
                  Are you sure? This cannot be undone.
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setConfirmDelete(false)}
                    className="h-9 flex-1 rounded-lg text-sm"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleDeleteAccount}
                    disabled={deleting}
                    className="h-9 flex-1 rounded-lg bg-destructive text-sm text-destructive-foreground hover:bg-destructive/90"
                  >
                    {deleting ? "Deleting…" : "Yes, delete"}
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant="ghost"
                onClick={handleDeleteAccount}
                className="h-10 w-full rounded-lg text-sm text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2Icon className="size-4" />
                Delete Account
              </Button>
            )}
          </div>
        </section>
      </div>

      <AvatarCropSheet
        imageSrc={cropSrc}
        onConfirm={handleCropConfirm}
        onCancel={handleCropCancel}
      />
    </PageContainer>
  );
}
