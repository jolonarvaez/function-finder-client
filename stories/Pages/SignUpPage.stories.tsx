import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SignUpPage } from "@/components/SignUpPage";

const meta: Meta<typeof SignUpPage> = {
  title: "Pages/SignUpPage",
  component: SignUpPage,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    viewport: { defaultViewport: "mobile1" },
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
type Story = StoryObj<typeof SignUpPage>;

export const Default: Story = {};
