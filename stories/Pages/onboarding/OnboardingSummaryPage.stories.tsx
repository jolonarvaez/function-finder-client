import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { OnboardingSummaryPage } from "@/components/onboarding/OnboardingSummaryPage";

const meta: Meta<typeof OnboardingSummaryPage> = {
  title: "Pages/Onboarding/OnboardingSummaryPage",
  component: OnboardingSummaryPage,
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
type Story = StoryObj<typeof OnboardingSummaryPage>;

export const AsEventGoer: Story = {
  args: {
    role: "event-goer",
    displayName: "Night Owl",
    bio: "Always chasing the perfect night out.",
    country: "United Kingdom",
    genres: ["House", "Afrobeats", "R&B", "Dancehall"],
  },
};

export const AsDJ: Story = {
  args: {
    role: "dj",
    displayName: "DJ Nova",
    bio: "Blending techno and drum & bass since 2018.",
    country: "Germany",
    genres: ["Techno", "Drum & Bass", "House"],
  },
};

export const NoGenres: Story = {
  args: {
    role: "event-goer",
    displayName: "Wanderer",
    bio: "",
    country: "",
    genres: [],
  },
};
