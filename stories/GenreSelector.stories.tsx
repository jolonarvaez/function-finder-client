import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { GenreSelector, type Genre } from "@/components/GenreSelector";

const meta: Meta<typeof GenreSelector> = {
  title: "Components/Filters/GenreSelector",
  component: GenreSelector,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-200 bg-background p-6">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof GenreSelector>;

export const Default: Story = {
  render: () => {
    const [selected, setSelected] = React.useState<Genre[]>([]);
    return <GenreSelector selected={selected} onChange={setSelected} />;
  },
};

export const WithPreselected: Story = {
  render: () => {
    const [selected, setSelected] = React.useState<Genre[]>([
      "House",
      "Techno",
      "Drum & Bass",
    ]);
    return <GenreSelector selected={selected} onChange={setSelected} />;
  },
};
