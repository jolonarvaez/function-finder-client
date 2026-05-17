import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CopyLinkButton } from "@/components/reusables/CopyLinkButton";

const meta: Meta<typeof CopyLinkButton> = {
  title: "Components/CopyLinkButton",
  component: CopyLinkButton,
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
type Story = StoryObj<typeof CopyLinkButton>;

export const Default: Story = {};

export const ProfileLink: Story = {
  args: { text: "Copy Link to Profile" },
};

export const EventLink: Story = {
  args: { text: "Copy Link to Event" },
};

export const WithExplicitUrl: Story = {
  args: { text: "Copy Link", url: "https://example.com/events/123" },
};
