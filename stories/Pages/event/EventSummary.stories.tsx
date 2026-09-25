import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { EventSummary } from "@/components/event/event-form/EventSummary";
import type { EventSummaryData } from "@/components/event/event-form/types";

const BASE: EventSummaryData = {
  name: "Neon Dreams",
  description: "A late-night run through deep house and melodic techno. Doors at 10, no re-entry.",
  category: "Nightclub",
  dateLabel: "Friday, July 19, 2026",
  timeLabel: "10PM - 4AM",
  timezoneLabel: "Asia/Manila (UTC+08:00)",
  entryLabel: "₱500",
  ticketLink: "https://tickets.example.com/neon-dreams",
  genres: ["House", "Techno"],
  performers: [
    {
      id: "dj-001",
      name: "DJ Lumen",
      genres: ["House", "Disco"],
      avatarUrl: "https://placehold.co/96x96/1a1a1a/666666?text=DL",
      setTime: "10PM - 12AM",
    },
    {
      id: "dj-002",
      name: "DJ Soleil",
      genres: ["Techno"],
      avatarUrl: "https://placehold.co/96x96/1a1a1a/666666?text=DS",
      setTime: "12AM - 2AM",
    },
  ],
  address: "123 Ayala Ave, Makati, Metro Manila",
  imagePreviews: [
    "https://placehold.co/400x400/1a1a1a/666666?text=1",
    "https://placehold.co/400x400/1a1a1a/666666?text=2",
    "https://placehold.co/400x400/1a1a1a/666666?text=3",
  ],
};

const meta: Meta<typeof EventSummary> = {
  title: "Pages/Event/EventSummary",
  component: EventSummary,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", nextjs: { appDirectory: true } },
  args: { data: BASE, onConfirm: () => {}, onBack: () => {} },
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-200 overflow-hidden bg-background">
        <div className="px-4 py-6">
          <Story />
        </div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof EventSummary>;

/** Everything filled in — the state a thorough organizer reaches. */
export const Default: Story = {};

/** Only the required fields. Every conditional row collapses away. */
export const Minimal: Story = {
  name: "Minimal — required fields only",
  args: {
    data: {
      ...BASE,
      description: "",
      entryLabel: "Free entry",
      ticketLink: null,
      performers: [],
      imagePreviews: [],
    },
  },
};

/** The common real case: a lineup booked before set times are decided. */
export const NoSetTimes: Story = {
  args: {
    data: {
      ...BASE,
      performers: BASE.performers.map((p) => ({ ...p, setTime: undefined })),
    },
  },
};

export const Submitting: Story = {
  args: { submitting: true },
};

export const WithError: Story = {
  args: { error: "Failed to create event. Please try again." },
};

/** Stress test: wrapping, truncation, and the sticky footer on a tall page. */
export const LongContent: Story = {
  args: {
    data: {
      ...BASE,
      name: "Subterranean Frequencies presents: An All-Night Warehouse Excursion",
      description:
        "Six hours across three rooms. The main floor runs deep and melodic until midnight before handing over to harder, faster material through to close. Room two is strictly disco and boogie all night. Room three is an ambient chill-out space with floor seating and a slower tempo throughout. Cloakroom available. No photography on the dancefloor.",
      address:
        "Unit 4B, The Old Bottling Plant, 1187 Chino Roces Avenue Extension, Barangay Magallanes, Makati City, Metro Manila 1232",
      genres: ["House", "Techno", "Disco", "DnB", "Soul"],
      performers: [
        ...BASE.performers,
        { id: "dj-003", name: "DJ Kade", genres: ["DnB"], setTime: "2AM - 3AM" },
        { id: "dj-004", name: "DJ Aria", genres: ["Soul", "Disco"], setTime: "3AM - 4AM" },
        { id: "dj-005", name: "DJ Nova", genres: ["House"], setTime: undefined },
      ],
      imagePreviews: [
        ...BASE.imagePreviews,
        "https://placehold.co/400x400/1a1a1a/666666?text=4",
        "https://placehold.co/400x400/1a1a1a/666666?text=5",
      ],
    },
  },
};
