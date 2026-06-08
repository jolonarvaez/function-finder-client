import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { StagedImagePicker } from "@/components/event/event-form/StagedImagePicker";

const noop = () => {};

const PLACEHOLDER_IMAGES = [
  "https://placehold.co/400x400/1a1a2e/e0e0ff?text=Image+1",
  "https://placehold.co/400x400/0d1b2a/f4c542?text=Image+2",
  "https://placehold.co/400x400/1c1c1c/cc3333?text=Image+3",
  "https://placehold.co/400x400/0a2a1a/44cc88?text=Image+4",
  "https://placehold.co/400x400/2a1a0a/cc8844?text=Image+5",
];

const meta: Meta<typeof StagedImagePicker> = {
  title: "Components/Event/EventForm/StagedImagePicker",
  component: StagedImagePicker,
  tags: ["autodocs"],
  args: {
    onAdd: noop,
    onRemove: noop,
    onSetCover: noop,
    onReorder: noop,
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
type Story = StoryObj<typeof StagedImagePicker>;

export const Empty: Story = {
  name: "Empty — no images",
  args: {
    previews: [],
  },
};

export const SingleCover: Story = {
  name: "Single image (cover)",
  args: {
    previews: [PLACEHOLDER_IMAGES[0]!],
  },
};

export const MultipleImages: Story = {
  name: "Multiple images",
  args: {
    previews: PLACEHOLDER_IMAGES.slice(0, 3),
  },
};

export const AtCapacity: Story = {
  name: "At capacity (5 / 5)",
  args: {
    previews: PLACEHOLDER_IMAGES,
  },
};

export const Interactive: Story = {
  render: () => {
    const [previews, setPreviews] = React.useState(PLACEHOLDER_IMAGES.slice(0, 2));

    function handleRemove(index: number) {
      setPreviews((prev) => prev.filter((_, i) => i !== index));
    }

    function handleSetCover(index: number) {
      setPreviews((prev) => {
        const next = [...prev];
        const [item] = next.splice(index, 1);
        next.unshift(item!);
        return next;
      });
    }

    function handleReorder(from: number, to: number) {
      setPreviews((prev) => {
        const next = [...prev];
        const [item] = next.splice(from, 1);
        next.splice(to, 0, item!);
        return next;
      });
    }

    return (
      <StagedImagePicker
        previews={previews}
        onAdd={noop}
        onRemove={handleRemove}
        onSetCover={handleSetCover}
        onReorder={handleReorder}
      />
    );
  },
};
