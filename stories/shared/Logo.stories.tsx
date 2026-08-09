import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Logo } from "@/components/shared/Logo";

const meta: Meta<typeof Logo> = {
  title: "Components/Logo",
  component: Logo,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "radio",
      options: ["sm", "regular", "lg"],
    },
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
type Story = StoryObj<typeof Logo>;

const defaultArgs = {};

export const Small: Story = {
  args: { ...defaultArgs, size: "sm" },
};

export const Regular: Story = {
  args: { ...defaultArgs, size: "regular" },
};

export const Large: Story = {
  args: { ...defaultArgs, size: "lg" },
};

export const AllSizes: Story = {
  args: defaultArgs,
  render: (args) => (
    <div className="flex items-end gap-6">
      <Logo {...args} size="sm" />
      <Logo {...args} size="regular" />
      <Logo {...args} size="lg" />
    </div>
  ),
};
