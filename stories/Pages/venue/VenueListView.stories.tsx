import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { VenueListView } from "@/components/VenueListView";
import type { MapVenue } from "@/components/map/MapView";

const MOCK_VENUES: MapVenue[] = [
  // ── Monday Mar 30 ──────────────────────────────────────────
  {
    lng: 121.021,
    lat: 14.559,
    distance: "0.5 km",
    event: {
      name: "The Vinyl Room",
      address: "3F Legaspi Towers, Makati",
      category: "Lounge",
      date: "2026-03-30",
      startTime: "8PM",
      endTime: "2AM",
      featured: false,
      attending: 54,
      dj: {
        name: "Smooth Mike",
        avatar: "https://placehold.co/80x80/f59e0b/fff?text=SM",
        genre: "Soul",
      },
      created_by: "user_123",
    },
  },
  {
    lng: 121.0275,
    lat: 14.5525,
    distance: "2.5 km",
    event: {
      name: "Sabor",
      image: "https://placehold.co/600x300/7f1d1d/fca5a5?text=Sabor",
      address: "42 Rada St, Makati",
      category: "Latin Club",
      date: "2026-03-30",
      startTime: "9PM",
      endTime: "3AM",
      entryPrice: 10,
      featured: false,
      attending: 145,
      dj: {
        name: "DJ Fuego",
        avatar: "https://placehold.co/80x80/ef4444/fff?text=DF",
        genre: "Latin",
      },
      created_by: "user_123",
    },
  },

  // ── Tuesday Mar 31 ─────────────────────────────────────────
  {
    lng: 121.022,
    lat: 14.5545,
    live: true,
    distance: "0.3 km",
    event: {
      name: "The Cypher",
      image: "https://placehold.co/600x300/1c1917/f97316?text=The+Cypher",
      address: "55 Burgos Circle, Makati",
      category: "Hip-Hop Bar",
      date: "2026-03-31",
      startTime: "9PM",
      endTime: "3AM",
      featured: false,
      attending: 132,
      dj: {
        name: "DJ Phonix",
        avatar: "https://placehold.co/80x80/ea580c/fff?text=DP",
        genre: ["Hip-Hop", "R&B"],
      },
      created_by: "user_123",
    },
  },
  {
    lng: 121.0185,
    lat: 14.556,
    distance: "2.1 km",
    event: {
      name: "Tribe",
      image: "https://placehold.co/600x300/422006/facc15?text=Tribe",
      address: "7 Nicanor Garcia St, Makati",
      category: "Club",
      date: "2026-03-31",
      startTime: "10PM",
      endTime: "4AM",
      entryPrice: 12,
      featured: false,
      attending: 165,
      dj: {
        name: "Kwame",
        avatar: "https://placehold.co/80x80/ca8a04/fff?text=KW",
        genre: "Afrobeats",
      },
      created_by: "user_123",
    },
  },

  // ── Wednesday Apr 1 ────────────────────────────────────────
  {
    lng: 121.0195,
    lat: 14.553,
    distance: "1.2 km",
    event: {
      name: "Noir Lounge",
      image: "https://placehold.co/600x300/0d0d0d/ffffff?text=Noir",
      address: "12 Jupiter St, Makati",
      category: "Bar",
      date: "2026-04-01",
      startTime: "9PM",
      endTime: "3AM",
      featured: false,
      attending: 89,
      dj: {
        name: "Mara Santos",
        avatar: "https://placehold.co/80x80/9333ea/fff?text=MS",
        genre: "Techno",
      },
      created_by: "user_123",
    },
  },
  {
    lng: 121.0235,
    lat: 14.5515,
    distance: "0.6 km",
    event: {
      name: "Neon",
      image: "https://placehold.co/600x300/1e1b4b/a78bfa?text=Neon",
      address: "101 Paseo de Roxas, Makati",
      category: "Nightclub",
      date: "2026-04-01",
      startTime: "10PM",
      endTime: "5AM",
      entryPrice: 18,
      featured: true,
      attending: 280,
      dj: { name: "MIKA", avatar: "https://placehold.co/80x80/7c3aed/fff?text=MK", genre: "Pop" },
      created_by: "user_123",
    },
  },

  // ── Thursday Apr 2 (today) ─────────────────────────────────
  {
    lng: 121.0244,
    lat: 14.5567,
    live: true,
    distance: "0.8 km",
    event: {
      name: "Pulse",
      image: "https://placehold.co/600x300/1a1a2e/e94560?text=Pulse",
      address: "456 Downtown Ave, Makati",
      category: "Nightclub",
      date: "2026-04-02",
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
      created_by: "user_123",
    },
  },
  {
    lng: 121.027,
    lat: 14.5555,
    live: true,
    distance: "1.0 km",
    event: {
      name: "Bass District",
      image: "https://placehold.co/600x300/1e3a5f/38bdf8?text=Bass+District",
      address: "27 Kalayaan Ave, Makati",
      category: "Underground",
      date: "2026-04-02",
      startTime: "11PM",
      endTime: "6AM",
      entryPrice: 10,
      featured: true,
      attending: 178,
      dj: {
        name: "PRISM",
        avatar: "https://placehold.co/80x80/06b6d4/fff?text=PR",
        genre: "Drum & Bass",
      },
      created_by: "user_123",
    },
  },

  // ── Friday Apr 3 ───────────────────────────────────────────
  {
    lng: 121.029,
    lat: 14.551,
    live: true,
    distance: "1.5 km",
    event: {
      name: "Fuego",
      image: "https://placehold.co/600x300/7c2d12/fbbf24?text=Fuego",
      address: "88 Rockwell Dr, Makati",
      category: "Club",
      date: "2026-04-03",
      startTime: "11PM",
      endTime: "5AM",
      entryPrice: 20,
      featured: true,
      attending: 312,
      dj: {
        name: "DJ Caliente",
        avatar: "https://placehold.co/80x80/dc2626/fff?text=DC",
        genre: ["Reggaeton", "Latin", "Dancehall"],
      },
      created_by: "user_123",
    },
  },
  {
    lng: 121.026,
    lat: 14.558,
    distance: "1.8 km",
    event: {
      name: "Velvet",
      image: "https://placehold.co/600x300/4a1942/f472b6?text=Velvet",
      address: "18 Salcedo St, Makati",
      category: "Lounge",
      date: "2026-04-03",
      startTime: "8PM",
      endTime: "2AM",
      featured: true,
      attending: 98,
      dj: { name: "Soulée", avatar: "https://placehold.co/80x80/ec4899/fff?text=SL", genre: "R&B" },
      created_by: "user_123",
    },
  },

  // ── Saturday Apr 4 ─────────────────────────────────────────
  {
    lng: 121.03,
    lat: 14.554,
    live: true,
    distance: "1.4 km",
    event: {
      name: "Yard",
      image: "https://placehold.co/600x300/14532d/4ade80?text=Yard",
      address: "33 Amorsolo St, Makati",
      category: "Outdoor Bar",
      date: "2026-04-04",
      startTime: "7PM",
      endTime: "1AM",
      featured: false,
      attending: 74,
      dj: {
        name: "Selecta Jay",
        avatar: "https://placehold.co/80x80/16a34a/fff?text=SJ",
        genre: "Dancehall",
      },
      created_by: "user_123",
    },
  },

  // ── Sunday Apr 5 ───────────────────────────────────────────
  {
    lng: 121.0205,
    lat: 14.55,
    live: true,
    distance: "1.7 km",
    event: {
      name: "Studio 54 MNL",
      image: "https://placehold.co/600x300/451a03/fbbf24?text=Studio+54",
      address: "8 Leviste St, Makati",
      category: "Retro Club",
      date: "2026-04-05",
      startTime: "10PM",
      endTime: "4AM",
      entryPrice: 15,
      featured: true,
      attending: 203,
      dj: {
        name: "Groove Master G",
        avatar: "https://placehold.co/80x80/d97706/fff?text=GM",
        genre: ["Disco", "Soul", "House"],
      },
      created_by: "user_123",
    },
  },
];

const meta: Meta<typeof VenueListView> = {
  title: "Pages/Venue/VenueListView",
  component: VenueListView,
  tags: ["autodocs"],
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
type Story = StoryObj<typeof VenueListView>;

export const Default: Story = {
  args: {
    venues: MOCK_VENUES,
    defaultDate: new Date("2026-04-02"),
  },
};

export const Monday: Story = {
  args: { venues: MOCK_VENUES, defaultDate: new Date("2026-03-30") },
};

export const Tuesday: Story = {
  args: { venues: MOCK_VENUES, defaultDate: new Date("2026-03-31") },
};

export const Wednesday: Story = {
  args: { venues: MOCK_VENUES, defaultDate: new Date("2026-04-01") },
};

export const Thursday: Story = {
  args: { venues: MOCK_VENUES, defaultDate: new Date("2026-04-02") },
};

export const Friday: Story = {
  args: { venues: MOCK_VENUES, defaultDate: new Date("2026-04-03") },
};

export const Saturday: Story = {
  args: { venues: MOCK_VENUES, defaultDate: new Date("2026-04-04") },
};

export const Sunday: Story = {
  args: { venues: MOCK_VENUES, defaultDate: new Date("2026-04-05") },
};

export const Empty: Story = {
  args: {
    venues: [],
  },
};
