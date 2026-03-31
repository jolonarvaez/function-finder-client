import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MapView } from "@/components/map/MapView";

const meta: Meta<typeof MapView> = {
  title: "Pages/Map/MapView",
  component: MapView,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
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
type Story = StoryObj<typeof MapView>;

export const Default: Story = {};
