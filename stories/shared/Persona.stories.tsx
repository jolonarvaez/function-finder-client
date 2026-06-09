import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Persona } from "@/components/shared/Persona";

const meta: Meta<typeof Persona> = {
  title: "Components/Persona",
  component: Persona,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-200 bg-background p-6 flex items-center justify-center min-h-32">
        <div className="w-full">
          <Story />
        </div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Persona>;

const defaultArgs = {
  name: "DJ Nexus",
  genre: ["House"],
  avatarSrc: "https://i.pravatar.cc/150?img=11",
  avatarFallback: "DN",
};

export const Full: Story = {
  args: {
    ...defaultArgs,
    variant: "full",
    isActive: true,
    venue: "Live at Pulse",
  },
};

export const FullWithNextEvent: Story = {
  args: {
    ...defaultArgs,
    variant: "full",
    isActive: false,
    nextEvent: "Noir · Tonight",
  },
};

export const Min: Story = {
  args: {
    ...defaultArgs,
    variant: "min",
    isActive: true,
  },
};

export const MinInactive: Story = {
  args: {
    ...defaultArgs,
    variant: "min",
    isActive: false,
  },
};
