"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MapIcon,
  SettingsIcon,
  UserIcon,
  CalendarDaysIcon,
  CalendarPlus2Icon,
  PartyPopper,
  LogInIcon,
  UserPlusIcon,
} from "lucide-react";
import type { OnboardingRole } from "@/lib/constants";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { ProfileFooter, type ProfileFooterProps } from "./ProfileFooter";

const DJ_ITEMS = [
  {
    label: "Events Manager",
    href: "/dj/event-manager",
    icon: CalendarDaysIcon,
  },
  { label: "Create Event", href: "/dj/create-event", icon: CalendarPlus2Icon },
] as const;

const HOST_ITEMS = [
  {
    label: "Events Manager",
    href: "/host/event-manager",
    icon: CalendarDaysIcon,
  },
  { label: "Create Event", href: "/host/create-event", icon: CalendarPlus2Icon },
] as const;

export type AppSidebarProps = ProfileFooterProps &
  Readonly<{
    role?: OnboardingRole;
    loading?: boolean;
    isAuthenticated?: boolean;
    userId?: string;
  }>;

export function AppSidebar({
  role,
  loading = false,
  isAuthenticated = false,
  userId,
  name,
  email,
  avatarUrl,
  onProfile,
  onSettings,
  onSignOut,
}: AppSidebarProps) {
  const pathname = usePathname();
  const profileHref = userId ? `/profile/${userId}` : null;

  const isActive = (href: string) => (href === "/" ? pathname === href : pathname.startsWith(href));

  let accountSection: ReactNode;
  if (loading) {
    accountSection = <Skeleton className="h-8 w-full rounded-lg" />;
  } else if (isAuthenticated) {
    accountSection = (
      <>
        {profileHref && (
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive(profileHref)}
              size="default"
              tooltip="Profile"
            >
              <Link href={profileHref}>
                <UserIcon />
                <span>Profile</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            isActive={isActive("/settings")}
            size="default"
            tooltip="Settings"
          >
            <Link href="/settings">
              <SettingsIcon />
              <span>Settings</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </>
    );
  } else {
    accountSection = (
      <>
        <SidebarMenuItem>
          <SidebarMenuButton asChild isActive={isActive("/login")} size="default" tooltip="Log In">
            <Link href="/login">
              <LogInIcon />
              <span>Log In</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            isActive={isActive("/signup")}
            size="default"
            tooltip="Sign Up"
          >
            <Link href="/signup">
              <UserPlusIcon />
              <span>Sign Up</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </>
    );
  }

  return (
    <Sidebar>
      <SidebarContent>
        {/* Discover */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 mt-4">
              {[
                { label: "Map", href: "/", icon: MapIcon },
                { label: "Events", href: "/events", icon: PartyPopper },
              ].map(({ label, href, icon: Icon }) => (
                <SidebarMenuItem key={label}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(href)}
                    size="default"
                    tooltip={label}
                  >
                    <Link href={href}>
                      <Icon />
                      <span>{label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Account */}
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">{accountSection}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* DJ Tools */}
        {!loading && isAuthenticated && role === "dj" && (
          <>
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupLabel>DJ Tools</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {DJ_ITEMS.map(({ label, href, icon: Icon }) => (
                    <SidebarMenuItem key={label}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === href}
                        size="default"
                        tooltip={label}
                      >
                        <Link href={href}>
                          <Icon />
                          <span>{label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}

        {/* Host Tools */}
        {!loading && isAuthenticated && role === "host" && (
          <>
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupLabel>Host Tools</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {HOST_ITEMS.map(({ label, href, icon: Icon }) => (
                    <SidebarMenuItem key={label}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === href}
                        size="default"
                        tooltip={label}
                      >
                        <Link href={href}>
                          <Icon />
                          <span>{label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>

      {(loading || isAuthenticated) && (
        <SidebarFooter>
          {loading ? (
            <div className="flex items-center gap-3 px-2 py-2">
              <Skeleton className="size-8 shrink-0 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          ) : (
            <ProfileFooter
              name={name}
              email={email}
              avatarUrl={avatarUrl}
              onProfile={onProfile}
              onSettings={onSettings}
              onSignOut={onSignOut}
            />
          )}
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
