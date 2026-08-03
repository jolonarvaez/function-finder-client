import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

const meta: Meta<typeof AppSidebar> = {
  title: "Components/Sidebar/AppSidebar",
  component: AppSidebar,
  parameters: {
    layout: "fullscreen",
    nextjs: { appDirectory: true },
  },
  decorators: [
    (Story) => (
      <div
        className="mx-auto w-full max-w-107.5 overflow-hidden bg-background"
        style={{ height: "100svh" }}
      >
        <TooltipProvider>
          <SidebarProvider>
            <Story />
            <SidebarInset className="flex flex-col p-6 gap-2">
              <div className="h-8 w-48 rounded-lg bg-muted" />
              <div className="h-4 w-64 rounded-md bg-muted/60" />
              <div className="mt-4 h-4 w-full rounded-md bg-muted/40" />
              <div className="h-4 w-5/6 rounded-md bg-muted/40" />
              <div className="h-4 w-4/6 rounded-md bg-muted/40" />
            </SidebarInset>
          </SidebarProvider>
        </TooltipProvider>
      </div>
    ),
  ],
  args: {
    onProfile: () => alert("Profile"),
    onSettings: () => alert("Settings"),
    onSignOut: () => alert("Sign out"),
  },
};

export default meta;
type Story = StoryObj<typeof AppSidebar>;

export const WithAvatar: Story = {
  args: {
    name: "Jolo Narvaez",
    email: "jolo@example.com",
    avatarUrl: "https://placehold.co/40x40/4338ca/ffffff?text=JN",
  },
};

export const WithInitials: Story = {
  args: {
    name: "Jolo Narvaez",
    email: "jolo@example.com",
  },
};

export const NoUser: Story = {
  args: {},
};

export const LongName: Story = {
  args: {
    name: "Bartholomew Fitzgerald-Santiago",
    email: "bartholomew.fitzgerald-santiago@example.com",
    avatarUrl: "https://placehold.co/40x40/0f766e/ffffff?text=BF",
  },
};

export const DJRole: Story = {
  args: {
    name: "Jolo Narvaez",
    email: "jolo@example.com",
    avatarUrl: "https://placehold.co/40x40/4338ca/ffffff?text=JN",
    role: "dj",
  },
};

export const HostRole: Story = {
  args: {
    name: "Jolo Narvaez",
    email: "jolo@example.com",
    avatarUrl: "https://placehold.co/40x40/4338ca/ffffff?text=JN",
    role: "host",
  },
};

export const EventGoerRole: Story = {
  args: {
    name: "Jolo Narvaez",
    email: "jolo@example.com",
    avatarUrl: "https://placehold.co/40x40/4338ca/ffffff?text=JN",
    role: "event-goer",
  },
};
