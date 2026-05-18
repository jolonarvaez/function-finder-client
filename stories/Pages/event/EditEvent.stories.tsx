import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { EditEventContent } from "@/components/event/EditEventView";
import type { ApiEvent } from "@/lib/services/events";

const BASE_EVENT: ApiEvent = {
  id: "evt-001",
  name: "Neon Dreams",
  location: null,
  date: "2026-06-15",
  start_time: "22:00:00+08",
  end_time: "04:00:00+08",
  entry_price: 500,
  featured: false,
  category: "Nightclub",
  created_by: "user-001",
  created_at: "2026-05-01T10:00:00Z",
  genres: ["House", "Techno"],
  custom_location: {
    latitude: 14.5547,
    longitude: 121.0244,
    address: "123 Ayala Ave, Makati City",
  },
  flyer_url: "https://placehold.co/400x600/1a1a2e/e0e0ff?text=Neon+Dreams",
  status: "upcoming",
  users: {
    id: "user-001",
    first_name: "Alex",
    last_name: "Santos",
    display_name: "DJ AXLS",
    bio: null,
    genre_tags: ["House", "Techno"],
    country: "PH",
    socmed_links: null,
    profile_type: "dj",
    avatar_url: "https://placehold.co/400x600/1a1a2e/e0e0ff?text=Neon+Dreams",
  },
};

const meta: Meta<typeof EditEventContent> = {
  title: "Pages/Event/EditEvent",
  component: EditEventContent,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    nextjs: { appDirectory: true },
  },
  decorators: [
    (Story) => (
      <div className="mx-auto w-full overflow-hidden bg-background">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof EditEventContent>;

export const Default: Story = {
  args: {
    eventId: "evt-001",
    event: BASE_EVENT,
  },
};

export const NoFlyer: Story = {
  name: "No flyer",
  args: {
    eventId: "evt-002",
    event: {
      ...BASE_EVENT,
      id: "evt-002",
      name: "Concrete Jungle",
      flyer_url: null,
      entry_price: null,
      genres: ["DnB", "Techno"],
    },
  },
};
