"use client";

import { useState } from "react";
import { UserIcon, SettingsIcon, LogOutIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

function getInitials(name?: string): string {
  if (!name) return "";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export type ProfileFooterProps = Readonly<{
  name?: string;
  email?: string;
  avatarUrl?: string;
  onProfile?: () => void;
  onSettings?: () => void;
  onSignOut?: () => void;
}>;

export function ProfileFooter({
  name,
  email,
  avatarUrl,
  onProfile,
  onSettings,
  onSignOut,
}: ProfileFooterProps) {
  const [open, setOpen] = useState(false);
  const initials = getInitials(name);

  function handleAction(fn?: () => void) {
    setOpen(false);
    fn?.();
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          aria-label="Open user menu"
          aria-expanded={open}
          aria-haspopup="menu"
          className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-sidebar-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
        >
          <Avatar className="size-8 shrink-0">
            {avatarUrl && <AvatarImage src={avatarUrl} alt={name ?? "User avatar"} />}
            <AvatarFallback className="text-xs">
              {initials || <UserIcon className="size-4" />}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            {name && <p className="truncate text-sm font-medium text-sidebar-foreground">{name}</p>}
            {email && <p className="truncate text-xs text-sidebar-foreground/60">{email}</p>}
          </div>
        </button>
      </PopoverTrigger>

      <PopoverContent
        side="top"
        align="start"
        sideOffset={8}
        className="w-52 p-1"
        aria-label="User menu"
      >
        {(name || email) && (
          <>
            <div className="px-2 pt-2 pb-1">
              {name && <p className="truncate text-sm font-medium text-foreground">{name}</p>}
              {email && <p className="truncate text-xs text-muted-foreground">{email}</p>}
            </div>
            <Separator />
          </>
        )}

        <div role="menu">
          <button
            role="menuitem"
            onClick={() => handleAction(onProfile)}
            className="flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-sm text-foreground hover:bg-accent focus-visible:bg-accent focus-visible:outline-none"
          >
            <UserIcon className="size-4 text-muted-foreground" />
            Profile
          </button>

          <button
            role="menuitem"
            onClick={() => handleAction(onSettings)}
            className="flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-sm text-foreground hover:bg-accent focus-visible:bg-accent focus-visible:outline-none"
          >
            <SettingsIcon className="size-4 text-muted-foreground" />
            Settings
          </button>

          <Separator className="my-1" />

          <button
            role="menuitem"
            onClick={() => handleAction(onSignOut)}
            className="flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-sm text-destructive hover:bg-destructive/10 focus-visible:bg-destructive/10 focus-visible:outline-none"
          >
            <LogOutIcon className="size-4" />
            Sign out
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
