import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { VenueInfo, type VenueEvent } from "@/components/map/VenueInfo";
import { Button } from "@/components/ui/button";

const MOCK_EVENT: VenueEvent = {
  id: "mock-event-1",
  name: "Pulse",
  event_images: [
    {
      id: "img-1",
      event_id: "mock-event-1",
      url: "https://placehold.co/600x800/1a1a2e/e94560?text=Pulse+Flyer",
      sort_order: 0,
    },
    {
      id: "img-2",
      event_id: "mock-event-1",
      url: "https://placehold.co/600x800/2e1a1a/60e945?text=Pulse+Flyer+2",
      sort_order: 1,
    },
  ],
  address: "456 Downtown Ave, City Center",
  category: "Nightclub",
  genres: ["House", "Techno", "Disco"],
  startTime: "10PM",
  endTime: "4AM",
  entryPrice: 15,
  featured: true,
  attending: 247,
  status: "done",
  performers: [
    {
      name: "DJ Nexus",
      avatar: "https://placehold.co/80x80/3b82f6/fff?text=DN",
      genre: ["House", "Techno", "Disco"],
      userId: "user_123",
      setTime: "22:00 - 00:00",
    },
    {
      name: "Luna Waves",
      avatar: "https://placehold.co/80x80/e94560/fff?text=LW",
      genre: ["Disco"],
      userId: "user_456",
      setTime: "00:00 - 02:00",
    },
    {
      name: "Basskid",
      genre: ["Drum & Bass"],
      userId: "user_789",
    },
  ],
  created_by: "user_123",
};

function VenueInfoDemo({ event }: Readonly<{ event: VenueEvent }>) {
  const [open, setOpen] = React.useState(true);

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Open Venue Info</Button>
      <VenueInfo event={event} open={open} onOpenChange={setOpen} />
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
  render: () => <VenueInfoDemo event={MOCK_EVENT} />,
};

const MOCK_EVENT_NO_IMAGE: VenueEvent = {
  ...MOCK_EVENT,
  event_images: undefined,
};

export const NoImage: Story = {
  render: () => <VenueInfoDemo event={MOCK_EVENT_NO_IMAGE} />,
};

export const NoImageLive: Story = {
  render: () => <VenueInfoDemo event={MOCK_EVENT_NO_IMAGE} />,
};
