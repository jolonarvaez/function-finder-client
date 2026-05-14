"use client";

import { ConnectedAppSidebar } from "@/components/ConnectedAppSidebar";
import { AppTopNav } from "@/components/sidebar/AppTopNav";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

export function TopNav({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <ConnectedAppSidebar />
        <SidebarInset className="grid h-svh grid-rows-[3.5rem_1fr] overflow-hidden">
          <AppTopNav />
          <div className="overflow-auto">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
