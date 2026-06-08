import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LocationPicker } from "@/components/event/event-form/LocationPicker";

const noop = () => {};

const MAKATI = { lng: 121.0244, lat: 14.5547 };
const BGC = { lng: 121.0509, lat: 14.5503 };
const MANILA = { lng: 120.9842, lat: 14.5995 };

const meta: Meta<typeof LocationPicker> = {
  title: "Components/Event/EventForm/LocationPicker",
  component: LocationPicker,
  tags: ["autodocs"],
  args: {
    onCoordinatesChange: noop,
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
type Story = StoryObj<typeof LocationPicker>;

export const Default: Story = {
  name: "Default — Makati center",
  args: {
    coordinates: MAKATI,
  },
};

export const BGCLocation: Story = {
  name: "BGC, Taguig",
  args: {
    coordinates: BGC,
  },
};

export const ManilaLocation: Story = {
  name: "Manila city center",
  args: {
    coordinates: MANILA,
  },
};

export const Interactive: Story = {
  name: "Interactive (drag pin)",
  render: () => {
    const [coords, setCoords] = React.useState(MAKATI);
    return (
      <div className="space-y-3">
        <LocationPicker coordinates={coords} onCoordinatesChange={setCoords} />
        <p className="text-xs text-muted-foreground tabular-nums">
          lng {coords.lng.toFixed(5)} · lat {coords.lat.toFixed(5)}
        </p>
      </div>
    );
  },
};
