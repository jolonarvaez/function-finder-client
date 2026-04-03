"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MapIcon,
  Building2Icon,
  SettingsIcon,
  UserIcon,
  CalendarDaysIcon,
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
import { ProfileFooter, type ProfileFooterProps } from "./ProfileFooter";

const NAV_ITEMS = [
  { label: "Map", href: "/", icon: MapIcon },
  { label: "Venues", href: "/venues", icon: Building2Icon },
  { label: "Settings", href: "/settings", icon: SettingsIcon },
  { label: "Profile", href: "/profile", icon: UserIcon },
] as const;

const DJ_ITEMS = [
  { label: "Events Manager", href: "/dj/events", icon: CalendarDaysIcon },
] as const;

export type AppSidebarProps = ProfileFooterProps & Readonly<{
  role?: OnboardingRole;
}>;

export function AppSidebar({
  role,
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

        {role === "dj" && (
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
      </SidebarContent>

      <SidebarFooter>
        <ProfileFooter
          name={name}
          email={email}
          avatarUrl={avatarUrl}
          onProfile={onProfile}
          onSettings={onSettings}
          onSignOut={onSignOut}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
