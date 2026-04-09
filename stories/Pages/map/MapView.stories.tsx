import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MapView, type MapEvents } from "@/components/map/MapView";

// ── Relative date helpers ─────────────────────────────────────

function offsetDate(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const TODAY = offsetDate(0);
const YESTERDAY = offsetDate(-1);
const TWO_DAYS_AGO = offsetDate(-2);
const TOMORROW = offsetDate(1);
const TWO_DAYS_OUT = offsetDate(2);
const THREE_DAYS_OUT = offsetDate(3);

// ── Mock venues ───────────────────────────────────────────────

const MOCK_VENUES: MapEvents[] = [
  // ── Past (2 days ago) ──────────────────────────────────────
  {
    lng: 121.021,
    lat: 14.559,
    event: {
      name: "The Vinyl Room",
      address: "3F Legaspi Towers, Makati",
      category: "Lounge",
      date: TWO_DAYS_AGO,
      startTime: "20:00",
      endTime: "02:00",
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
    event: {
      name: "Sabor",
      image: "https://placehold.co/600x300/7f1d1d/fca5a5?text=Sabor",
      address: "42 Rada St, Makati",
      category: "Latin Club",
      date: TWO_DAYS_AGO,
      startTime: "21:00",
      endTime: "03:00",
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

  // ── Past (yesterday) ───────────────────────────────────────
  {
    lng: 121.022,
    lat: 14.5545,
    event: {
      name: "The Cypher",
      image: "https://placehold.co/600x300/1c1917/f97316?text=The+Cypher",
      address: "55 Burgos Circle, Makati",
      category: "Hip-Hop Bar",
      date: YESTERDAY,
      startTime: "21:00",
      endTime: "03:00",
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
    event: {
      name: "Tribe",
      image: "https://placehold.co/600x300/422006/facc15?text=Tribe",
      address: "7 Nicanor Garcia St, Makati",
      category: "Club",
      date: YESTERDAY,
      startTime: "22:00",
      endTime: "04:00",
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

  // ── Live (today, all-day window) ───────────────────────────
  {
    lng: 121.0244,
    lat: 14.5567,
    event: {
      name: "Pulse",
      image: "https://placehold.co/600x300/1a1a2e/e94560?text=Pulse",
      address: "456 Downtown Ave, Makati",
      category: "Nightclub",
      date: TODAY,
      startTime: "00:00",
      endTime: "23:59",
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
    event: {
      name: "Bass District",
      image: "https://placehold.co/600x300/1e3a5f/38bdf8?text=Bass+District",
      address: "27 Kalayaan Ave, Makati",
      category: "Underground",
      date: TODAY,
      startTime: "00:00",
      endTime: "23:59",
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

  // ── Upcoming (tomorrow) ────────────────────────────────────
  {
    lng: 121.029,
    lat: 14.551,
    event: {
      name: "Fuego",
      image: "https://placehold.co/600x300/7c2d12/fbbf24?text=Fuego",
      address: "88 Rockwell Dr, Makati",
      category: "Club",
      date: TOMORROW,
      startTime: "23:00",
      endTime: "05:00",
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
    event: {
      name: "Velvet",
      image: "https://placehold.co/600x300/4a1942/f472b6?text=Velvet",
      address: "18 Salcedo St, Makati",
      category: "Lounge",
      date: TOMORROW,
      startTime: "20:00",
      endTime: "02:00",
      featured: true,
      attending: 98,
      dj: {
        name: "Soulée",
        avatar: "https://placehold.co/80x80/ec4899/fff?text=SL",
        genre: "R&B",
      },
      created_by: "user_123",
    },
  },

  // ── Upcoming (2 days out) ──────────────────────────────────
  {
    lng: 121.03,
    lat: 14.554,
    event: {
      name: "Yard",
      image: "https://placehold.co/600x300/14532d/4ade80?text=Yard",
      address: "33 Amorsolo St, Makati",
      category: "Outdoor Bar",
      date: TWO_DAYS_OUT,
      startTime: "19:00",
      endTime: "01:00",
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

  // ── Upcoming (3 days out) ──────────────────────────────────
  {
    lng: 121.0205,
    lat: 14.55,
    event: {
      name: "Studio 54 MNL",
      image: "https://placehold.co/600x300/451a03/fbbf24?text=Studio+54",
      address: "8 Leviste St, Makati",
      category: "Retro Club",
      date: THREE_DAYS_OUT,
      startTime: "22:00",
      endTime: "04:00",
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

const meta: Meta<typeof MapView> = {
  title: "Pages/MapView",
  component: MapView,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    nextjs: { appDirectory: true },
  },
  decorators: [
    (Story) => (
      <div className="h-svh w-full">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MapView>;

export const Default: Story = {
  args: {
    venues: MOCK_VENUES,
    defaultDate: new Date(),
  },
};

export const Empty: Story = {
  args: {
    venues: [],
  },
};
