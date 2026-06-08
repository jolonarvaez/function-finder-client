import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { EventImageGallery } from "@/components/event/EventImageGallery";

const make = (n: number) =>
  Array.from({ length: n }, (_, i) => ({
    id: `img-${i}`,
    event_id: "evt-001",
    url: `https://placehold.co/800x600/${["1a1a2e", "0d1b2a", "1c1c1c", "0a2a1a", "2a1a0a"][i % 5]!}/${["e0e0ff", "f4c542", "cc3333", "44cc88", "cc8844"][i % 5]!}?text=Image+${i + 1}`,
    sort_order: i,
  }));

const meta: Meta<typeof EventImageGallery> = {
  title: "Components/Event/EventImageGallery",
  component: EventImageGallery,
  tags: ["autodocs"],
  args: {
    alt: "Event image",
  },
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-200 bg-background p-6">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof EventImageGallery>;

export const SingleImage: Story = {
  name: "Single image",
  args: {
    event: { event_images: make(1) },
  },
};

export const TwoImages: Story = {
  name: "Two images",
  args: {
    event: { event_images: make(2) },
  },
};

export const FiveImages: Story = {
  name: "Five images",
  args: {
    event: { event_images: make(5) },
  },
};

export const NoImages: Story = {
  name: "No images (renders nothing)",
  args: {
    event: { event_images: [] },
  },
};
