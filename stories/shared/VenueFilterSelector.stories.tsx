import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { VenueFilterSelector } from "@/components/shared/VenueFilterSelector";
import type { VenueFilter } from "@/lib/constants";

function VenueFilterSelectorDemo({ initial = "live-now" }: { initial?: VenueFilter }) {
  const [selected, setSelected] = React.useState<VenueFilter>(initial);
  return <VenueFilterSelector selected={selected} onChange={setSelected} />;
}

const meta: Meta<typeof VenueFilterSelector> = {
  title: "Components/Filters/VenueFilterSelector",
  component: VenueFilterSelector,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-xl bg-background p-6">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof VenueFilterSelector>;

export const Default: Story = {
  render: () => <VenueFilterSelectorDemo />,
};

export const Nearest: Story = {
  render: () => <VenueFilterSelectorDemo initial="nearest" />,
};

export const BestMatch: Story = {
  render: () => <VenueFilterSelectorDemo initial="best-match" />,
};
