import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { OnboardingProfilePage } from "@/components/onboarding/OnboardingProfilePage";

const meta: Meta<typeof OnboardingProfilePage> = {
  title: "Pages/Onboarding/OnboardingProfilePage",
  component: OnboardingProfilePage,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    viewport: { defaultViewport: "mobile1" },
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
type Story = StoryObj<typeof OnboardingProfilePage>;

export const Default: Story = {};
