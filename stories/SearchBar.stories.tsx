import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SearchBar } from "@/components/SearchBar";

const meta: Meta<typeof SearchBar> = {
  title: "Components/SearchBar",
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
