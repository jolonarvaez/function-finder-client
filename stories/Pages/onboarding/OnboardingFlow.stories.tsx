import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";

const meta: Meta<typeof OnboardingFlow> = {
  title: "Pages/Onboarding/OnboardingFlow",
  component: OnboardingFlow,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="overflow-hidden bg-background">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof OnboardingFlow>;

export const Default: Story = {};
