import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MapFilters } from "@/components/map/MapFilters";

const meta: Meta<typeof MapFilters> = {
  title: "Components/Filters/MapFilters",
  component: MapFilters,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-200 bg-background p-6">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MapFilters>;

export const Collapsed: Story = {};

export const DefaultOpen: Story = {
  args: {
    defaultOpen: true,
  },
};

export const WithDateToday: Story = {
  args: {
    defaultDate: new Date(),
    defaultOpen: true,
  },
};

export const WithDatePreselected: Story = {
  args: {
    defaultDate: new Date("2026-04-05"),
    defaultOpen: true,
  },
};
