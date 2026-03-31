import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Map } from "@/components/ui/map";
import { VenueMarker } from "@/components/map/VenueMarker";
import type { VenueEvent } from "@/components/map/VenueInfo";

const MAKATI_CENTER: [number, number] = [121.0244, 14.5547];

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
    genre: ["House", "Techno"],
  },
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
        <VenueMarker longitude={MAKATI_CENTER[0]} latitude={MAKATI_CENTER[1]} live />
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
          live
          event={MOCK_EVENT}
        />
      </Map>
    </div>
  ),
};
