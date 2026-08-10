"use client";

import { ConnectedAppSidebar } from "@/components/sidebar/ConnectedAppSidebar";
import { AppTopNav } from "@/components/sidebar/AppTopNav";
import { Footer } from "@/components/shared/Footer";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

export function TopNav({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <ConnectedAppSidebar />
        <SidebarInset className="grid h-svh grid-rows-[3.5rem_1fr] overflow-hidden">
          <AppTopNav />
          <div className="flex flex-col overflow-auto">
            <div className="flex-1">{children}</div>
            <Footer />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
