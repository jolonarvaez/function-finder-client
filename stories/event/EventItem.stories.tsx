import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { EventItem } from "@/components/event/EventItem";
import type { ApiEvent, ApiEventPerformer, ApiUser } from "@/lib/services/events";

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
  avatar_url: null,
};

function toLineup(user: ApiUser): ApiEventPerformer[] {
  return toLineupMulti([user]);
}

function toLineupMulti(users: ApiUser[]): ApiEventPerformer[] {
  return users.map((user, index) => ({
    id: `ep-${user.id}`,
    event_id: "evt-001",
    user_id: user.id,
    performance_order: index,
    set_start_time: null,
    set_end_time: null,
    created_at: "2026-04-01T10:00:00Z",
    status: "pending",
    users: user,
  }));
}

const MOCK_LINEUP: ApiUser[] = [
  MOCK_DJ,
  { ...MOCK_DJ, id: "dj-002", display_name: "DJ Soleil", genre_tags: ["Soul", "RnB"] },
  { ...MOCK_DJ, id: "dj-003", display_name: "DJ Kade", genre_tags: ["DnB", "Techno"] },
  { ...MOCK_DJ, id: "dj-004", display_name: "DJ Aria", genre_tags: ["Hip-Hop", "Afrobeats"] },
  { ...MOCK_DJ, id: "dj-005", display_name: "DJ Nova", genre_tags: ["House", "Disco"] },
];

const BASE_EVENT: ApiEvent = {
  id: "evt-001",
  name: "Neon Dreams",
  description: null,
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
  event_images: [
    {
      id: "img-001",
      event_id: "evt-001",
      url: "https://placehold.co/400x533/1a1a2e/e0e0ff?text=Neon+Dreams",
      sort_order: 0,
    },
  ],
  status: "upcoming",
  flyer_url: null,
  event_performers: toLineup(MOCK_DJ),
};

const meta: Meta<typeof EventItem> = {
  title: "Components/EventItem",
  component: EventItem,
  parameters: {
    layout: "padded",
    nextjs: { appDirectory: true },
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
type Story = StoryObj<typeof EventItem>;

export const WithImage: Story = {
  name: "With image — Upcoming",
  args: { event: BASE_EVENT },
};

export const WithImageLive: Story = {
  name: "With image — Live",
  args: {
    event: {
      ...BASE_EVENT,
      id: "evt-002",
      name: "Deep Cuts",
      date: new Date().toISOString().slice(0, 10),
      start_time: "00:00:00+08",
      end_time: "23:59:00+08",
      entry_price: null,
      genres: ["Soul", "RnB", "Disco"],
      category: "Lounge",
      event_images: [
        {
          id: "img-002",
          event_id: "evt-002",
          url: "https://placehold.co/400x533/0d1b2a/f4c542?text=Deep+Cuts",
          sort_order: 0,
        },
      ],
      status: "live",
      custom_location: {
        latitude: 14.552,
        longitude: 121.022,
        address: "92 Polaris St, Makati City",
      },
      event_performers: toLineup({ ...MOCK_DJ, display_name: "DJ Soleil" }),
    },
  },
};

export const NoImage: Story = {
  name: "No image — Upcoming",
  args: {
    event: {
      ...BASE_EVENT,
      id: "evt-003",
      name: "Concrete Jungle",
      date: "2026-07-05",
      start_time: "23:00:00+08",
      end_time: "06:00:00+08",
      entry_price: 300,
      genres: ["DnB", "Techno"],
      category: "Underground",
      event_images: [],
      status: "upcoming",
      custom_location: {
        latitude: 14.5605,
        longitude: 121.0215,
        address: "15 Salcedo St, Makati City",
      },
      event_performers: toLineup({ ...MOCK_DJ, display_name: "DJ Kade" }),
    },
  },
};

export const NoImageLive: Story = {
  name: "No image — Live",
  args: {
    event: {
      ...BASE_EVENT,
      id: "evt-004",
      name: "Wavelength",
      date: new Date().toISOString().slice(0, 10),
      start_time: "00:00:00+08",
      end_time: "23:59:00+08",
      entry_price: null,
      genres: ["Hip-Hop", "RnB", "Afrobeats"],
      category: "Bar",
      event_images: [],
      status: "live",
      custom_location: null,
      location: "Noir Lounge, BGC",
      event_performers: toLineup({ ...MOCK_DJ, display_name: "DJ Aria" }),
    },
  },
};

export const Done: Story = {
  name: "Done (past)",
  args: {
    event: {
      ...BASE_EVENT,
      id: "evt-005",
      name: "Resonance",
      date: "2026-01-18",
      entry_price: 250,
      genres: ["House", "Techno", "Disco"],
      category: "Nightclub",
      event_images: [
        {
          id: "img-005",
          event_id: "evt-005",
          url: "https://placehold.co/400x533/1c1c1c/888888?text=Resonance",
          sort_order: 0,
        },
      ],
      status: "done",
      custom_location: {
        latitude: 14.555,
        longitude: 121.028,
        address: "201 Makati Ave, Makati City",
      },
      event_performers: toLineup({ ...MOCK_DJ, display_name: "DJ Nova" }),
    },
  },
};

export const MultiplePerformers: Story = {
  name: "Multiple performers",
  args: {
    event: {
      ...BASE_EVENT,
      id: "evt-006",
      name: "B2B Sessions",
      genres: ["House", "Techno", "DnB", "Soul", "Disco"],
      event_performers: toLineupMulti(MOCK_LINEUP),
    },
  },
};

export const List: Story = {
  name: "List — multiple cards",
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-200 bg-background p-6">
        <div className="space-y-4">
          <Story />
        </div>
      </div>
    ),
  ],
  render: () => (
    <>
      <EventItem event={BASE_EVENT} />
      <EventItem
        event={{
          ...BASE_EVENT,
          id: "evt-list-2",
          name: "Deep Cuts",
          date: new Date().toISOString().slice(0, 10),
          start_time: "00:00:00+08",
          end_time: "23:59:00+08",
          entry_price: null,
          genres: ["Soul", "RnB"],
          category: "Lounge",
          event_images: [],
          status: "live",
          custom_location: {
            latitude: 14.552,
            longitude: 121.022,
            address: "92 Polaris St, Makati City",
          },
          event_performers: toLineup({ ...MOCK_DJ, display_name: "DJ Soleil" }),
        }}
      />
      <EventItem
        event={{
          ...BASE_EVENT,
          id: "evt-list-3",
          name: "Concrete Jungle",
          date: "2026-07-05",
          entry_price: 300,
          genres: ["DnB", "Techno"],
          category: "Underground",
          event_images: [
            {
              id: "img-l3",
              event_id: "evt-list-3",
              url: "https://placehold.co/400x533/0a0a0a/cc3333?text=Concrete+Jungle",
              sort_order: 0,
            },
          ],
          status: "upcoming",
          event_performers: toLineup({ ...MOCK_DJ, display_name: "DJ Kade" }),
        }}
      />
    </>
  ),
};
