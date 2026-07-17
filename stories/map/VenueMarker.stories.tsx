import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Map } from "@/components/ui/map";
import { VenueMarker } from "@/components/map/VenueMarker";
import type { VenueEvent } from "@/components/map/VenueInfo";

const MAKATI_CENTER: [number, number] = [121.0244, 14.5547];

const today = new Date();
const todayISO = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

const MOCK_EVENT_UPCOMING: VenueEvent = {
  id: "mock-event-1",
  name: "Pulse",
  event_images: [
    {
      id: "img-1",
      event_id: "mock-event-1",
      url: "https://placehold.co/600x300/1a1a2e/e94560?text=Pulse+Nightclub",
      sort_order: 0,
    },
  ],
  address: "456 Downtown Ave, City Center",
  category: "Nightclub",
  date: todayISO,
  startTime: "23:00",
  endTime: "04:00",
  entryPrice: 15,
  featured: true,
  attending: 247,
  status: "upcoming",
  performers: [
    {
      name: "DJ Nexus",
      avatar: "https://placehold.co/80x80/3b82f6/fff?text=DN",
      genre: ["House", "Techno"],
      userId: "user_123",
    },
    {
      name: "Luna Waves",
      avatar: "https://placehold.co/80x80/e94560/fff?text=LW",
      genre: ["Disco"],
      userId: "user_456",
    },
  ],
  created_by: "user_123",
};

const MOCK_EVENT_LIVE: VenueEvent = {
  ...MOCK_EVENT_UPCOMING,
  startTime: "00:00",
  endTime: "23:59",
};

const meta: Meta<typeof VenueMarker> = {
  title: "Components/VenueMarker",
  component: VenueMarker,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof VenueMarker>;

export const Default: Story = {
  render: () => (
    <div style={{ width: "100%", height: "100vh" }}>
      <Map center={MAKATI_CENTER} zoom={14} className="h-full w-full">
        <VenueMarker longitude={MAKATI_CENTER[0]} latitude={MAKATI_CENTER[1]} />
      </Map>
    </div>
  ),
};

export const Live: Story = {
  render: () => (
    <div style={{ width: "100%", height: "100vh" }}>
      <Map center={MAKATI_CENTER} zoom={14} className="h-full w-full">
        <VenueMarker
          longitude={MAKATI_CENTER[0]}
          latitude={MAKATI_CENTER[1]}
          event={MOCK_EVENT_LIVE}
        />
      </Map>
    </div>
  ),
};

export const WithEvent: Story = {
  render: () => (
    <div style={{ width: "100%", height: "100vh" }}>
      <Map center={MAKATI_CENTER} zoom={14} className="h-full w-full">
        <VenueMarker
          longitude={MAKATI_CENTER[0]}
          latitude={MAKATI_CENTER[1]}
          event={MOCK_EVENT_UPCOMING}
        />
      </Map>
    </div>
  ),
};
