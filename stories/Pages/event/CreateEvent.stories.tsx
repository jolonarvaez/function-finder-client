import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CreateEventView } from "@/components/event/CreateEventView";

const meta: Meta<typeof CreateEventView> = {
  title: "Pages/Event/CreateEvent",
  component: CreateEventView,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="mx-auto w-full overflow-hidden bg-background">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CreateEventView>;

export const Default: Story = {};
