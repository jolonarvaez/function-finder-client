import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { AppTopNav } from "@/components/sidebar/AppTopNav";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

/**
 * TopNav is the global app shell: sidebar + top bar + content area.
 * It wraps ConnectedAppSidebar (auth-bound), so stories use the
 * presentational AppSidebar directly with mock props instead.
 */
const meta: Meta = {
  title: "Components/Sidebar/TopNav",
  parameters: {
    layout: "fullscreen",
    nextjs: { appDirectory: true },
  },
  decorators: [
    (Story) => (
      <TooltipProvider>
        <SidebarProvider>
          <AppSidebar
            name="Jolo Narvaez"
            email="jolo@example.com"
            avatarUrl="https://placehold.co/40x40/4338ca/ffffff?text=JN"
            onProfile={() => alert("Profile")}
            onSettings={() => alert("Settings")}
            onSignOut={() => alert("Sign out")}
          />
          <SidebarInset className="grid h-svh grid-rows-[3.5rem_1fr]">
            <AppTopNav />
            <div className="overflow-auto">
              <Story />
            </div>
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj;

function PlaceholderContent({ lines = 8 }: { lines?: number }) {
  return (
    <div className="flex flex-col gap-3 p-6">
      <div className="h-7 w-48 rounded-lg bg-muted" />
      <div className="h-4 w-72 rounded-md bg-muted/60" />
      <div className="mt-2 flex flex-col gap-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="h-4 rounded-md bg-muted/40"
            style={{ width: `${70 + (i % 3) * 10}%` }}
          />
        ))}
      </div>
    </div>
  );
}

export const Default: Story = {
  render: () => <PlaceholderContent />,
};

export const DJRole: Story = {
  decorators: [
    (Story) => (
      <TooltipProvider>
        <SidebarProvider>
          <AppSidebar
            role="dj"
            name="Jolo Narvaez"
            email="jolo@example.com"
            avatarUrl="https://placehold.co/40x40/4338ca/ffffff?text=JN"
            onProfile={() => alert("Profile")}
            onSettings={() => alert("Settings")}
            onSignOut={() => alert("Sign out")}
          />
          <SidebarInset className="grid h-svh grid-rows-[3.5rem_1fr]">
            <AppTopNav />
            <div className="overflow-auto">
              <Story />
            </div>
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    ),
  ],
  render: () => <PlaceholderContent />,
};

export const ScrollableContent: Story = {
  render: () => <PlaceholderContent lines={40} />,
};
