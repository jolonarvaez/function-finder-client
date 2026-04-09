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

export const DaySelected: Story = {
  args: {
    defaultOpen: true,
    defaultDate: new Date("2026-04-08"),
    defaultDateRangeType: "day",
  },
};

export const WeekSelected: Story = {
  args: {
    defaultOpen: true,
    defaultDate: new Date("2026-04-08"),
    defaultDateRangeType: "week",
  },
};

export const MonthSelected: Story = {
  args: {
    defaultOpen: true,
    defaultDate: new Date("2026-04-08"),
    defaultDateRangeType: "month",
  },
};
