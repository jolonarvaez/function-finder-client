import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { DJEventsContent } from "@/components/dj/DJEventsView";
import type { DJEvent } from "@/components/dj/dj-event.types";
import { MOCK_EVENTS } from "@/stories/dj/dj-event.fixtures";

const UPCOMING_ONLY: DJEvent[] = MOCK_EVENTS.filter((e) => e.status === "upcoming");
const PAST_ONLY: DJEvent[] = MOCK_EVENTS.filter((e) => e.status === "done");

const meta: Meta<typeof DJEventsContent> = {
  title: "Pages/DJEventManager",
  component: DJEventsContent,
  parameters: {
    layout: "fullscreen",
    nextjs: { appDirectory: true },
  },
  args: { onView: fn(), onEdit: fn() },
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-107.5 overflow-hidden bg-background">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof DJEventsContent>;

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

export const CalendarView: Story = {
  name: "Calendar view",
  args: { events: MOCK_EVENTS, defaultView: "calendar" },
};

export const Loading: Story = {
  args: { events: [], loading: true },
};
