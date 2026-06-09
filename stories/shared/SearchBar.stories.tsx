import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SearchBar } from "@/components/shared/SearchBar";

const meta: Meta<typeof SearchBar> = {
  title: "Components/Filters/SearchBar",
  component: SearchBar,
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
type Story = StoryObj<typeof SearchBar>;

export const Default: Story = {};

export const DefaultOpened: Story = {
  args: {
    showFilter: true,
  },
};

export const WithStatus: Story = {
  args: {
    showFilter: true,
    showStatus: true,
  },
};

export const WithDatePreselected: Story = {
  args: {
    showFilter: true,
    defaultDate: new Date("2026-04-05"),
  },
};

export const WithDateToday: Story = {
  args: {
    showFilter: true,
    defaultDate: new Date(),
  },
};
