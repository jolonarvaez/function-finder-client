import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SettingsView } from "@/components/settings/SettingsView";

const meta: Meta<typeof SettingsView> = {
  title: "Pages/Settings/SettingsView",
  component: SettingsView,
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
type Story = StoryObj<typeof SettingsView>;

export const Default: Story = {};
