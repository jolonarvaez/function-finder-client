import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PosterAutofill } from "@/components/event/event-form/PosterAutofill";

const noop = () => {};

const POSTER_PREVIEW = "https://placehold.co/400x560/1a1a2e/e0e0ff?text=Poster";

const meta: Meta<typeof PosterAutofill> = {
  title: "Components/Event/EventForm/PosterAutofill",
  component: PosterAutofill,
  tags: ["autodocs"],
  args: {
    onSelect: noop,
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
type Story = StoryObj<typeof PosterAutofill>;

export const Idle: Story = {
  args: {
    status: "idle",
  },
};

export const Extracting: Story = {
  args: {
    status: "extracting",
    preview: POSTER_PREVIEW,
  },
};

export const Done: Story = {
  args: {
    status: "done",
    preview: POSTER_PREVIEW,
  },
};

export const DoneWithPastDate: Story = {
  name: "Done — poster date has passed",
  args: {
    status: "done",
    preview: POSTER_PREVIEW,
    notice: "The date on this poster has passed. Pick a new one.",
  },
};

export const Failed: Story = {
  name: "Error",
  args: {
    status: "error",
    preview: POSTER_PREVIEW,
    error: "We couldn't read that poster. Try again, or fill in the form manually.",
  },
};
