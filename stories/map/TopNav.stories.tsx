import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TopNav } from "@/components/map/TopNav";

const meta: Meta<typeof TopNav> = {
  title: "Components/TopNav",
  component: TopNav,
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-200 bg-background p-6">
        <Story />
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
type Story = StoryObj<typeof TopNav>;

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

export const DropdownOpen: Story = {
  args: {
    name: "Jolo Narvaez",
    email: "jolo@example.com",
    defaultOpen: true,
  },
};

export const NoUser: Story = {
  args: {},
};

export const LongName: Story = {
  args: {
    name: "Bartholomew Fitzgerald-Santiago",
    email: "bartholomew.fitzgerald-santiago@example.com",
  },
};
