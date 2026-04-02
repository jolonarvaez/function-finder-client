"use client";

import { useState } from "react";
import { UserIcon, SettingsIcon, LogOutIcon } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export type TopNavProps = Readonly<{
  name?: string;
  email?: string;
  avatarUrl?: string;
  onProfile?: () => void;
  onSettings?: () => void;
  onSignOut?: () => void;
  className?: string;
}>;

function getInitials(name?: string): string {
  if (!name) return "";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function TopNav({
  name,
  email,
  avatarUrl,
  onProfile,
  onSettings,
  onSignOut,
  className,
}: TopNavProps) {
  const [open, setOpen] = useState(false);
  const initials = getInitials(name);

  function handleAction(fn?: () => void) {
    setOpen(false);
    fn?.();
  }

  return (
    <nav
      aria-label="Top navigation"
      className={cn("flex items-center justify-between", className)}
    >
      <span className="text-xl font-bold tracking-tight text-foreground">
        Function Finder
      </span>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            aria-label="Open user menu"
            aria-expanded={open}
            aria-haspopup="menu"
            className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <Avatar className="size-8">
              {avatarUrl && <AvatarImage src={avatarUrl} alt={name ?? "User avatar"} />}
              <AvatarFallback>
                {initials || <UserIcon className="size-4" />}
              </AvatarFallback>
            </Avatar>
          </button>
        </PopoverTrigger>

        <PopoverContent
          align="end"
          sideOffset={8}
          className="w-52 p-1"
          aria-label="User menu"
        >
          {/* Identity */}
          {(name || email) && (
            <>
              <div className="px-2 py-2">
                {name && (
                  <p className="truncate text-sm font-medium text-foreground">
                    {name}
                  </p>
                )}
                {email && (
                  <p className="truncate text-xs text-muted-foreground">
                    {email}
                  </p>
                )}
              </div>
              <div className="my-1 h-px bg-border" />
            </>
          )}

          {/* Menu items */}
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

            <div className="my-1 h-px bg-border" />

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
    </nav>
  );
}
