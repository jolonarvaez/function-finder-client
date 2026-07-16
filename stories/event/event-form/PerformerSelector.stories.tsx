import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PerformerSelector } from "@/components/event/event-form/PerformerSelector";
import type { Performer } from "@/components/event/event-form/types";

const CURRENT_USER: Performer = {
  id: "user-001",
  display_name: "DJ AXLS",
  avatar_url: null,
  genre_tags: ["House", "Techno"],
  set_start_time: "",
  set_end_time: "",
};

const MOCK_DJS: Performer[] = [
  CURRENT_USER,
  {
    id: "dj-002",
    display_name: "DJ Marco",
    avatar_url: "https://placehold.co/96x96/1a1a2e/e0e0ff?text=M",
    genre_tags: ["House", "Techno"],
    set_start_time: "",
    set_end_time: "",
  },
  {
    id: "dj-003",
    display_name: "DJ Soleil",
    avatar_url: "https://placehold.co/96x96/0d1b2a/f4c542?text=S",
    genre_tags: ["Soul", "RnB"],
    set_start_time: "",
    set_end_time: "",
  },
  {
    id: "dj-004",
    display_name: "DJ Kade",
    avatar_url: null,
    genre_tags: ["DnB", "Techno"],
    set_start_time: "",
    set_end_time: "",
  },
  {
    id: "dj-005",
    display_name: "Solenoid",
    avatar_url: null,
    genre_tags: [],
    set_start_time: "",
    set_end_time: "",
  },
];

// Fixture-backed search so stories never hit the network.
async function mockSearch(query: string): Promise<Performer[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return MOCK_DJS.filter((d) => d.display_name.toLowerCase().includes(query.toLowerCase()));
}

const meta: Meta<typeof PerformerSelector> = {
  title: "Components/Event/EventForm/PerformerSelector",
  component: PerformerSelector,
  tags: ["autodocs"],
  args: {
    onChange: () => {},
    currentUser: CURRENT_USER,
    search: mockSearch,
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
type Story = StoryObj<typeof PerformerSelector>;

export const Empty: Story = {
  name: "Empty (Add myself visible)",
  args: {
    selected: [],
  },
};

export const WithSelected: Story = {
  name: "With selected performers",
  args: {
    selected: [CURRENT_USER, MOCK_DJS[1]!, MOCK_DJS[2]!],
  },
};

export const WithSetTimes: Story = {
  name: "With set times",
  args: {
    selected: [
      { ...CURRENT_USER, set_start_time: "22:00", set_end_time: "23:30" },
      { ...MOCK_DJS[1]!, set_start_time: "23:30", set_end_time: "01:00" },
      { ...MOCK_DJS[2]!, set_start_time: "01:00", set_end_time: "03:00" },
    ],
  },
};

export const SinglePerformer: Story = {
  name: "Single performer (set times disabled)",
  args: {
    selected: [CURRENT_USER],
  },
};

export const WithoutCurrentUser: Story = {
  name: "Without current user",
  args: {
    selected: [MOCK_DJS[3]!],
    currentUser: null,
  },
};

export const Interactive: Story = {
  name: "Interactive (mock search — try “dj”)",
  render: (args) => {
    const [selected, setSelected] = React.useState<Performer[]>([CURRENT_USER]);
    return <PerformerSelector {...args} selected={selected} onChange={setSelected} />;
  },
};
