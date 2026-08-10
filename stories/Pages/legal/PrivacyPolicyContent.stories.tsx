import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PrivacyPolicyContent } from "@/components/legal/PrivacyPolicyContent";

const meta: Meta<typeof PrivacyPolicyContent> = {
  title: "Pages/legal/PrivacyPolicyContent",
  component: PrivacyPolicyContent,
  tags: ["autodocs"],
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
type Story = StoryObj<typeof PrivacyPolicyContent>;

export const Default: Story = {};
