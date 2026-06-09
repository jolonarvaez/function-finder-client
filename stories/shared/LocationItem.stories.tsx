import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LocationItem } from "@/components/shared/LocationItem";

const meta: Meta<typeof LocationItem> = {
  title: "Components/LocationItem",
  component: LocationItem,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-200 bg-background p-6 flex items-center justify-center min-h-32">
        <div className="w-85">
          <Story />
        </div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof LocationItem>;

const defaultArgs = {
  name: "Pulse",
  address: "456 Downtown Ave, City",
  distance: "0.8 km",
  genre: "House",
  imageSrc: "https://placehold.co/200x200/1a1a2e/e94560?text=Pulse",
};

export const Default: Story = {
  args: {
    ...defaultArgs,
  },
};

export const WithDJ: Story = {
  args: {
    ...defaultArgs,
    dj: "DJ Nexus",
  },
};

export const Live: Story = {
  args: {
    ...defaultArgs,
    dj: "DJ Nexus",
    isLive: true,
  },
};

export const NoImage: Story = {
  args: {
    ...defaultArgs,
    imageSrc: undefined,
  },
};

export const MultipleGenres: Story = {
  args: {
    ...defaultArgs,
    genre: ["House", "Techno", "Disco"],
    dj: "DJ Nexus",
  },
};

export const WithGoNow: Story = {
  args: {
    ...defaultArgs,
    dj: "DJ Nexus",
    isLive: true,
    genre: ["House", "Techno"],
    onGoNow: () => {},
  },
};
