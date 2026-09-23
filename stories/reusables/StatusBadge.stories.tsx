import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { StatusBadge } from "@/components/reusables/StatusBadge";

const meta: Meta<typeof StatusBadge> = {
  title: "Reusables/StatusBadge",
  component: StatusBadge,
  tags: ["autodocs"],
  argTypes: {
    status: { control: "inline-radio", options: ["live", "upcoming", "done"] },
  },
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-200 bg-background p-6">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof StatusBadge>;

export const Live: Story = {
  args: { status: "live" },
};

export const Upcoming: Story = {
  args: { status: "upcoming" },
};

export const Done: Story = {
  args: { status: "done" },
};

/** All three together, for comparing weight against one another. */
export const AllStatuses: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <StatusBadge status="live" />
      <StatusBadge status="upcoming" />
      <StatusBadge status="done" />
    </div>
  ),
};

/** Sitting beside a title, the way an event card uses it. */
export const InContext: Story = {
  render: () => (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center gap-2">
        <StatusBadge status="live" />
        <p className="truncate text-lg font-semibold text-foreground">Warehouse Sessions Vol. 4</p>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">The Bunker, BGC, Taguig</p>
    </div>
  ),
};
