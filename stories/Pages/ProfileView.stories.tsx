import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ProfileView } from "@/components/profile/PublicProfileView";

const meta: Meta<typeof ProfileView> = {
  title: "Pages/ProfileView",
  component: ProfileView,
  parameters: {
    layout: "fullscreen",
    nextjs: { appDirectory: true },
  },
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-107.5 overflow-hidden bg-background">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ProfileView>;

export const Default: Story = {
  args: {
    userId: "mock-user-id",
  },
};
