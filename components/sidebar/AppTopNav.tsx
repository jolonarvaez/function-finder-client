"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";

export function AppTopNav() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border bg-card px-4">
      <SidebarTrigger />
      <span className="text-xl font-bold tracking-tight text-foreground">
        Function Finder
      </span>
    </header>
  );
}
