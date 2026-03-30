import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { BottomNav } from "@/components/BottomNav"

const meta: Meta<typeof BottomNav> = {
  title: "Components/BottomNav",
  component: BottomNav,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-200 bg-background p-6 flex items-center justify-center">
        <div>
          <Story />
        </div>
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof BottomNav>

export const Default: Story = {}

export const WithContent: Story = {
  args: {
    mapContent: (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        Map view
      </div>
    ),
    barsContent: (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        Bars list
      </div>
    ),
    profileContent: (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        Profile page
      </div>
    ),
  },
}
