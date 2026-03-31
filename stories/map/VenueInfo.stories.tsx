import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { VenueInfo, type VenueEvent } from "@/components/map/VenueInfo";
import { Button } from "@/components/ui/button";

const MOCK_EVENT: VenueEvent = {
  name: "Pulse",
  image: "https://placehold.co/600x300/1a1a2e/e94560?text=Pulse+Nightclub",
  address: "456 Downtown Ave, City Center",
  category: "Nightclub",
  startTime: "10PM",
  endTime: "4AM",
  entryPrice: 15,
  featured: true,
  attending: 247,
  dj: {
    name: "DJ Nexus",
    avatar: "https://placehold.co/80x80/3b82f6/fff?text=DN",
    genre: ["House", "Techno", "Disco"],
  },
};

function VenueInfoDemo({ event, live }: Readonly<{ event: VenueEvent; live?: boolean }>) {
  const [open, setOpen] = React.useState(true);

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Open Venue Info</Button>
      <VenueInfo event={event} live={live} open={open} onOpenChange={setOpen} />
    </div>
  );
}

const meta: Meta<typeof VenueInfo> = {
  title: "Components/VenueInfo",
  component: VenueInfo,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-107.5 overflow-hidden bg-background p-6">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof VenueInfo>;

export const Default: Story = {
  render: () => <VenueInfoDemo event={MOCK_EVENT} />,
};

export const Live: Story = {
  render: () => <VenueInfoDemo event={MOCK_EVENT} live />,
};

const MOCK_EVENT_NO_IMAGE: VenueEvent = {
  ...MOCK_EVENT,
  image: undefined,
};

export const NoImage: Story = {
  render: () => <VenueInfoDemo event={MOCK_EVENT_NO_IMAGE} />,
};

export const NoImageLive: Story = {
  render: () => <VenueInfoDemo event={MOCK_EVENT_NO_IMAGE} live />,
};
