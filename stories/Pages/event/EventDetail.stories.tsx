import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { EventDetailContent } from "@/components/event/EventDetailView";
import type { ApiEvent, ApiUser } from "@/lib/services/events";

const MOCK_DJ: ApiUser = {
  id: "dj-001",
  first_name: "Marco",
  last_name: "Santos",
  display_name: "DJ Marco",
  bio: "Manila-based DJ specializing in house and techno.",
  genre_tags: ["House", "Techno"],
  country: "Philippines",
  socmed_links: { instagram: "djmarco" },
  profile_type: "dj",
  avatar_url: "https://placehold.co/400x600/1a1a2e/e0e0ff?text=Neon+Dreams",
};

const BASE_EVENT: ApiEvent = {
  id: "evt-001",
  name: "Neon Dreams",
  description: null,
  location: null,
  date: "2026-05-10",
  start_time: "22:00:00+08",
  end_time: "04:00:00+08",
  entry_price: 500,
  featured: true,
  category: "Nightclub",
  created_by: "dj-001",
  created_at: "2026-04-01T10:00:00Z",
  genres: ["House", "Techno"],
  custom_location: {
    latitude: 14.5547,
    longitude: 121.0244,
    address: "123 Ayala Ave, Makati City",
  },
  flyer_url: "https://placehold.co/400x600/1a1a2e/e0e0ff?text=Neon+Dreams",
  status: "upcoming",
  users: MOCK_DJ,
};

const LIVE_EVENT: ApiEvent = {
  ...BASE_EVENT,
  id: "evt-002",
  name: "Deep Cuts",
  date: new Date().toISOString().slice(0, 10),
  start_time: "00:00:00+08",
  end_time: "23:59:00+08",
  entry_price: null,
  genres: ["Soul", "RnB", "Disco"],
  category: "Lounge",
  custom_location: {
    latitude: 14.552,
    longitude: 121.022,
    address: "92 Polaris St, Makati City",
  },
  status: "live",
  users: { ...MOCK_DJ, display_name: "DJ Soleil", genre_tags: ["Soul", "RnB"] },
};

const PAST_EVENT: ApiEvent = {
  ...BASE_EVENT,
  id: "evt-003",
  name: "Concrete Jungle",
  date: "2026-01-15",
  start_time: "23:00:00+08",
  end_time: "06:00:00+08",
  entry_price: 300,
  genres: ["DnB", "Techno"],
  category: "Underground",
  featured: false,
  custom_location: null,
  location: "The Bunker, BGC",
  status: "done",
  users: { ...MOCK_DJ, display_name: "DJ Kade", genre_tags: ["DnB", "Techno"] },
};

const meta: Meta<typeof EventDetailContent> = {
  title: "Pages/Event/EventDetail",
  component: EventDetailContent,
  parameters: {
    layout: "fullscreen",
    nextjs: { appDirectory: true },
  },
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-107.5 overflow-hidden bg-background">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof EventDetailContent>;

export const Upcoming: Story = {
  args: { event: BASE_EVENT },
};

export const Live: Story = {
  args: { event: LIVE_EVENT },
};

export const Past: Story = {
  name: "Past (no image, no coordinates)",
  args: { event: PAST_EVENT },
};
