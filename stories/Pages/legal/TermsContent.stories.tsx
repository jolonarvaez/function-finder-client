import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TermsContent } from "@/components/legal/TermsContent";

const meta: Meta<typeof TermsContent> = {
  title: "Pages/legal/TermsContent",
  component: TermsContent,
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
type Story = StoryObj<typeof TermsContent>;

export const Default: Story = {};
