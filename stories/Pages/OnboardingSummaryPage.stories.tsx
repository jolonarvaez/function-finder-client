import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { OnboardingSummaryPage } from "@/components/OnboardingSummaryPage";

const meta: Meta<typeof OnboardingSummaryPage> = {
  title: "Pages/OnboardingSummaryPage",
  component: OnboardingSummaryPage,
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
type Story = StoryObj<typeof OnboardingSummaryPage>;

export const AsEventGoer: Story = {
  args: {
    role: "event-goer",
    genres: ["House", "Afrobeats", "R&B", "Dancehall"],
  },
};

export const AsDJ: Story = {
  args: {
    role: "dj",
    genres: ["Techno", "Drum & Bass", "House"],
  },
};

export const NoGenres: Story = {
  args: {
    role: "event-goer",
    genres: [],
  },
};
