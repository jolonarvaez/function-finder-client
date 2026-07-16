import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { EventForm } from "@/components/event/event-form/EventForm";
import { useUserStore } from "@/components/auth/use-user-store";
import type { ApiEvent, ApiPerformer } from "@/lib/services/events";
import type { UserProfile } from "@/lib/services/users";
import type { Genre } from "@/lib/constants";

const MOCK_PROFILE: UserProfile = {
  id: "user-001",
  first_name: "Alex",
  last_name: "Santos",
  display_name: "DJ AXLS",
  bio: null,
  genre_tags: ["House", "Techno"] as Genre[],
  country: "PH",
  socmed_links: null,
  profile_type: "dj",
  avatar_url: null,
};

const MOCK_PERFORMERS: ApiPerformer[] = [
  // The creator is also the first performer.
  {
    ...MOCK_PROFILE,
    profile_type: "dj",
    set_start_time: "22:00:00+08:00",
    set_end_time: "00:00:00+08:00",
  },
  {
    id: "dj-002",
    first_name: "Marco",
    last_name: "Reyes",
    display_name: "DJ Marco",
    bio: null,
    genre_tags: ["House"],
    country: "PH",
    socmed_links: null,
    profile_type: "dj",
    avatar_url: "https://placehold.co/96x96/1a1a2e/e0e0ff?text=M",
    set_start_time: "00:00:00+08:00",
    set_end_time: "04:00:00+08:00",
  },
];

const MOCK_EVENT: ApiEvent = {
  id: "evt-001",
  name: "Neon Dreams",
  description: "An immersive night of house and techno deep in the heart of Makati.",
  location: null,
  date: "2026-07-19",
  start_time: "22:00:00+08",
  end_time: "04:00:00+08",
  entry_price: 500,
  featured: false,
  category: "Nightclub",
  created_by: "user-001",
  created_at: "2026-06-01T10:00:00Z",
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
      url: "https://placehold.co/400x600/1a1a2e/e0e0ff?text=Neon+Dreams",
      sort_order: 0,
    },
    {
      id: "img-002",
      event_id: "evt-001",
      url: "https://placehold.co/400x600/0d1b2a/f4c542?text=Stage+Shot",
      sort_order: 1,
    },
  ],
  status: "upcoming",
  users: { ...MOCK_PROFILE, profile_type: "dj" },
  performers: MOCK_PERFORMERS,
};

const meta: Meta<typeof EventForm> = {
  title: "Pages/Event/EventForm",
  component: EventForm,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    nextjs: { appDirectory: true },
  },
  args: {
    onSubmit: async () => {},
  },
  decorators: [
    (Story) => {
      // Seed the user store so create mode pre-adds the creator to the lineup.
      useUserStore.setState({ profile: MOCK_PROFILE });
      return (
        <div className="mx-auto w-full max-w-107.5 overflow-hidden bg-background">
          <Story />
        </div>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof EventForm>;

export const CreateMode: Story = {
  name: "Create mode — empty",
  args: {
    mode: "create",
  },
};

export const EditMode: Story = {
  name: "Edit mode — prefilled",
  args: {
    mode: "edit",
    initialEvent: MOCK_EVENT,
  },
};

export const EditModeLegacyPerformers: Story = {
  name: "Edit mode — legacy (no performers)",
  args: {
    mode: "edit",
    initialEvent: {
      ...MOCK_EVENT,
      id: "evt-004",
      name: "Warehouse Sessions",
      performers: undefined,
    },
  },
};

export const EditModeNoImages: Story = {
  name: "Edit mode — no images",
  args: {
    mode: "edit",
    initialEvent: {
      ...MOCK_EVENT,
      id: "evt-002",
      name: "Concrete Jungle",
      description: null,
      entry_price: null,
      genres: ["DnB", "Techno"],
      category: "Underground",
      event_images: [],
    },
  },
};

export const EditModeAtImageCapacity: Story = {
  name: "Edit mode — 5 images (capacity)",
  args: {
    mode: "edit",
    initialEvent: {
      ...MOCK_EVENT,
      id: "evt-003",
      name: "Deep Cuts",
      event_images: [
        {
          id: "img-1",
          event_id: "evt-003",
          url: "https://placehold.co/400x600/1a1a2e/e0e0ff?text=1",
          sort_order: 0,
        },
        {
          id: "img-2",
          event_id: "evt-003",
          url: "https://placehold.co/400x600/0d1b2a/f4c542?text=2",
          sort_order: 1,
        },
        {
          id: "img-3",
          event_id: "evt-003",
          url: "https://placehold.co/400x600/1c1c1c/cc3333?text=3",
          sort_order: 2,
        },
        {
          id: "img-4",
          event_id: "evt-003",
          url: "https://placehold.co/400x600/0a2a1a/44cc88?text=4",
          sort_order: 3,
        },
        {
          id: "img-5",
          event_id: "evt-003",
          url: "https://placehold.co/400x600/2a1a0a/cc8844?text=5",
          sort_order: 4,
        },
      ],
    },
  },
};
