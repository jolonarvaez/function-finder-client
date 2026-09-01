import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MapLinks } from "@/components/reusables/MapLinks";

const meta: Meta<typeof MapLinks> = {
  title: "Components/MapLinks",
  component: MapLinks,
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
type Story = StoryObj<typeof MapLinks>;

export const Default: Story = {
  args: { address: "The Bunker, BGC, Taguig, Metro Manila" },
};

/** Narrowed to a phone width — the three buttons must still fit on one line. */
export const MobileWidth: Story = {
  args: { address: "12 Jupiter St, Bel-Air, Makati, Metro Manila" },
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-107.5 bg-background p-4">
        <Story />
      </div>
    ),
  ],
};

/** No address to search on — the component renders nothing. */
export const NoAddress: Story = {
  args: { address: null },
};
