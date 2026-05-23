import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { EventsContent } from "@/components/event/EventsView";
import type { ApiEvent, ApiUser } from "@/lib/services/events";

const MOCK_DJ: ApiUser = {
  id: "dj-001",
  first_name: "Marco",
  last_name: "Santos",
  display_name: "DJ Marco",
  bio: null,
  genre_tags: ["House", "Techno"],
  country: "Philippines",
  socmed_links: null,
  profile_type: "dj",
  avatar_url: null,
};

const BASE: ApiEvent = {
  id: "evt-001",
  name: "Neon Dreams",
  location: null,
  date: "2026-06-14",
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
  flyer_url: "https://placehold.co/400x533/1a1a2e/e0e0ff?text=Neon+Dreams",
  status: "upcoming",
  users: MOCK_DJ,
};

const MOCK_EVENTS: ApiEvent[] = [
  BASE,
  {
    ...BASE,
    id: "evt-002",
    name: "Deep Cuts",
    date: new Date().toISOString().slice(0, 10),
    start_time: "00:00:00+08",
    end_time: "23:59:00+08",
    entry_price: null,
    genres: ["Soul", "RnB", "Disco"],
    category: "Lounge",
    flyer_url: null,
    status: "live",
    custom_location: {
      latitude: 14.552,
      longitude: 121.022,
      address: "92 Polaris St, Makati City",
    },
    users: { ...MOCK_DJ, display_name: "DJ Soleil", genre_tags: ["Soul", "RnB"] },
  },
  {
    ...BASE,
    id: "evt-003",
    name: "Concrete Jungle",
    date: "2026-07-05",
    start_time: "23:00:00+08",
    end_time: "06:00:00+08",
    entry_price: 300,
    genres: ["DnB", "Techno"],
    category: "Underground",
    flyer_url: "https://placehold.co/400x533/0a0a0a/cc3333?text=Concrete+Jungle",
    status: "upcoming",
    custom_location: {
      latitude: 14.5605,
      longitude: 121.0215,
      address: "15 Salcedo St, Makati City",
    },
    users: { ...MOCK_DJ, display_name: "DJ Kade", genre_tags: ["DnB", "Techno"] },
  },
  {
    ...BASE,
    id: "evt-004",
    name: "Wavelength",
    date: "2026-07-10",
    start_time: "21:00:00+08",
    end_time: "03:00:00+08",
    entry_price: null,
    genres: ["Hip-Hop", "RnB", "Afrobeats"],
    category: "Bar",
    flyer_url: null,
    status: "upcoming",
    custom_location: null,
    location: "Noir Lounge, BGC",
    users: { ...MOCK_DJ, display_name: "DJ Aria", genre_tags: ["Hip-Hop", "Afrobeats"] },
  },
  {
    ...BASE,
    id: "evt-005",
    name: "Resonance",
    date: "2026-01-18",
    entry_price: 250,
    genres: ["House", "Techno", "Disco"],
    category: "Nightclub",
    flyer_url: "https://placehold.co/400x533/1c1c1c/888888?text=Resonance",
    status: "done",
    users: { ...MOCK_DJ, display_name: "DJ Nova", genre_tags: ["House", "Disco"] },
  },
];

const meta: Meta<typeof EventsContent> = {
  title: "Pages/Event/EventsView",
  component: EventsContent,
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
type Story = StoryObj<typeof EventsContent>;

export const Default: Story = {
  args: { events: MOCK_EVENTS },
};

export const Loading: Story = {
  args: { events: [], loading: true },
};

export const Empty: Story = {
  args: { events: [] },
};
