import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { EventCalendarView } from "@/components/dj/EventCalendarView";
import type { DJEvent } from "@/components/dj/dj-event.types";
import { MOCK_EVENTS } from "./dj-event.fixtures";

// Three events on Apr 18 to show the "+N more" overflow.
const SAME_DAY_EVENTS: DJEvent[] = [
  ...MOCK_EVENTS.filter((e) => e.date === "2026-04-18"),
  {
    ...MOCK_EVENTS[0]!,
    id: "after-hours",
    status: "upcoming",
    name: "After Hours",
    date: "2026-04-18",
    startTime: "04:00",
    endTime: "08:00",
  },
];

const meta: Meta<typeof EventCalendarView> = {
  title: "DJ/EventCalendarView",
  component: EventCalendarView,
  args: { onView: fn(), onEdit: fn() },
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-200 bg-background p-6">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof EventCalendarView>;

export const Default: Story = {
  args: { events: MOCK_EVENTS },
};

export const SameDayEvents: Story = {
  name: "Same-day events",
  args: { events: SAME_DAY_EVENTS },
};

export const EmptyMonth: Story = {
  name: "Empty month",
  args: { events: [] },
};
