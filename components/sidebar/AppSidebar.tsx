"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MapIcon,
  SettingsIcon,
  UserIcon,
  CalendarDaysIcon,
  CalendarPlus2Icon,
} from "lucide-react";
import type { OnboardingRole } from "@/lib/constants";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { ProfileFooter, type ProfileFooterProps } from "./ProfileFooter";

const NAV_ITEMS = [
  { label: "Map", href: "/", icon: MapIcon },
  //   { label: "Venues", href: "/venues", icon: Building2Icon },
  { label: "Profile", href: "/profile", icon: UserIcon },
  { label: "Settings", href: "/settings", icon: SettingsIcon },
] as const;

const DJ_ITEMS = [
  {
    label: "Events Manager",
    href: "/dj/event-manager",
    icon: CalendarDaysIcon,
  },
  { label: "Create Event", href: "/dj/create-event", icon: CalendarPlus2Icon },
] as const;

export type AppSidebarProps = ProfileFooterProps &
  Readonly<{
    role?: OnboardingRole;
    loading?: boolean;
  }>;

export function AppSidebar({
  role,
  loading = false,
  name,
  email,
  avatarUrl,
  onProfile,
  onSettings,
  onSignOut,
}: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-4">
        <span className="text-lg font-bold tracking-tight text-sidebar-foreground">
          Function Finder
        </span>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {NAV_ITEMS.map(({ label, href, icon: Icon }) => (
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

        {loading ? (
          <>
            <SidebarSeparator />
            <SidebarGroup>
              <Skeleton className="mb-2 h-3 w-16" />
              <SidebarGroupContent>
                <Skeleton className="h-8 w-full rounded-lg" />
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        ) : (
          role === "dj" && (
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
          )
        )}
      </SidebarContent>

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
    </Sidebar>
  );
}
