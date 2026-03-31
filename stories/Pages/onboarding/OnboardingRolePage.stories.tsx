import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { OnboardingRolePage } from "@/components/onboarding/OnboardingRolePage";

const meta: Meta<typeof OnboardingRolePage> = {
  title: "Pages/Onboarding/OnboardingRolePage",
  component: OnboardingRolePage,
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
type Story = StoryObj<typeof OnboardingRolePage>;

export const Default: Story = {};
