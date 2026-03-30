import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { OnboardingGenrePage } from "@/components/OnboardingGenrePage";

const meta: Meta<typeof OnboardingGenrePage> = {
  title: "Pages/OnboardingGenrePage",
  component: OnboardingGenrePage,
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
type Story = StoryObj<typeof OnboardingGenrePage>;

export const AsEventGoer: Story = {
  args: { role: "event-goer" },
};

export const AsDJ: Story = {
  args: { role: "dj" },
};
