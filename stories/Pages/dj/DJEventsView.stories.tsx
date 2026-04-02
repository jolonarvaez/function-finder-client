import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DJEventsView, type DJEvent } from "@/components/dj/DJEventsView";

// Today is 2026-04-02 (Thursday)
const MOCK_EVENTS: DJEvent[] = [
  // ── Past ─────────────────────────────────────────────────
  {
    id: "1",
    name: "Night Fever",
    venue: "Fuego",
    address: "78 Jupiter St, Makati",
    category: "Club",
    date: "2026-03-28",
    startTime: "22:00",
    endTime: "04:00",
    entryPrice: 20,
    genres: ["House", "Disco"],
    coordinates: { lng: 121.0275, lat: 14.5575 },
  },
  {
    id: "2",
    name: "Deep Cuts",
    venue: "The Vinyl Room",
    address: "92 Polaris St, Makati",
    category: "Lounge",
    date: "2026-03-31",
    startTime: "21:00",
    endTime: "03:00",
    genres: ["Soul", "R&B"],
    coordinates: { lng: 121.022, lat: 14.552 },
  },

  // ── Live (today, within 10PM–4AM window) ─────────────────
  {
    id: "3",
    name: "Neon Dreams",
    venue: "Pulse",
    address: "123 Ayala Ave, Makati",
    category: "Nightclub",
    date: "2026-04-02",
    startTime: "22:00",
    endTime: "04:00",
    entryPrice: 15,
    genres: ["Techno", "House"],
    coordinates: { lng: 121.0244, lat: 14.5547 },
  },

  // ── Upcoming ─────────────────────────────────────────────
  {
    id: "4",
    name: "Concrete Jungle",
    venue: "Bass District",
    address: "15 Salcedo St, Makati",
    category: "Underground",
    date: "2026-04-05",
    startTime: "23:00",
    endTime: "06:00",
    entryPrice: 10,
    genres: ["Drum & Bass", "Techno"],
    coordinates: { lng: 121.0215, lat: 14.5605 },
  },
  {
    id: "5",
    name: "Wavelength",
    venue: "Noir Lounge",
    address: "45 P. Burgos St, Makati",
    category: "Bar",
    date: "2026-04-10",
    startTime: "21:00",
    endTime: "03:00",
    genres: ["Hip-Hop", "R&B", "Afrobeats"],
    coordinates: { lng: 121.026, lat: 14.5533 },
  },
  {
    id: "6",
    name: "Resonance",
    venue: "Elysium",
    address: "201 Makati Ave, Makati",
    category: "Nightclub",
    date: "2026-04-18",
    startTime: "22:00",
    endTime: "05:00",
    entryPrice: 25,
    genres: ["House", "Techno", "Disco"],
    coordinates: { lng: 121.028, lat: 14.555 },
  },
];

const UPCOMING_ONLY: DJEvent[] = MOCK_EVENTS.filter((e) => e.date >= "2026-04-03");
const PAST_ONLY: DJEvent[] = MOCK_EVENTS.filter((e) => e.date < "2026-04-02");

const meta: Meta<typeof DJEventsView> = {
  title: "Pages/DJEventManager",
  component: DJEventsView,
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
type Story = StoryObj<typeof DJEventsView>;

export const Default: Story = {
  args: { events: MOCK_EVENTS },
};

export const UpcomingOnly: Story = {
  name: "Upcoming only",
  args: { events: UPCOMING_ONLY },
};

export const PastOnly: Story = {
  name: "Past only",
  args: { events: PAST_ONLY },
};

export const Empty: Story = {
  args: { events: [] },
};
